/**
 * 钉钉客户端测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { replyMessage, replyMarkdown } from "./client.js";

describe("client", () => {
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  describe("replyMessage", () => {
    it("sends correct POST format (Property 10)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ errcode: 0 }),
      });

      await replyMessage("https://webhook.example.com", "Hello World");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://webhook.example.com",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msgtype: "text",
            text: { content: "Hello World" },
          }),
        }),
      );
    });

    it("returns ok true on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ errcode: 0 }),
      });

      const result = await replyMessage("https://webhook.example.com", "test");
      expect(result.ok).toBe(true);
    });

    it("returns error on HTTP failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      });

      const result = await replyMessage("https://webhook.example.com", "test");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("HTTP 500");
    });

    it("propagates DingTalk API errors (Property 11)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ errcode: 40001, errmsg: "invalid token" }),
      });

      const result = await replyMessage("https://webhook.example.com", "test");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("40001");
      expect(result.error).toContain("invalid token");
    });

    it("handles fetch exceptions", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await replyMessage("https://webhook.example.com", "test");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Network error");
    });
  });

  describe("replyMarkdown", () => {
    it("sends correct markdown format", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ errcode: 0 }),
      });

      await replyMarkdown("https://webhook.example.com", "Title", "# Content");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://webhook.example.com",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            msgtype: "markdown",
            markdown: { title: "Title", text: "# Content" },
          }),
        }),
      );
    });
  });
});
