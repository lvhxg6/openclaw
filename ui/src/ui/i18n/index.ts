/**
 * OpenClaw UI 国际化支持
 */

export type Locale = "en" | "zh";

export interface I18nMessages {
  // 通用
  yes: string;
  no: string;
  save: string;
  saving: string;
  cancel: string;
  reload: string;
  loading: string;
  error: string;
  success: string;
  confirm: string;
  delete: string;
  edit: string;
  add: string;
  remove: string;
  close: string;
  open: string;
  copy: string;
  copied: string;
  search: string;
  filter: string;
  clear: string;
  refresh: string;
  probe: string;
  
  // 导航
  nav: {
    chat: string;
    overview: string;
    channels: string;
    instances: string;
    sessions: string;
    cronJobs: string;
    skills: string;
    nodes: string;
    config: string;
    debug: string;
    logs: string;
    docs: string;
  };
  
  // 分组标题
  groups: {
    chat: string;
    control: string;
    agent: string;
    settings: string;
    sources: string;
  };
  
  // Chat 页面
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    newSession: string;
    disconnected: string;
    connecting: string;
    connected: string;
  };
  
  // Channels 页面
  channels: {
    title: string;
    subtitle: string;
    configured: string;
    running: string;
    connected: string;
    lastInbound: string;
    lastOutbound: string;
    lastError: string;
    channelHealth: string;
    channelHealthSub: string;
  };
  
  // Config 页面
  config: {
    title: string;
    subtitle: string;
    formMode: string;
    rawMode: string;
  };
  
  // 状态
  status: {
    online: string;
    offline: string;
    healthOnline: string;
    healthOffline: string;
  };
  
  // 语言
  language: {
    label: string;
    en: string;
    zh: string;
  };
  
  // Overview 页面
  overview: {
    gatewayAccess: string;
    gatewayAccessSub: string;
    websocketUrl: string;
    gatewayToken: string;
    password: string;
    passwordPlaceholder: string;
    defaultSessionKey: string;
    connect: string;
    connectHint: string;
    snapshot: string;
    snapshotSub: string;
    statusLabel: string;
    connected: string;
    disconnected: string;
    uptime: string;
    tickInterval: string;
    lastChannelsRefresh: string;
    channelsHint: string;
    instances: string;
    instancesSub: string;
    sessions: string;
    sessionsSub: string;
    cron: string;
    cronEnabled: string;
    cronDisabled: string;
    nextWake: string;
    notes: string;
    notesSub: string;
    tailscaleServe: string;
    tailscaleServeSub: string;
    sessionHygiene: string;
    sessionHygieneSub: string;
    cronReminders: string;
    cronRemindersSub: string;
  };
}

const en: I18nMessages = {
  yes: "Yes",
  no: "No",
  save: "Save",
  saving: "Saving…",
  cancel: "Cancel",
  reload: "Reload",
  loading: "Loading…",
  error: "Error",
  success: "Success",
  confirm: "Confirm",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  remove: "Remove",
  close: "Close",
  open: "Open",
  copy: "Copy",
  copied: "Copied",
  search: "Search",
  filter: "Filter",
  clear: "Clear",
  refresh: "Refresh",
  probe: "Probe",
  
  nav: {
    chat: "Chat",
    overview: "Overview",
    channels: "Channels",
    instances: "Instances",
    sessions: "Sessions",
    cronJobs: "Cron Jobs",
    skills: "Skills",
    nodes: "Nodes",
    config: "Config",
    debug: "Debug",
    logs: "Logs",
    docs: "Docs",
  },
  
  groups: {
    chat: "Chat",
    control: "Control",
    agent: "Agent",
    settings: "Settings",
    sources: "Sources",
  },
  
  chat: {
    title: "Chat",
    subtitle: "Direct gateway chat session for quick interventions.",
    placeholder: "Connect to the gateway to start chatting...",
    send: "Send",
    newSession: "New session",
    disconnected: "Disconnected from gateway.",
    connecting: "Connecting...",
    connected: "Connected",
  },
  
  channels: {
    title: "Channels",
    subtitle: "Channel status and configuration.",
    configured: "Configured",
    running: "Running",
    connected: "Connected",
    lastInbound: "Last inbound",
    lastOutbound: "Last outbound",
    lastError: "Last error",
    channelHealth: "Channel health",
    channelHealthSub: "Channel status snapshots from the gateway.",
  },
  
  config: {
    title: "Configuration",
    subtitle: "Edit OpenClaw configuration.",
    formMode: "Form",
    rawMode: "Raw",
  },
  
  status: {
    online: "Online",
    offline: "Offline",
    healthOnline: "Health Online",
    healthOffline: "Health Offline",
  },
  
  language: {
    label: "Language",
    en: "English",
    zh: "中文",
  },
  
  overview: {
    gatewayAccess: "Gateway Access",
    gatewayAccessSub: "Where the dashboard connects and how it authenticates.",
    websocketUrl: "WebSocket URL",
    gatewayToken: "Gateway Token",
    password: "Password (not stored)",
    passwordPlaceholder: "system or shared password",
    defaultSessionKey: "Default Session Key",
    connect: "Connect",
    connectHint: "Click Connect to apply connection changes.",
    snapshot: "Snapshot",
    snapshotSub: "Latest gateway handshake information.",
    statusLabel: "Status",
    connected: "Connected",
    disconnected: "Disconnected",
    uptime: "Uptime",
    tickInterval: "Tick Interval",
    lastChannelsRefresh: "Last Channels Refresh",
    channelsHint: "Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.",
    instances: "Instances",
    instancesSub: "Presence beacons in the last 5 minutes.",
    sessions: "Sessions",
    sessionsSub: "Recent session keys tracked by the gateway.",
    cron: "Cron",
    cronEnabled: "Enabled",
    cronDisabled: "Disabled",
    nextWake: "Next wake",
    notes: "Notes",
    notesSub: "Quick reminders for remote control setups.",
    tailscaleServe: "Tailscale serve",
    tailscaleServeSub: "Prefer serve mode to keep the gateway on loopback with tailnet auth.",
    sessionHygiene: "Session hygiene",
    sessionHygieneSub: "Use /new or sessions.patch to reset context.",
    cronReminders: "Cron reminders",
    cronRemindersSub: "Use isolated sessions for recurring runs.",
  },
};

