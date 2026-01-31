/**
 * 语言切换组件
 */

import { html } from "lit";
import { getLocale, setLocale, type Locale } from "../i18n/index.js";

export function renderLanguageSwitcher() {
  const currentLocale = getLocale();
  
  const handleChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setLocale(select.value as Locale);
    // 刷新页面以应用新语言
    window.location.reload();
  };
  
  return html`
    <div class="language-switcher" style="display: flex; align-items: center; gap: 4px;">
      <select 
        class="language-select"
        style="
          background: var(--bg-secondary, #1a1a1a);
          color: var(--text-primary, #fff);
          border: 1px solid var(--border-color, #333);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
        "
        @change=${handleChange}
      >
        <option value="en" ?selected=${currentLocale === "en"}>English</option>
        <option value="zh" ?selected=${currentLocale === "zh"}>中文</option>
      </select>
    </div>
  `;
}
