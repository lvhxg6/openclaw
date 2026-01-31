/**
 * 钉钉插件配置模块测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getDingtalkChannelConfig,
  listDingtalkAccountIds,
  resolveDingtalkAccount,
  DEFAULT_ACCOUNT_ID,
} from "./config.js";
import type { OpenClawConfig } from "openclaw/plugin-sdk";

describe("config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getDingtalkChannelConfig", () => {
    it("returns undefined when no dingtalk config exists", () => {
      const cfg = { channels: {} } as OpenClawConfig;
      expect(getDingtalkChannelConfig(cfg)).toBeUndefined();
    });

    it("returns dingtalk config when present", () => {
      const cfg = {
        channels: {
          dingtalk: {
            enabled: true,
            appKey: "test-key",
          },
        },
      } as OpenClawConfig;
      const result = getDingtalkChannelConfig(cfg);
      expect(result).toEqual({
        enabled: true,
        appKey: "test-key",
      });
    });
  });

  describe("listDingtalkAccountIds", () => {
    it("returns empty array when no config", () => {
      const cfg = { channels: {} } as OpenClawConfig;
      expect(listDingtalkAccountIds(cfg)).toEqual([]);
    });

    it("returns default account when top-level appKey exists", () => {
      const cfg = {
        channels: {
          dingtalk: {
            appKey: "test-key",
          },
        },
      } as OpenClawConfig;
      expect(listDingtalkAccountIds(cfg)).toEqual([DEFAULT_ACCOUNT_ID]);
    });

    it("returns default account when env var exists", () => {
      process.env.DINGTALK_APP_KEY = "env-key";
      const cfg = {
        channels: {
          dingtalk: {},
        },
      } as OpenClawConfig;
      expect(listDingtalkAccountIds(cfg)).toEqual([DEFAULT_ACCOUNT_ID]);
    });

    it("returns account keys when accounts object exists", () => {
      const cfg = {
        channels: {
          dingtalk: {
            accounts: {
              work: { appKey: "work-key" },
              personal: { appKey: "personal-key" },
            },
          },
        },
      } as OpenClawConfig;
      expect(listDingtalkAccountIds(cfg)).toEqual(["work", "personal"]);
    });
  });

  describe("resolveDingtalkAccount", () => {
    it("resolves default account from top-level config", () => {
      const cfg = {
        channels: {
          dingtalk: {
            enabled: true,
            appKey: "config-key",
            appSecret: "config-secret",
            dmPolicy: "open",
          },
        },
      } as OpenClawConfig;
      
      const result = resolveDingtalkAccount(cfg);
      expect(result.accountId).toBe(DEFAULT_ACCOUNT_ID);
      expect(result.appKey).toBe("config-key");
      expect(result.appSecret).toBe("config-secret");
      expect(result.appKeySource).toBe("config");
      expect(result.config.dmPolicy).toBe("open");
    });

    it("prefers config over env vars (Property 12)", () => {
      process.env.DINGTALK_APP_KEY = "env-key";
      process.env.DINGTALK_APP_SECRET = "env-secret";
      
      const cfg = {
        channels: {
          dingtalk: {
            appKey: "config-key",
            appSecret: "config-secret",
          },
        },
      } as OpenClawConfig;
      
      const result = resolveDingtalkAccount(cfg);
      expect(result.appKey).toBe("config-key");
      expect(result.appKeySource).toBe("config");
    });

    it("falls back to env vars when config missing", () => {
      process.env.DINGTALK_APP_KEY = "env-key";
      process.env.DINGTALK_APP_SECRET = "env-secret";
      
      const cfg = {
        channels: {
          dingtalk: {},
        },
      } as OpenClawConfig;
      
      const result = resolveDingtalkAccount(cfg);
      expect(result.appKey).toBe("env-key");
      expect(result.appSecret).toBe("env-secret");
      expect(result.appKeySource).toBe("env");
    });

    it("resolves named account from accounts object", () => {
      const cfg = {
        channels: {
          dingtalk: {
            accounts: {
              work: {
                enabled: true,
                appKey: "work-key",
                appSecret: "work-secret",
              },
            },
          },
        },
      } as OpenClawConfig;
      
      const result = resolveDingtalkAccount(cfg, "work");
      expect(result.accountId).toBe("work");
      expect(result.appKey).toBe("work-key");
      expect(result.appKeySource).toBe("config");
    });

    it("returns none source when no credentials", () => {
      const cfg = {
        channels: {
          dingtalk: {},
        },
      } as OpenClawConfig;
      
      const result = resolveDingtalkAccount(cfg);
      expect(result.appKeySource).toBe("none");
    });
  });
});