const zh: I18nMessages = {
  yes: "是",
  no: "否",
  save: "保存",
  saving: "保存中…",
  cancel: "取消",
  reload: "重新加载",
  loading: "加载中…",
  error: "错误",
  success: "成功",
  confirm: "确认",
  delete: "删除",
  edit: "编辑",
  add: "添加",
  remove: "移除",
  close: "关闭",
  open: "打开",
  copy: "复制",
  copied: "已复制",
  search: "搜索",
  filter: "筛选",
  clear: "清除",
  refresh: "刷新",
  probe: "探测",
  
  nav: {
    chat: "聊天",
    overview: "概览",
    channels: "频道",
    instances: "实例",
    sessions: "会话",
    cronJobs: "定时任务",
    skills: "技能",
    nodes: "节点",
    config: "配置",
    debug: "调试",
    logs: "日志",
    docs: "文档",
  },
  
  groups: {
    chat: "聊天",
    control: "控制",
    agent: "代理",
    settings: "设置",
    sources: "资源",
  },
  
  chat: {
    title: "聊天",
    subtitle: "直接与网关聊天，用于快速干预。",
    placeholder: "连接到网关开始聊天...",
    send: "发送",
    newSession: "新会话",
    disconnected: "已断开与网关的连接。",
    connecting: "连接中...",
    connected: "已连接",
  },
  
  channels: {
    title: "频道",
    subtitle: "频道状态和配置。",
    configured: "已配置",
    running: "运行中",
    connected: "已连接",
    lastInbound: "最后收到",
    lastOutbound: "最后发送",
    lastError: "最后错误",
    channelHealth: "频道健康状态",
    channelHealthSub: "来自网关的频道状态快照。",
  },
  
  config: {
    title: "配置",
    subtitle: "编辑 OpenClaw 配置。",
    formMode: "表单",
    rawMode: "原始",
  },
  
  status: {
    online: "在线",
    offline: "离线",
    healthOnline: "健康 在线",
    healthOffline: "健康 离线",
  },
  
  language: {
    label: "语言",
    en: "English",
    zh: "中文",
  },
  
  overview: {
    gatewayAccess: "网关访问",
    gatewayAccessSub: "控制台连接位置和认证方式。",
    websocketUrl: "WebSocket 地址",
    gatewayToken: "网关令牌",
    password: "密码（不存储）",
    passwordPlaceholder: "系统或共享密码",
    defaultSessionKey: "默认会话密钥",
    connect: "连接",
    connectHint: "点击连接以应用连接更改。",
    snapshot: "快照",
    snapshotSub: "最新的网关握手信息。",
    statusLabel: "状态",
    connected: "已连接",
    disconnected: "已断开",
    uptime: "运行时间",
    tickInterval: "心跳间隔",
    lastChannelsRefresh: "上次频道刷新",
    channelsHint: "使用频道连接 WhatsApp、Telegram、Discord、Signal 或 iMessage。",
    instances: "实例",
    instancesSub: "最近 5 分钟内的存在信标。",
    sessions: "会话",
    sessionsSub: "网关跟踪的最近会话密钥。",
    cron: "定时任务",
    cronEnabled: "已启用",
    cronDisabled: "已禁用",
    nextWake: "下次唤醒",
    notes: "备注",
    notesSub: "远程控制设置的快速提醒。",
    tailscaleServe: "Tailscale 服务",
    tailscaleServeSub: "建议使用服务模式，通过 tailnet 认证保持网关在本地回环。",
    sessionHygiene: "会话清理",
    sessionHygieneSub: "使用 /new 或 sessions.patch 重置上下文。",
    cronReminders: "定时任务提醒",
    cronRemindersSub: "为定期运行使用隔离会话。",
  },
};

const messages: Record<Locale, I18nMessages> = { en, zh };

let currentLocale: Locale = "en";
let listeners: Array<() => void> = [];

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (currentLocale === locale) return;
  currentLocale = locale;
  localStorage.setItem("openclaw-locale", locale);
  listeners.forEach((fn) => fn());
}

export function initLocale(): void {
  const saved = localStorage.getItem("openclaw-locale") as Locale | null;
  if (saved && (saved === "en" || saved === "zh")) {
    currentLocale = saved;
  } else {
    // 检测浏览器语言
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) {
      currentLocale = "zh";
    }
  }
}

export function t(): I18nMessages {
  return messages[currentLocale];
}

export function onLocaleChange(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
