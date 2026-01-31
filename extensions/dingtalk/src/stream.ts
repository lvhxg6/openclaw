/**
 * 钉钉 Stream 模式连接管理
 */

import type { OpenClawConfig } from "openclaw/plugin-sdk";
import type { PluginRuntime } from "openclaw/plugin-sdk";
import type { DingtalkMessage } from "./client.js";
import { replyMessage } from "./client.js";

export interface StreamMonitorParams {
  appKey: string;
  appSecret: string;
  accountId: string;
  config: OpenClawConfig;
  runtime: PluginRuntime;
  abortSignal?: AbortSignal;
  statusSink: (patch: Record<string, unknown>) => void;
  onMessage: (message: DingtalkMessage) => Promise<void>;
}

export interface StreamConnection {
  stop: () => Promise<void>;
}

/**
 * 启动 Stream 连接监听钉钉消息
 */
export async function startStreamMonitor(params: StreamMonitorParams): Promise<StreamConnection> {
  const { appKey, appSecret, accountId, statusSink, onMessage } = params;
  
  // 动态导入 dingtalk-stream
  let DWClient: typeof import("dingtalk-stream").DWClient;
  try {
    const streamModule = await import("dingtalk-stream");
    DWClient = streamModule.DWClient;
  } catch (error) {
    console.error("[dingtalk] 无法加载 dingtalk-stream 模块，请运行: pnpm install", error);
    statusSink({ running: false, lastError: "dingtalk-stream 模块未安装" });
    return { stop: async () => {} };
  }

  const client = new DWClient({
    clientId: appKey,
    clientSecret: appSecret,
  });

  let stopped = false;

  // 注册消息回调
  client.registerCallbackListener("/v1.0/im/bot/messages/get", (res) => {
    if (stopped) return;
    
    const messageId = res.headers.messageId;
    
    (async () => {
      try {
        const message = JSON.parse(res.data) as DingtalkMessage;
        console.log(`[dingtalk][${accountId}] 收到消息:`, {
          from: message.senderNick,
          content: message.text?.content?.slice(0, 50),
          type: message.conversationType === "1" ? "私聊" : "群聊",
        });
        
        statusSink({ lastInboundAt: Date.now() });
        
        await onMessage(message);
        
        // 响应成功
        client.socketCallBackResponse(messageId, { status: "SUCCESS" });
      } catch (error) {
        console.error(`[dingtalk][${accountId}] 处理消息失败:`, error);
        // 响应稍后重试
        client.socketCallBackResponse(messageId, { status: "LATER" });
      }
    })();
  });

  // 启动连接
  try {
    await client.connect();
    console.log(`[dingtalk][${accountId}] Stream 连接已建立`);
    statusSink({
      running: true,
      connected: true,
      lastConnectedAt: Date.now(),
      lastError: null,
    });
  } catch (error) {
    console.error(`[dingtalk][${accountId}] Stream 连接失败:`, error);
    statusSink({
      running: false,
      connected: false,
      lastError: String(error),
    });
    throw error;
  }

  // 监听中断信号
  params.abortSignal?.addEventListener("abort", () => {
    stopped = true;
    client.disconnect();
  });

  return {
    stop: async () => {
      stopped = true;
      try {
        client.disconnect();
        console.log(`[dingtalk][${accountId}] Stream 连接已断开`);
      } catch (error) {
        console.error(`[dingtalk][${accountId}] 断开连接失败:`, error);
      }
      statusSink({
        running: false,
        connected: false,
        lastStopAt: Date.now(),
      });
    },
  };
}
