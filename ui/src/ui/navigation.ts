import type { IconName } from "./icons.js";
import { t, getLocale } from "./i18n/index.js";

export type TabGroupKey = "chat" | "control" | "agent" | "settings";

export const TAB_GROUP_KEYS: TabGroupKey[] = ["chat", "control", "agent", "settings"];

export const TAB_GROUPS_STATIC = [
  { key: "chat" as const, tabs: ["chat"] },
  {
    key: "control" as const,
    tabs: ["overview", "channels", "instances", "sessions", "cron"],
  },
  { key: "agent" as const, tabs: ["skills", "nodes"] },
  { key: "settings" as const, tabs: ["config", "debug", "logs"] },
] as const;

export function getTabGroups() {
  const labels = t().groups;
  return TAB_GROUPS_STATIC.map((group) => ({
    label: labels[group.key],
    tabs: group.tabs,
  }));
}

// Keep TAB_GROUPS for backward compatibility (static reference)
export const TAB_GROUPS = TAB_GROUPS_STATIC.map((group) => ({
  label: group.key.charAt(0).toUpperCase() + group.key.slice(1),
  tabs: group.tabs,
}));

export type Tab =
  | "overview"
  | "channels"
  | "instances"
  | "sessions"
  | "cron"
  | "skills"
  | "nodes"
  | "chat"
  | "config"
  | "debug"
  | "logs";

const TAB_PATHS: Record<Tab, string> = {
  overview: "/overview",
  channels: "/channels",
  instances: "/instances",
  sessions: "/sessions",
  cron: "/cron",
  skills: "/skills",
  nodes: "/nodes",
  chat: "/chat",
  config: "/config",
  debug: "/debug",
  logs: "/logs",
};

const PATH_TO_TAB = new Map(
  Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab as Tab]),
);

export function normalizeBasePath(basePath: string): string {
  if (!basePath) return "";
  let base = basePath.trim();
  if (!base.startsWith("/")) base = `/${base}`;
  if (base === "/") return "";
  if (base.endsWith("/")) base = base.slice(0, -1);
  return base;
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  let normalized = path.trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function pathForTab(tab: Tab, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  const path = TAB_PATHS[tab];
  return base ? `${base}${path}` : path;
}

export function tabFromPath(pathname: string, basePath = ""): Tab | null {
  const base = normalizeBasePath(basePath);
  let path = pathname || "/";
  if (base) {
    if (path === base) {
      path = "/";
    } else if (path.startsWith(`${base}/`)) {
      path = path.slice(base.length);
    }
  }
  let normalized = normalizePath(path).toLowerCase();
  if (normalized.endsWith("/index.html")) normalized = "/";
  if (normalized === "/") return "chat";
  return PATH_TO_TAB.get(normalized) ?? null;
}

export function inferBasePathFromPathname(pathname: string): string {
  let normalized = normalizePath(pathname);
  if (normalized.endsWith("/index.html")) {
    normalized = normalizePath(normalized.slice(0, -"/index.html".length));
  }
  if (normalized === "/") return "";
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  for (let i = 0; i < segments.length; i++) {
    const candidate = `/${segments.slice(i).join("/")}`.toLowerCase();
    if (PATH_TO_TAB.has(candidate)) {
      const prefix = segments.slice(0, i);
      return prefix.length ? `/${prefix.join("/")}` : "";
    }
  }
  return `/${segments.join("/")}`;
}

export function iconForTab(tab: Tab): IconName {
  switch (tab) {
    case "chat":
      return "messageSquare";
    case "overview":
      return "barChart";
    case "channels":
      return "link";
    case "instances":
      return "radio";
    case "sessions":
      return "fileText";
    case "cron":
      return "loader";
    case "skills":
      return "zap";
    case "nodes":
      return "monitor";
    case "config":
      return "settings";
    case "debug":
      return "bug";
    case "logs":
      return "scrollText";
    default:
      return "folder";
  }
}

export function titleForTab(tab: Tab) {
  const nav = t().nav;
  switch (tab) {
    case "overview":
      return nav.overview;
    case "channels":
      return nav.channels;
    case "instances":
      return nav.instances;
    case "sessions":
      return nav.sessions;
    case "cron":
      return nav.cronJobs;
    case "skills":
      return nav.skills;
    case "nodes":
      return nav.nodes;
    case "chat":
      return nav.chat;
    case "config":
      return nav.config;
    case "debug":
      return nav.debug;
    case "logs":
      return nav.logs;
    default:
      return "Control";
  }
}

// Subtitles - these are more detailed so we keep them in i18n
const subtitles: Record<Tab, { en: string; zh: string }> = {
  overview: {
    en: "Gateway status, entry points, and a fast health read.",
    zh: "网关状态、入口点和快速健康检查。",
  },
  channels: {
    en: "Manage channels and settings.",
    zh: "管理频道和设置。",
  },
  instances: {
    en: "Presence beacons from connected clients and nodes.",
    zh: "来自已连接客户端和节点的存在信标。",
  },
  sessions: {
    en: "Inspect active sessions and adjust per-session defaults.",
    zh: "检查活动会话并调整每个会话的默认值。",
  },
  cron: {
    en: "Schedule wakeups and recurring agent runs.",
    zh: "安排唤醒和定期代理运行。",
  },
  skills: {
    en: "Manage skill availability and API key injection.",
    zh: "管理技能可用性和 API 密钥注入。",
  },
  nodes: {
    en: "Paired devices, capabilities, and command exposure.",
    zh: "配对设备、功能和命令暴露。",
  },
  chat: {
    en: "Direct gateway chat session for quick interventions.",
    zh: "直接与网关聊天，用于快速干预。",
  },
  config: {
    en: "Edit ~/.openclaw/openclaw.json safely.",
    zh: "安全编辑 ~/.openclaw/openclaw.json。",
  },
  debug: {
    en: "Gateway snapshots, events, and manual RPC calls.",
    zh: "网关快照、事件和手动 RPC 调用。",
  },
  logs: {
    en: "Live tail of the gateway file logs.",
    zh: "实时查看网关文件日志。",
  },
};

export function subtitleForTab(tab: Tab) {
  const locale = getLocale();
  const entry = subtitles[tab];
  if (!entry) return "";
  return locale === "zh" ? entry.zh : entry.en;
}
