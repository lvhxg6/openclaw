/**
 * 钉钉 Channel 插件实现
 */

import type { ChannelPlugin } from "openclaw/plugin-sdk";
import {
  DEFAULT_ACCOUNT_ID,
  formatPairingApproveHint,
} from "openclaw/plugin-sdk";

import {
  listDingtalkAccountIds,
  resolveDingtalkAccount,
  type ResolvedDingtalkAccount,
} from "./config.js";
import { replyMessage, type DingtalkMessage } from "./client.js";
import { startStreamMonitor } from "./stream.js";
import { getDingtalkRuntime } from "./runtime.js";

const meta = {
  id: "dingtalk",
  label: "钉钉",
  selectionLabel: "钉钉机器人 (Stream)",
  detailLabel: "钉钉机器人",
  docsPath: "/channels/dingtalk",
  docsLabel: "dingtalk",
  blurb: "钉钉企业机器人，使用 Stream 模式接收消息",
  systemImage: "message",
  order: 70,
} as const;

// 存储 sessionWebhook 用于回复
const sessionWebhooks = new Map<string, { webhook: string; expiresAt: number }>();

function storeSessionWebhook(conversationId: string, webhook: string, expiresAt: number) {
  sessionWebhooks.set(conversationId, { webhook, expiresAt });
}

function getSessionWebhook(conversationId: string): string | undefined {
  const entry = sessionWebhooks.get(conversationId);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    sessionWebhooks.delete(conversationId);
    return undefined;
  }
  return entry.webhook;
}

