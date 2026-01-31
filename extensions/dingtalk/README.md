# OpenClaw 钉钉插件

钉钉机器人插件，使用 Stream 模式接收和发送消息。

## 功能

- ✅ 接收群聊消息（需要 @ 机器人）
- ✅ 接收私聊消息
- ✅ 回复文本消息
- ✅ 多账号支持
- ⬜ 发送图片/文件（待实现）
- ⬜ Markdown 消息（待实现）

## 安装

### 1. 安装依赖

```bash
cd extensions/dingtalk
pnpm install
```

### 2. 启用插件

在 `~/.openclaw/openclaw.json` 中添加：

```json5
{
  plugins: {
    entries: {
      dingtalk: { enabled: true }
    }
  }
}
```

## 配置

### 基本配置

```json5
// ~/.openclaw/openclaw.json
{
  channels: {
    dingtalk: {
      enabled: true,
      appKey: "your-app-key",      // 从钉钉开放平台获取
      appSecret: "your-app-secret", // 从钉钉开放平台获取
      
      // 安全设置
      dmPolicy: "open",  // open | pairing | closed
      allowFrom: ["*"],  // 允许的用户 ID，* 表示所有人
      
      // 群聊设置
      groups: {
        "*": {
          requireMention: true  // 需要 @ 机器人才响应
        }
      }
    }
  }
}
```

### 使用环境变量

```bash
export DINGTALK_APP_KEY="your-app-key"
export DINGTALK_APP_SECRET="your-app-secret"
```

### 多账号配置

```json5
{
  channels: {
    dingtalk: {
      enabled: true,
      accounts: {
        work: {
          enabled: true,
          name: "工作机器人",
          appKey: "work-app-key",
          appSecret: "work-app-secret"
        },
        personal: {
          enabled: true,
          name: "个人机器人",
          appKey: "personal-app-key",
          appSecret: "personal-app-secret"
        }
      }
    }
  }
}
```

## 钉钉开放平台配置

1. 访问 https://open.dingtalk.com/
2. 创建应用 → 添加「机器人」能力
3. 消息接收模式选择「Stream 模式」
4. 获取 Client ID (appKey) 和 Client Secret (appSecret)
5. 发布应用
6. 在钉钉群里添加你的机器人

## 使用

启动 OpenClaw Gateway 后，在钉钉群里 @ 你的机器人发送消息即可。

```
@OpenClaw 你好，今天天气怎么样？
```

## 故障排除

### 连接失败

检查：
- appKey 和 appSecret 是否正确
- 应用是否已发布
- 机器人是否已添加到群里

### 收不到消息

检查：
- 消息接收模式是否为「Stream 模式」
- 群聊是否需要 @ 机器人
- allowFrom 配置是否正确

### 无法回复

- sessionWebhook 有效期约 2 小时
- 确保在有效期内回复
