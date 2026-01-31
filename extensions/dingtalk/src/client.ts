/**
 * 钉钉 Stream 客户端封装
 */

export interface DingtalkMessage {
  conversationId: string;
  chatbotCorpId: string;
  chatbotUserId: string;
  msgId: string;
  senderNick: string;
  isAdmin: boolean;
  senderStaffId?: string;
  sessionWebhookExpiredTime: number;
  createAt: number;
  senderCorpId?: string;
  conversationType: "1" | "2"; // 1=单聊, 2=群聊
  senderId: string;
  conversationTitle?: string;
  isInAtList?: boolean;
  sessionWebhook: string;
  text: {
    content: string;
  };
  msgtype: string;
  atUsers?: Array<{
    dingtalkId: string;
    staffId?: string;
  }>;
  robotCode?: string;
}

export interface DingtalkSendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 通过 sessionWebhook 回复消息
 */
export async function replyMessage(
  sessionWebhook: string,
  text: string,
): Promise<DingtalkSendResult> {
  try {
    const response = await fetch(sessionWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: text,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const result = await response.json();
    if (result.errcode && result.errcode !== 0) {
      return { ok: false, error: `钉钉错误 ${result.errcode}: ${result.errmsg}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

/**
 * 发送 Markdown 消息
 */
export async function replyMarkdown(
  sessionWebhook: string,
  title: string,
  text: string,
): Promise<DingtalkSendResult> {
  try {
    const response = await fetch(sessionWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msgtype: "markdown",
        markdown: {
          title,
          text,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const result = await response.json();
    if (result.errcode && result.errcode !== 0) {
      return { ok: false, error: `钉钉错误 ${result.errcode}: ${result.errmsg}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
