# Implementation Plan: DingTalk Channel Plugin

## Overview

This plan addresses completing and fixing the existing DingTalk plugin implementation. The plugin files already exist but have several issues that need to be resolved, including incorrect API usage, missing imports, and incomplete functionality.

## Tasks

- [x] 1. Fix configuration module issues
  - [x] 1.1 Add missing DEFAULT_ACCOUNT_ID constant to config.ts
    - Define `const DEFAULT_ACCOUNT_ID = "default"` or import from plugin-sdk
    - _Requirements: 4.5_
  
  - [x] 1.2 Write property tests for credential resolution
    - **Property 12: Credential resolution precedence**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [x] 1.3 Write property tests for account listing
    - **Property 13: Multi-account listing**
    - **Property 14: Default account fallback**
    - **Validates: Requirements 4.4, 4.5**

- [x] 2. Fix channel.ts inbound message handling
  - [x] 2.1 Update handleInbound call to use correct API
    - Change `runtime.inbound.handleInbound` to `runtime.channel.reply.handleInboundMessage`
    - Update the context object to match the expected interface (channel, accountId, senderId, chatType, chatId, text, reply)
    - _Requirements: 2.5_
  
  - [x] 2.2 Add missing DEFAULT_ACCOUNT_ID import
    - Import `DEFAULT_ACCOUNT_ID` from `openclaw/plugin-sdk`
    - _Requirements: 7.3_
  
  - [x] 2.3 Write property tests for message forwarding
    - **Property 8: Message forwarding context**
    - **Validates: Requirements 2.5**

- [x] 3. Implement sessionWebhook expiration handling
  - [x] 3.1 Fix getSessionWebhook to properly check expiration
    - Ensure expiration check uses milliseconds consistently
    - Return undefined when expired and clean up the entry
    - _Requirements: 3.2_
  
  - [x] 3.2 Write property tests for webhook storage
    - **Property 7: SessionWebhook storage round-trip**
    - **Property 9: Webhook expiration handling**
    - **Validates: Requirements 2.4, 3.1, 3.2**

- [x] 4. Checkpoint - Verify core functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Fix stream.ts connection handling
  - [x] 5.1 Verify DWClient initialization parameters
    - Ensure clientId and clientSecret are passed correctly
    - _Requirements: 1.1_
  
  - [x] 5.2 Add proper error handling for connection failures
    - Catch errors from client.start() and update status
    - _Requirements: 1.3_
  
  - [x] 5.3 Write property tests for connection lifecycle
    - **Property 1: Connection establishment with credentials**
    - **Property 2: Callback registration for message topic**
    - **Property 3: Graceful disconnection**
    - **Property 4: Status updates on state changes**
    - **Validates: Requirements 1.1, 1.2, 1.4, 1.5**

- [x] 6. Implement mention filtering logic
  - [x] 6.1 Add resolveRequireMention implementation
    - Check groups[groupId].requireMention, then groups["*"].requireMention, default to true
    - _Requirements: 5.4_
  
  - [x] 6.2 Fix group message filtering in onMessage handler
    - Check isInAtList and requireMention before processing
    - _Requirements: 2.2, 2.3_
  
  - [x] 6.3 Write property tests for mention filtering
    - **Property 6: Mention filtering for group messages**
    - **Property 16: Per-group requireMention resolution**
    - **Validates: Requirements 2.2, 2.3, 5.4**

- [x] 7. Implement access control
  - [x] 7.1 Add DM policy enforcement in message handler
    - Check dmPolicy and allowFrom before processing DM messages
    - _Requirements: 5.1, 5.2_
  
  - [x] 7.2 Write property tests for access control
    - **Property 15: AllowFrom access control**
    - **Validates: Requirements 5.2, 5.3**

- [x] 8. Checkpoint - Verify security features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Complete status reporting
  - [x] 9.1 Verify buildAccountSnapshot returns all required fields
    - Ensure accountId, name, enabled, configured, appKeySource, running, connected, lastConnectedAt, lastError, lastInboundAt, lastOutboundAt are all present
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 9.2 Write property tests for status snapshot
    - **Property 17: Status snapshot completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 10. Fix client.ts reply functionality
  - [x] 10.1 Verify replyMessage POST format
    - Ensure msgtype is "text" and text.content contains the message
    - _Requirements: 3.3_
  
  - [x] 10.2 Add proper error code extraction from DingTalk response
    - Parse errcode and errmsg from response
    - _Requirements: 3.4_
  
  - [x] 10.3 Write property tests for reply format
    - **Property 10: Reply message format**
    - **Property 11: API error propagation**
    - **Validates: Requirements 3.3, 3.4**

- [x] 11. Verify plugin registration
  - [x] 11.1 Ensure index.ts exports correct plugin structure
    - Verify id, name, description, configSchema, register function
    - _Requirements: 7.1, 7.2_
  
  - [x] 11.2 Verify channel plugin capabilities and reload config
    - Ensure chatTypes includes "direct" and "group"
    - Ensure reload.configPrefixes is ["channels.dingtalk"]
    - _Requirements: 7.4, 7.5_

- [x] 12. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required for comprehensive coverage
- The existing code has the basic structure but needs fixes for API compatibility
- Property tests should use `fast-check` or similar library with minimum 100 iterations
- Each property test should be tagged with the format: `Feature: dingtalk-channel-plugin, Property N: description`
