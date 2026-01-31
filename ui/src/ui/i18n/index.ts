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
  enable: string;
  disable: string;
  enabled: string;
  disabled: string;
  run: string;
  apply: string;
  applying: string;
  update: string;
  updating: string;
  noData: string;
  
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
    queue: string;
    stop: string;
    newSession: string;
    disconnected: string;
    connecting: string;
    connected: string;
    loadingChat: string;
    compacting: string;
    compacted: string;
    queued: string;
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
    noSnapshot: string;
    active: string;
  };
  
  // Config 页面
  config: {
    title: string;
    subtitle: string;
    formMode: string;
    rawMode: string;
    settings: string;
    valid: string;
    invalid: string;
    unknown: string;
    searchSettings: string;
    allSettings: string;
    noChanges: string;
    unsavedChanges: string;
    viewChanges: string;
    rawJson: string;
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
  
  // Instances 页面
  instances: {
    title: string;
    subtitle: string;
    noInstances: string;
    lastInput: string;
    reason: string;
  };
  
  // Sessions 页面
  sessions: {
    title: string;
    subtitle: string;
    activeWithin: string;
    limit: string;
    includeGlobal: string;
    includeUnknown: string;
    store: string;
    key: string;
    label: string;
    kind: string;
    updated: string;
    tokens: string;
    thinking: string;
    verbose: string;
    reasoning: string;
    actions: string;
    noSessions: string;
    inherit: string;
  };
  
  // Cron 页面
  cron: {
    title: string;
    subtitle: string;
    scheduler: string;
    schedulerSub: string;
    jobs: string;
    jobsSub: string;
    newJob: string;
    newJobSub: string;
    name: string;
    description: string;
    agentId: string;
    schedule: string;
    every: string;
    at: string;
    cronExpr: string;
    session: string;
    wakeMode: string;
    payload: string;
    systemEvent: string;
    agentTurn: string;
    systemText: string;
    agentMessage: string;
    deliver: string;
    channel: string;
    to: string;
    timeout: string;
    postToMainPrefix: string;
    addJob: string;
    noJobs: string;
    runHistory: string;
    runHistorySub: string;
    selectJob: string;
    noRuns: string;
    unit: string;
    expression: string;
    timezone: string;
    runAt: string;
    minutes: string;
    hours: string;
    days: string;
    main: string;
    isolated: string;
    nextHeartbeat: string;
    now: string;
  };
  
  // Skills 页面
  skills: {
    title: string;
    subtitle: string;
    searchSkills: string;
    shown: string;
    noSkills: string;
    eligible: string;
    blocked: string;
    missing: string;
    apiKey: string;
    saveKey: string;
  };
  
  // Nodes 页面
  nodes: {
    title: string;
    subtitle: string;
    noNodes: string;
    devices: string;
    devicesSub: string;
    pending: string;
    paired: string;
    noDevices: string;
    approve: string;
    reject: string;
    rotate: string;
    revoke: string;
    execBinding: string;
    execBindingSub: string;
    defaultBinding: string;
    defaultBindingSub: string;
    anyNode: string;
    loadConfig: string;
    noNodesAvailable: string;
    execApprovals: string;
    execApprovalsSub: string;
    loadApprovals: string;
    target: string;
    targetSub: string;
    host: string;
    gateway: string;
    node: string;
    selectNode: string;
    scope: string;
    defaults: string;
    security: string;
    securitySub: string;
    mode: string;
    deny: string;
    allowlist: string;
    full: string;
    ask: string;
    askSub: string;
    off: string;
    onMiss: string;
    always: string;
    askFallback: string;
    askFallbackSub: string;
    autoAllowSkills: string;
    autoAllowSkillsSub: string;
    useDefault: string;
    allowlistTitle: string;
    allowlistSub: string;
    addEntry: string;
    noEntries: string;
  };
  
  // Debug 页面
  debug: {
    title: string;
    subtitle: string;
    snapshots: string;
    snapshotsSub: string;
    statusLabel: string;
    health: string;
    lastHeartbeat: string;
    manualRpc: string;
    manualRpcSub: string;
    method: string;
    params: string;
    call: string;
    models: string;
    modelsSub: string;
    eventLog: string;
    eventLogSub: string;
    noEvents: string;
    securityAudit: string;
  };
  
  // Logs 页面
  logs: {
    title: string;
    subtitle: string;
    searchLogs: string;
    autoFollow: string;
    file: string;
    truncated: string;
    noLogs: string;
    export: string;
    filtered: string;
    visible: string;
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
  enable: "Enable",
  disable: "Disable",
  enabled: "Enabled",
  disabled: "Disabled",
  run: "Run",
  apply: "Apply",
  applying: "Applying…",
  update: "Update",
  updating: "Updating…",
  noData: "n/a",
  
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
    sources: "Resources",
  },
  
  chat: {
    title: "Chat",
    subtitle: "Direct gateway chat session for quick interventions.",
    placeholder: "Connect to the gateway to start chatting...",
    send: "Send",
    queue: "Queue",
    stop: "Stop",
    newSession: "New session",
    disconnected: "Disconnected from gateway.",
    connecting: "Connecting...",
    connected: "Connected",
    loadingChat: "Loading chat…",
    compacting: "Compacting context...",
    compacted: "Context compacted",
    queued: "Queued",
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
    noSnapshot: "No snapshot yet.",
    active: "Active",
  },
  
  config: {
    title: "Configuration",
    subtitle: "Edit OpenClaw configuration.",
    formMode: "Form",
    rawMode: "Raw",
    settings: "Settings",
    valid: "valid",
    invalid: "invalid",
    unknown: "unknown",
    searchSettings: "Search settings...",
    allSettings: "All Settings",
    noChanges: "No changes",
    unsavedChanges: "unsaved changes",
    viewChanges: "View pending changes",
    rawJson: "Raw JSON5",
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
  
  instances: {
    title: "Connected Instances",
    subtitle: "Presence beacons from the gateway and clients.",
    noInstances: "No instances reported yet.",
    lastInput: "Last input",
    reason: "Reason",
  },
  
  sessions: {
    title: "Sessions",
    subtitle: "Active session keys and per-session overrides.",
    activeWithin: "Active within (minutes)",
    limit: "Limit",
    includeGlobal: "Include global",
    includeUnknown: "Include unknown",
    store: "Store",
    key: "Key",
    label: "Label",
    kind: "Kind",
    updated: "Updated",
    tokens: "Tokens",
    thinking: "Thinking",
    verbose: "Verbose",
    reasoning: "Reasoning",
    actions: "Actions",
    noSessions: "No sessions found.",
    inherit: "inherit",
  },
  
  cron: {
    title: "Cron Jobs",
    subtitle: "Schedule wakeups and recurring agent runs.",
    scheduler: "Scheduler",
    schedulerSub: "Gateway-owned cron scheduler status.",
    jobs: "Jobs",
    jobsSub: "All scheduled jobs stored in the gateway.",
    newJob: "New Job",
    newJobSub: "Create a scheduled wakeup or agent run.",
    name: "Name",
    description: "Description",
    agentId: "Agent ID",
    schedule: "Schedule",
    every: "Every",
    at: "At",
    cronExpr: "Cron",
    session: "Session",
    wakeMode: "Wake mode",
    payload: "Payload",
    systemEvent: "System event",
    agentTurn: "Agent turn",
    systemText: "System text",
    agentMessage: "Agent message",
    deliver: "Deliver",
    channel: "Channel",
    to: "To",
    timeout: "Timeout (seconds)",
    postToMainPrefix: "Post to main prefix",
    addJob: "Add job",
    noJobs: "No jobs yet.",
    runHistory: "Run history",
    runHistorySub: "Latest runs for",
    selectJob: "Select a job to inspect run history.",
    noRuns: "No runs yet.",
    unit: "Unit",
    expression: "Expression",
    timezone: "Timezone (optional)",
    runAt: "Run at",
    minutes: "Minutes",
    hours: "Hours",
    days: "Days",
    main: "Main",
    isolated: "Isolated",
    nextHeartbeat: "Next heartbeat",
    now: "Now",
  },
  
  skills: {
    title: "Skills",
    subtitle: "Bundled, managed, and workspace skills.",
    searchSkills: "Search skills",
    shown: "shown",
    noSkills: "No skills found.",
    eligible: "eligible",
    blocked: "blocked",
    missing: "Missing",
    apiKey: "API key",
    saveKey: "Save key",
  },
  
  nodes: {
    title: "Nodes",
    subtitle: "Paired devices and live links.",
    noNodes: "No nodes found.",
    devices: "Devices",
    devicesSub: "Pairing requests + role tokens.",
    pending: "Pending",
    paired: "Paired",
    noDevices: "No paired devices.",
    approve: "Approve",
    reject: "Reject",
    rotate: "Rotate",
    revoke: "Revoke",
    execBinding: "Exec node binding",
    execBindingSub: "Pin agents to a specific node when using exec host=node.",
    defaultBinding: "Default binding",
    defaultBindingSub: "Used when agents do not override a node binding.",
    anyNode: "Any node",
    loadConfig: "Load config",
    noNodesAvailable: "No nodes with system.run available.",
    execApprovals: "Exec approvals",
    execApprovalsSub: "Allowlist and approval policy for exec host=gateway/node.",
    loadApprovals: "Load approvals",
    target: "Target",
    targetSub: "Gateway edits local approvals; node edits the selected node.",
    host: "Host",
    gateway: "Gateway",
    node: "Node",
    selectNode: "Select node",
    scope: "Scope",
    defaults: "Defaults",
    security: "Security",
    securitySub: "Default security mode.",
    mode: "Mode",
    deny: "Deny",
    allowlist: "Allowlist",
    full: "Full",
    ask: "Ask",
    askSub: "Default prompt policy.",
    off: "Off",
    onMiss: "On miss",
    always: "Always",
    askFallback: "Ask fallback",
    askFallbackSub: "Applied when the UI prompt is unavailable.",
    autoAllowSkills: "Auto-allow skill CLIs",
    autoAllowSkillsSub: "Allow skill executables listed by the Gateway.",
    useDefault: "Use default",
    allowlistTitle: "Allowlist",
    allowlistSub: "Commands allowed for this agent.",
    addEntry: "Add entry",
    noEntries: "No entries yet.",
  },
  
  debug: {
    title: "Debug",
    subtitle: "Gateway snapshots, events, and manual RPC calls.",
    snapshots: "Snapshots",
    snapshotsSub: "Status, health, and heartbeat data.",
    statusLabel: "Status",
    health: "Health",
    lastHeartbeat: "Last heartbeat",
    manualRpc: "Manual RPC",
    manualRpcSub: "Send a raw gateway method with JSON params.",
    method: "Method",
    params: "Params (JSON)",
    call: "Call",
    models: "Models",
    modelsSub: "Catalog from models.list.",
    eventLog: "Event Log",
    eventLogSub: "Latest gateway events.",
    noEvents: "No events yet.",
    securityAudit: "Security audit",
  },
  
  logs: {
    title: "Logs",
    subtitle: "Gateway file logs (JSONL).",
    searchLogs: "Search logs",
    autoFollow: "Auto-follow",
    file: "File",
    truncated: "Log output truncated; showing latest chunk.",
    noLogs: "No log entries.",
    export: "Export",
    filtered: "filtered",
    visible: "visible",
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
  enable: "启用",
  disable: "禁用",
  enabled: "已启用",
  disabled: "已禁用",
  run: "运行",
  apply: "应用",
  applying: "应用中…",
  update: "更新",
  updating: "更新中…",
  noData: "无",
  
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
    queue: "排队",
    stop: "停止",
    newSession: "新会话",
    disconnected: "已断开与网关的连接。",
    connecting: "连接中...",
    connected: "已连接",
    loadingChat: "加载聊天中…",
    compacting: "压缩上下文中...",
    compacted: "上下文已压缩",
    queued: "已排队",
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
    noSnapshot: "暂无快照。",
    active: "活跃",
  },
  
  config: {
    title: "配置",
    subtitle: "编辑 OpenClaw 配置。",
    formMode: "表单",
    rawMode: "原始",
    settings: "设置",
    valid: "有效",
    invalid: "无效",
    unknown: "未知",
    searchSettings: "搜索设置...",
    allSettings: "所有设置",
    noChanges: "无更改",
    unsavedChanges: "未保存的更改",
    viewChanges: "查看待处理的更改",
    rawJson: "原始 JSON5",
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
  
  instances: {
    title: "已连接实例",
    subtitle: "来自网关和客户端的存在信标。",
    noInstances: "暂无实例报告。",
    lastInput: "最后输入",
    reason: "原因",
  },
  
  sessions: {
    title: "会话",
    subtitle: "活动会话密钥和每会话覆盖设置。",
    activeWithin: "活动时间范围（分钟）",
    limit: "限制",
    includeGlobal: "包含全局",
    includeUnknown: "包含未知",
    store: "存储",
    key: "密钥",
    label: "标签",
    kind: "类型",
    updated: "更新时间",
    tokens: "令牌",
    thinking: "思考",
    verbose: "详细",
    reasoning: "推理",
    actions: "操作",
    noSessions: "未找到会话。",
    inherit: "继承",
  },
  
  cron: {
    title: "定时任务",
    subtitle: "安排唤醒和定期代理运行。",
    scheduler: "调度器",
    schedulerSub: "网关拥有的定时调度器状态。",
    jobs: "任务",
    jobsSub: "存储在网关中的所有计划任务。",
    newJob: "新任务",
    newJobSub: "创建计划唤醒或代理运行。",
    name: "名称",
    description: "描述",
    agentId: "代理 ID",
    schedule: "计划",
    every: "每隔",
    at: "在",
    cronExpr: "Cron",
    session: "会话",
    wakeMode: "唤醒模式",
    payload: "负载",
    systemEvent: "系统事件",
    agentTurn: "代理轮次",
    systemText: "系统文本",
    agentMessage: "代理消息",
    deliver: "投递",
    channel: "频道",
    to: "发送至",
    timeout: "超时（秒）",
    postToMainPrefix: "发送到主会话前缀",
    addJob: "添加任务",
    noJobs: "暂无任务。",
    runHistory: "运行历史",
    runHistorySub: "最近运行记录",
    selectJob: "选择一个任务查看运行历史。",
    noRuns: "暂无运行记录。",
    unit: "单位",
    expression: "表达式",
    timezone: "时区（可选）",
    runAt: "运行时间",
    minutes: "分钟",
    hours: "小时",
    days: "天",
    main: "主会话",
    isolated: "隔离会话",
    nextHeartbeat: "下次心跳",
    now: "立即",
  },
  
  skills: {
    title: "技能",
    subtitle: "内置、托管和工作区技能。",
    searchSkills: "搜索技能",
    shown: "显示",
    noSkills: "未找到技能。",
    eligible: "可用",
    blocked: "已阻止",
    missing: "缺失",
    apiKey: "API 密钥",
    saveKey: "保存密钥",
  },
  
  nodes: {
    title: "节点",
    subtitle: "配对设备和实时链接。",
    noNodes: "未找到节点。",
    devices: "设备",
    devicesSub: "配对请求和角色令牌。",
    pending: "待处理",
    paired: "已配对",
    noDevices: "无配对设备。",
    approve: "批准",
    reject: "拒绝",
    rotate: "轮换",
    revoke: "撤销",
    execBinding: "执行节点绑定",
    execBindingSub: "使用 exec host=node 时将代理固定到特定节点。",
    defaultBinding: "默认绑定",
    defaultBindingSub: "当代理未覆盖节点绑定时使用。",
    anyNode: "任意节点",
    loadConfig: "加载配置",
    noNodesAvailable: "没有可用的 system.run 节点。",
    execApprovals: "执行审批",
    execApprovalsSub: "exec host=gateway/node 的允许列表和审批策略。",
    loadApprovals: "加载审批",
    target: "目标",
    targetSub: "网关编辑本地审批；节点编辑所选节点。",
    host: "主机",
    gateway: "网关",
    node: "节点",
    selectNode: "选择节点",
    scope: "范围",
    defaults: "默认值",
    security: "安全",
    securitySub: "默认安全模式。",
    mode: "模式",
    deny: "拒绝",
    allowlist: "允许列表",
    full: "完全",
    ask: "询问",
    askSub: "默认提示策略。",
    off: "关闭",
    onMiss: "未命中时",
    always: "始终",
    askFallback: "询问回退",
    askFallbackSub: "当 UI 提示不可用时应用。",
    autoAllowSkills: "自动允许技能 CLI",
    autoAllowSkillsSub: "允许网关列出的技能可执行文件。",
    useDefault: "使用默认",
    allowlistTitle: "允许列表",
    allowlistSub: "此代理允许的命令。",
    addEntry: "添加条目",
    noEntries: "暂无条目。",
  },
  
  debug: {
    title: "调试",
    subtitle: "网关快照、事件和手动 RPC 调用。",
    snapshots: "快照",
    snapshotsSub: "状态、健康和心跳数据。",
    statusLabel: "状态",
    health: "健康",
    lastHeartbeat: "最后心跳",
    manualRpc: "手动 RPC",
    manualRpcSub: "使用 JSON 参数发送原始网关方法。",
    method: "方法",
    params: "参数 (JSON)",
    call: "调用",
    models: "模型",
    modelsSub: "来自 models.list 的目录。",
    eventLog: "事件日志",
    eventLogSub: "最新网关事件。",
    noEvents: "暂无事件。",
    securityAudit: "安全审计",
  },
  
  logs: {
    title: "日志",
    subtitle: "网关文件日志 (JSONL)。",
    searchLogs: "搜索日志",
    autoFollow: "自动跟随",
    file: "文件",
    truncated: "日志输出已截断；显示最新部分。",
    noLogs: "无日志条目。",
    export: "导出",
    filtered: "已筛选",
    visible: "可见",
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