export const dingtalkPlugin: ChannelPlugin<ResolvedDingtalkAccount> = {
  id: "dingtalk",
  meta,
  
  capabilities: {
    chatTypes: ["direct", "group"],
    media: false, // 暂不支持媒体
  },
  
  reload: { configPrefixes: ["channels.dingtalk"] },
  
  config: {
    listAccountIds: (cfg) => listDingtalkAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveDingtalkAccount(cfg, accountId),
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    isConfigured: (account) => Boolean(account.appKey && account.appSecret),
    describeAccount: (account) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appKey && account.appSecret),
      appKeySource: account.appKeySource,
    }),
  },
  
  security: {
    resolveDmPolicy: ({ account }) => ({
      policy: account.config.dmPolicy ?? "pairing",
      allowFrom: account.config.allowFrom ?? [],
      policyPath: "channels.dingtalk.dmPolicy",
      allowFromPath: "channels.dingtalk.allowFrom",
      approveHint: formatPairingApproveHint("dingtalk"),
      normalizeEntry: (raw) => raw.trim().toLowerCase(),
    }),
  },
  
  groups: {
    resolveRequireMention: ({ cfg, groupId, accountId }) => {
      // 从配置中读取群组设置
      const dingtalkCfg = cfg.channels?.dingtalk as {
        accounts?: Record<string, { groups?: Record<string, { requireMention?: boolean }> }>;
        groups?: Record<string, { requireMention?: boolean }>;
      } | undefined;
      
      // 尝试从账户配置中获取
      const normalizedAccountId = accountId?.trim()?.toLowerCase() ?? "default";
      const accountCfg = dingtalkCfg?.accounts?.[normalizedAccountId];
      const groupConfig = accountCfg?.groups?.[groupId ?? ""] ?? 
                          accountCfg?.groups?.["*"] ??
                          dingtalkCfg?.groups?.[groupId ?? ""] ??
                          dingtalkCfg?.groups?.["*"];
      
      return groupConfig?.requireMention ?? true; // 默认需要 @
    },
  },
  
  outbound: {
    deliveryMode: "direct",
    textChunkLimit: 4000,
    
    resolveTarget: ({ to }) => {
      if (!to?.trim()) {
        return { ok: false, error: new Error("需要指定 conversationId") };
      }
      return { ok: true, to: to.trim() };
    },
    
    sendText: async ({ to, text }) => {
      const webhook = getSessionWebhook(to);
      if (!webhook) {
        return {
          ok: false,
          error: "sessionWebhook 已过期或不存在，无法回复",
          channel: "dingtalk",
        };
      }
      
      const result = await replyMessage(webhook, text);
      return { channel: "dingtalk", ...result };
    },
  },
  
  status: {
    defaultRuntime: {
      accountId: DEFAULT_ACCOUNT_ID,
      running: false,
      connected: false,
      lastConnectedAt: null,
      lastError: null,
    },
    
    buildChannelSummary: ({ snapshot }) => ({
      configured: snapshot.configured ?? false,
      running: snapshot.running ?? false,
      connected: snapshot.connected ?? false,
      lastError: snapshot.lastError ?? null,
    }),
    
    buildAccountSnapshot: ({ account, runtime }) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: Boolean(account.appKey && account.appSecret),
      appKeySource: account.appKeySource,
      running: runtime?.running ?? false,
      connected: runtime?.connected ?? false,
      lastConnectedAt: runtime?.lastConnectedAt ?? null,
      lastError: runtime?.lastError ?? null,
      lastInboundAt: runtime?.lastInboundAt ?? null,
      lastOutboundAt: runtime?.lastOutboundAt ?? null,
    }),
  },
  
  setup: {
    resolveAccountId: ({ accountId }) => accountId?.trim()?.toLowerCase() ?? DEFAULT_ACCOUNT_ID,
    
    validateInput: ({ accountId, input }) => {
      const useEnv = (input as { useEnv?: boolean }).useEnv;
      const appKey = (input as { appKey?: string }).appKey;
      const appSecret = (input as { appSecret?: string }).appSecret;
      
      if (useEnv && accountId !== DEFAULT_ACCOUNT_ID) {
        return "环境变量只能用于默认账号";
      }
      if (!useEnv && (!appKey || !appSecret)) {
        return "钉钉需要 appKey 和 appSecret（或使用 --use-env）";
      }
      return null;
    },
    
    applyAccountConfig: ({ cfg, accountId, input }) => {
      const useEnv = (input as { useEnv?: boolean }).useEnv;
      const appKey = (input as { appKey?: string }).appKey;
      const appSecret = (input as { appSecret?: string }).appSecret;
      const name = (input as { name?: string }).name;
      
      const channels = cfg.channels ?? {};
      const dingtalk = (channels.dingtalk ?? {}) as Record<string, unknown>;
      
      if (accountId === DEFAULT_ACCOUNT_ID) {
        return {
          ...cfg,
          channels: {
            ...channels,
            dingtalk: {
              ...dingtalk,
              enabled: true,
              ...(name ? { name } : {}),
              ...(useEnv ? {} : { appKey, appSecret }),
            },
          },
        };
      }
      
      // 多账号配置
      const accounts = (dingtalk.accounts ?? {}) as Record<string, unknown>;
      return {
        ...cfg,
        channels: {
          ...channels,
          dingtalk: {
            ...dingtalk,
            accounts: {
              ...accounts,
              [accountId]: {
                enabled: true,
                ...(name ? { name } : {}),
                appKey,
                appSecret,
              },
            },
          },
        },
      };
    },
  },
  
  gateway: {
    startAccount: async (ctx) => {
      const account = ctx.account;
      
      if (!account.appKey || !account.appSecret) {
        ctx.log?.error(`[${account.accountId}] 缺少 appKey 或 appSecret`);
        ctx.setStatus({ running: false, lastError: "缺少 appKey 或 appSecret" });
        return { stop: async () => {} };
      }
      
      ctx.log?.info(`[${account.accountId}] 启动钉钉 Stream 连接...`);
      ctx.setStatus({ accountId: account.accountId });
      
      const runtime = getDingtalkRuntime();
      
      return startStreamMonitor({
        appKey: account.appKey,
        appSecret: account.appSecret,
        accountId: account.accountId,
        config: ctx.cfg,
        runtime,
        abortSignal: ctx.abortSignal,
        statusSink: (patch) => ctx.setStatus({ accountId: account.accountId, ...patch }),
        
        onMessage: async (message: DingtalkMessage) => {
          // 存储 webhook 用于回复
          storeSessionWebhook(
            message.conversationId,
            message.sessionWebhook,
            message.sessionWebhookExpiredTime,
          );
          
          const isGroup = message.conversationType === "2";
          const text = message.text?.content?.trim() ?? "";
          
          // 群聊检查是否 @ 了机器人
          if (isGroup && !message.isInAtList) {
            // 没有 @ 机器人，检查是否需要 mention
            const requireMention = dingtalkPlugin.groups?.resolveRequireMention?.({
              cfg: ctx.cfg,
              groupId: message.conversationId,
              accountId: account.accountId,
            }) ?? true;
            
            if (requireMention) {
              ctx.log?.debug(`[${account.accountId}] 群消息未 @ 机器人，忽略`);
              return;
            }
          }
          
          ctx.log?.info(`[${account.accountId}] 处理消息: ${text.slice(0, 50)}...`);
          
          // 解析路由
          const route = runtime.channel.routing.resolveAgentRoute({
            cfg: ctx.cfg,
            channel: "dingtalk",
            accountId: account.accountId,
            peer: {
              kind: isGroup ? "group" : "dm",
              id: message.conversationId,
            },
          });
          
          // 格式化消息
          const body = runtime.channel.reply.formatAgentEnvelope({
            channel: "钉钉",
            from: message.senderNick,
            timestamp: message.createAt,
            envelope: runtime.channel.reply.resolveEnvelopeFormatOptions(ctx.cfg),
            body: text,
          });
          
          // 构建 inbound context
          const ctxPayload = runtime.channel.reply.finalizeInboundContext({
            Body: body,
            RawBody: text,
            CommandBody: text,
            From: `dingtalk:user:${message.senderId}`,
            To: `dingtalk:${isGroup ? "group" : "dm"}:${message.conversationId}`,
            SessionKey: route.sessionKey,
            AccountId: route.accountId,
            ChatType: isGroup ? "group" : "direct",
            ConversationLabel: message.conversationTitle ?? message.conversationId,
            SenderName: message.senderNick,
            SenderId: message.senderId,
            Provider: "dingtalk",
            Surface: "dingtalk",
            MessageSid: message.msgId,
            OriginatingChannel: "dingtalk",
            OriginatingTo: `dingtalk:${isGroup ? "group" : "dm"}:${message.conversationId}`,
            ...(isGroup ? { GroupSubject: message.conversationTitle } : {}),
          });
          
          // 记录 session
          const storePath = runtime.channel.session.resolveStorePath(ctx.cfg.session?.store, {
            agentId: route.agentId,
          });
          await runtime.channel.session.recordInboundSession({
            storePath,
            sessionKey: ctxPayload.SessionKey ?? route.sessionKey,
            ctx: ctxPayload,
            onRecordError: (err) => {
              ctx.log?.error(`[${account.accountId}] 记录 session 失败: ${String(err)}`);
            },
          });
          
          // 调用 OpenClaw 处理消息并分发回复
          try {
            await runtime.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
              ctx: ctxPayload,
              cfg: ctx.cfg,
              dispatcherOptions: {
                deliver: async (payload) => {
                  if (!payload.text) return;
                  const webhook = getSessionWebhook(message.conversationId);
                  if (webhook) {
                    await replyMessage(webhook, payload.text);
                    ctx.setStatus({ lastOutboundAt: Date.now() });
                  }
                },
              },
            });
          } catch (error) {
            ctx.log?.error(`[${account.accountId}] 处理消息失败: ${String(error)}`);
            console.error(`[dingtalk][${account.accountId}] 处理消息失败:`, error);
            // 尝试回复错误信息
            const webhook = getSessionWebhook(message.conversationId);
            if (webhook) {
              await replyMessage(webhook, "抱歉，处理消息时出错了，请稍后再试。");
            }
          }
        },
      });
    },
  },
};
