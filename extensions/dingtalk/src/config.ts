import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk";

export interface DingtalkAccountConfig {
  enabled?: boolean;
  name?: string;
  appKey?: string;
  appSecret?: string;
  // 安全设置
  allowFrom?: string[];
  dmPolicy?: "open" | "pairing" | "closed";
  // 群聊设置
  groupPolicy?: "open" | "allowlist" | "closed";
  groupAllowFrom?: string[];
  groups?: Record<string, { requireMention?: boolean }>;
}

export interface DingtalkChannelConfig {
  enabled?: boolean;
  // 默认账号配置（向后兼容）
  appKey?: string;
  appSecret?: string;
  name?: string;
  allowFrom?: string[];
  dmPolicy?: "open" | "pairing" | "closed";
  groupPolicy?: "open" | "allowlist" | "closed";
  groupAllowFrom?: string[];
  groups?: Record<string, { requireMention?: boolean }>;
  // 多账号
  accounts?: Record<string, DingtalkAccountConfig>;
}

export interface ResolvedDingtalkAccount {
  accountId: string;
  name?: string;
  enabled: boolean;
  appKey?: string;
  appSecret?: string;
  appKeySource: "config" | "env" | "none";
  config: DingtalkAccountConfig;
}

export { DEFAULT_ACCOUNT_ID };

export function getDingtalkChannelConfig(cfg: OpenClawConfig): DingtalkChannelConfig | undefined {
  return (cfg.channels as Record<string, unknown>)?.dingtalk as DingtalkChannelConfig | undefined;
}

export function listDingtalkAccountIds(cfg: OpenClawConfig): string[] {
  const channelCfg = getDingtalkChannelConfig(cfg);
  if (!channelCfg) return [];
  
  const accounts = channelCfg.accounts ?? {};
  const hasAccounts = Object.keys(accounts).length > 0;
  
  // 如果有 accounts 配置，返回所有账号
  if (hasAccounts) {
    return Object.keys(accounts);
  }
  
  // 否则检查是否有顶层配置
  if (channelCfg.appKey || process.env.DINGTALK_APP_KEY) {
    return [DEFAULT_ACCOUNT_ID];
  }
  
  return [];
}

export function resolveDingtalkAccount(
  cfg: OpenClawConfig,
  accountId?: string,
): ResolvedDingtalkAccount {
  const channelCfg = getDingtalkChannelConfig(cfg);
  const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
  
  // 尝试从 accounts 获取
  const accountCfg = channelCfg?.accounts?.[resolvedAccountId];
  
  // 如果是默认账号且没有 accounts 配置，使用顶层配置
  const useTopLevel = resolvedAccountId === DEFAULT_ACCOUNT_ID && !accountCfg;
  const baseCfg = useTopLevel ? channelCfg : accountCfg;
  
  // 环境变量（仅默认账号）
  const envAppKey = resolvedAccountId === DEFAULT_ACCOUNT_ID ? process.env.DINGTALK_APP_KEY : undefined;
  const envAppSecret = resolvedAccountId === DEFAULT_ACCOUNT_ID ? process.env.DINGTALK_APP_SECRET : undefined;
  
  const appKey = baseCfg?.appKey ?? envAppKey;
  const appSecret = baseCfg?.appSecret ?? envAppSecret;
  
  let appKeySource: "config" | "env" | "none" = "none";
  if (baseCfg?.appKey) {
    appKeySource = "config";
  } else if (envAppKey) {
    appKeySource = "env";
  }
  
  return {
    accountId: resolvedAccountId,
    name: baseCfg?.name,
    enabled: baseCfg?.enabled ?? channelCfg?.enabled ?? false,
    appKey,
    appSecret,
    appKeySource,
    config: {
      enabled: baseCfg?.enabled ?? channelCfg?.enabled ?? false,
      allowFrom: baseCfg?.allowFrom ?? channelCfg?.allowFrom,
      dmPolicy: baseCfg?.dmPolicy ?? channelCfg?.dmPolicy ?? "pairing",
      groupPolicy: baseCfg?.groupPolicy ?? channelCfg?.groupPolicy ?? "allowlist",
      groupAllowFrom: baseCfg?.groupAllowFrom ?? channelCfg?.groupAllowFrom,
      groups: baseCfg?.groups ?? channelCfg?.groups,
    },
  };
}
