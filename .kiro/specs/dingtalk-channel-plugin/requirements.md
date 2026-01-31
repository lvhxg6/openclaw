# Requirements Document

## Introduction

This document defines the requirements for the OpenClaw DingTalk Channel Plugin. The plugin enables OpenClaw to connect to DingTalk (钉钉) enterprise messaging platform using the Stream mode, allowing users to interact with OpenClaw agents through DingTalk group chats and direct messages.

## Glossary

- **DingTalk_Plugin**: The OpenClaw extension that provides DingTalk messaging channel integration
- **Stream_Client**: The component that maintains a persistent WebSocket connection to DingTalk servers using the dingtalk-stream SDK
- **Session_Webhook**: A temporary URL provided by DingTalk for replying to messages, valid for approximately 2 hours
- **App_Key**: The Client ID credential from DingTalk Open Platform (also called clientId)
- **App_Secret**: The Client Secret credential from DingTalk Open Platform (also called clientSecret)
- **Conversation_ID**: A unique identifier for a DingTalk chat (group or direct message)
- **Gateway**: The OpenClaw background service that manages channel connections
- **Inbound_Message**: A message received from DingTalk users
- **Outbound_Message**: A reply sent back to DingTalk users

## Requirements

### Requirement 1: Stream Connection Management

**User Story:** As a system administrator, I want the plugin to establish and maintain a persistent Stream connection to DingTalk, so that the bot can receive messages in real-time.

#### Acceptance Criteria

1. WHEN the Gateway starts the DingTalk account, THE Stream_Client SHALL establish a WebSocket connection using the configured App_Key and App_Secret
2. WHEN the Stream connection is established, THE DingTalk_Plugin SHALL register a callback listener for the `/v1.0/im/bot/messages/get` topic
3. IF the dingtalk-stream module is not installed, THEN THE DingTalk_Plugin SHALL log an error and set the status to not running
4. WHEN the Gateway stops the DingTalk account, THE Stream_Client SHALL gracefully disconnect from the DingTalk servers
5. THE DingTalk_Plugin SHALL update connection status (running, connected, lastConnectedAt, lastError) when connection state changes

### Requirement 2: Message Reception

**User Story:** As a DingTalk user, I want to send messages to the bot, so that I can interact with OpenClaw agents.

#### Acceptance Criteria

1. WHEN a message is received from DingTalk, THE DingTalk_Plugin SHALL parse the message payload including conversationId, senderId, senderNick, text content, and conversationType
2. WHEN a group message is received, THE DingTalk_Plugin SHALL check if the bot was mentioned (isInAtList field)
3. WHEN a group message does not mention the bot AND requireMention is enabled, THE DingTalk_Plugin SHALL ignore the message
4. WHEN a valid message is received, THE DingTalk_Plugin SHALL store the sessionWebhook for later replies
5. WHEN a message is processed, THE DingTalk_Plugin SHALL forward it to the OpenClaw inbound message handler with proper context

### Requirement 3: Message Reply

**User Story:** As a DingTalk user, I want to receive replies from the bot, so that I can get responses to my queries.

#### Acceptance Criteria

1. WHEN sending a reply, THE DingTalk_Plugin SHALL use the stored sessionWebhook for the conversation
2. IF the sessionWebhook has expired, THEN THE DingTalk_Plugin SHALL return an error indicating the webhook is no longer valid
3. WHEN sending a text message, THE DingTalk_Plugin SHALL POST to the sessionWebhook with msgtype "text"
4. IF the DingTalk API returns an error, THEN THE DingTalk_Plugin SHALL return the error code and message
5. THE DingTalk_Plugin SHALL support a text chunk limit of 4000 characters per message

### Requirement 4: Configuration Management

**User Story:** As a system administrator, I want to configure the DingTalk plugin through config files or environment variables, so that I can set up the bot without modifying code.

#### Acceptance Criteria

1. THE DingTalk_Plugin SHALL read App_Key from config path `channels.dingtalk.appKey` or environment variable `DINGTALK_APP_KEY`
2. THE DingTalk_Plugin SHALL read App_Secret from config path `channels.dingtalk.appSecret` or environment variable `DINGTALK_APP_SECRET`
3. WHEN both config and environment variable are set, THE DingTalk_Plugin SHALL prefer the config value
4. THE DingTalk_Plugin SHALL support multiple accounts through `channels.dingtalk.accounts` configuration
5. WHEN no account configuration exists but top-level credentials are present, THE DingTalk_Plugin SHALL use them as the "default" account

### Requirement 5: Security and Access Control

**User Story:** As a system administrator, I want to control who can interact with the bot, so that I can prevent unauthorized access.

#### Acceptance Criteria

1. THE DingTalk_Plugin SHALL support dmPolicy configuration with values "open", "pairing", or "closed"
2. WHEN dmPolicy is "pairing", THE DingTalk_Plugin SHALL require users to be in the allowFrom list or complete pairing
3. THE DingTalk_Plugin SHALL support allowFrom configuration to whitelist specific user IDs
4. THE DingTalk_Plugin SHALL support per-group requireMention configuration through the groups config
5. WHEN requireMention is true for a group, THE DingTalk_Plugin SHALL only respond to messages that @ the bot

### Requirement 6: Status Reporting

**User Story:** As a system administrator, I want to monitor the plugin status, so that I can troubleshoot connection issues.

#### Acceptance Criteria

1. THE DingTalk_Plugin SHALL report whether the account is configured (has appKey and appSecret)
2. THE DingTalk_Plugin SHALL report the running and connected status
3. THE DingTalk_Plugin SHALL report lastConnectedAt, lastInboundAt, and lastOutboundAt timestamps
4. THE DingTalk_Plugin SHALL report lastError when connection or message handling fails
5. THE DingTalk_Plugin SHALL report the appKeySource as "config", "env", or "none"

### Requirement 7: Plugin Registration

**User Story:** As a developer, I want the plugin to follow OpenClaw's plugin architecture, so that it integrates seamlessly with the system.

#### Acceptance Criteria

1. THE DingTalk_Plugin SHALL export a default plugin object with id, name, description, and register function
2. WHEN registered, THE DingTalk_Plugin SHALL call api.registerChannel with the channel plugin implementation
3. THE DingTalk_Plugin SHALL implement the ChannelPlugin interface with required methods (config, security, outbound, status, gateway)
4. THE DingTalk_Plugin SHALL declare reload config prefixes as ["channels.dingtalk"]
5. THE DingTalk_Plugin SHALL set capabilities to support "direct" and "group" chat types
