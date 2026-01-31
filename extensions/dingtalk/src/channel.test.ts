/**
 * 钉钉 Channel 插件测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { dingtalkPlugin } from "./channel.js";
import type { OpenClawConfig } from "openclaw/plugin-sdk";

describe("dingtalkPlugin", () => {
  describe("meta", () => {
    it("has correct id", () => {
      expect(dingtalkPlugin.id).toBe("dingtalk");
    });

    it("has correct capabilities", () => {
      expect(dingtalkPlugin.capabilities.chatTypes).toContain("direct");
      expect(dingtalkPlugin.capabilities.chatTypes).toContain("group");
    });

    it("has correct reload config prefixes", () => {
      expect(dingtalkPlugin.reload?.configPrefixes).toEqual(["channels.dingtalk"]);
    });
  });

  describe("groups.resolveRequireMention", () => {
    const createAccount = (groups?: Record<string, { requireMention?: boolean }>) => ({
      accountId: "default",
      enabled: true,
      appKeySource: "config" as const,
      config: { groups },
    });

    it("returns true by default when no groups config", () => {
      const account = createAccount();
      const result = dingtalkPlugin.groups?.resolveRequireMention?.({
        account,
        groupId: "group1",
        cfg: {} as OpenClawConfig,
      });
      expect(result).toBe(true);
    });

    it("returns specific group config when available", () => {
      const account = createAccount({
        "group1": { requireMention: false },
        "*": { requireMention: true },
      });
      const result = dingtalkPlugin.groups?.resolveRequireMention?.({
        account,
        groupId: "group1",
        cfg: {} as OpenClawConfig,
      });
      expect(result).toBe(false);
    });

    it("falls back to wildcard config", () => {
      const account = createAccount({
        "*": { requireMention: false },
      });
      const result = dingtalkPlugin.groups?.resolveRequireMention?.({
        account,
        groupId: "unknown-group",
        cfg: {} as OpenClawConfig,
      });
      expect(result).toBe(false);
    });
  });

  describe("config.isConfigured", () => {
    it("returns true when both appKey and appSecret present", () => {
      const account = {
        accountId: "default",
        enabled: true,
        appKey: "key",
        appSecret: "secret",
        appKeySource: "config" as const,
        config: {},
      };
      expect(dingtalkPlugin.config.isConfigured(account)).toBe(true);
    });

    it("returns false when appKey missing", () => {
      const account = {
        accountId: "default",
        enabled: true,
        appSecret: "secret",
        appKeySource: "none" as const,
        config: {},
      };
      expect(dingtalkPlugin.config.isConfigured(account)).toBe(false);
    });

    it("returns false when appSecret missing", () => {
      const account = {
        accountId: "default",
        enabled: true,
        appKey: "key",
        appKeySource: "config" as const,
        config: {},
      };
      expect(dingtalkPlugin.config.isConfigured(account)).toBe(false);
    });
  });

  describe("outbound.resolveTarget", () => {
    it("returns error when to is empty", () => {
      const result = dingtalkPlugin.outbound.resolveTarget({ to: "" });
      expect(result.ok).toBe(false);
    });

    it("returns trimmed target when valid", () => {
      const result = dingtalkPlugin.outbound.resolveTarget({ to: "  conv123  " });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.to).toBe("conv123");
      }
    });
  });

  describe("status.buildAccountSnapshot", () => {
    it("returns all required fields (Property 17)", () => {
      const account = {
        accountId: "test",
        name: "Test Account",
        enabled: true,
        appKey: "key",
        appSecret: "secret",
        appKeySource: "config" as const,
        config: {},
      };
      const runtime = {
        running: true,
        connected: true,
        lastConnectedAt: 1234567890,
        lastError: null,
        lastInboundAt: 1234567891,
        lastOutboundAt: 1234567892,
      };

      const snapshot = dingtalkPlugin.status.buildAccountSnapshot({ account, runtime });

      expect(snapshot).toHaveProperty("accountId", "test");
      expect(snapshot).toHaveProperty("name", "Test Account");
      expect(snapshot).toHaveProperty("enabled", true);
      expect(snapshot).toHaveProperty("configured", true);
      expect(snapshot).toHaveProperty("appKeySource", "config");
      expect(snapshot).toHaveProperty("running", true);
      expect(snapshot).toHaveProperty("connected", true);
      expect(snapshot).toHaveProperty("lastConnectedAt", 1234567890);
      expect(snapshot).toHaveProperty("lastError", null);
      expect(snapshot).toHaveProperty("lastInboundAt", 1234567891);
      expect(snapshot).toHaveProperty("lastOutboundAt", 1234567892);
    });
  });
});
