import type { PluginRuntime } from "openclaw/plugin-sdk";

let runtime: PluginRuntime | null = null;

export function setDingtalkRuntime(r: PluginRuntime) {
  runtime = r;
}

export function getDingtalkRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("Dingtalk runtime not initialized");
  }
  return runtime;
}
