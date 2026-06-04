import type { Settings } from "../lib/settings";
import { useSettings } from "../lib/useSettings";

type Props = {
  settings: Settings;
  update: <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => void;
};

export default function SettingsPage({ settings, update }: Props) {
  if (!settings) {
    return <div className="settings-title">LOADING SETTINGS...</div>;
  }

  return (
    <div className="settings-panel">
      <div className="search-title">SETTINGS</div>

      <div className="settings-content">
        {/* THEME */}
        <div className="setting-item">
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) =>
              update("theme", e.target.value as Settings["theme"])
            }
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* FONT SIZE */}
        <div className="setting-item">
          <label>Font Size</label>
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => update("fontSize", Number(e.target.value))}
          />
        </div>

        {/* TAB SIZE */}
        <div className="setting-item">
          <label>Tab Size</label>
          <input
            type="number"
            value={settings.tabSize}
            onChange={(e) => update("tabSize", Number(e.target.value))}
          />
        </div>

        {/* WORD WRAP */}
        <div className="setting-item">
          <label>Word Wrap</label>
          <input
            type="checkbox"
            checked={settings.wordWrap}
            onChange={(e) => update("wordWrap", e.target.checked)}
          />
        </div>

        {/* MINIMAP */}
        <div className="setting-item">
          <label>Minimap</label>
          <input
            type="checkbox"
            checked={settings.minimap}
            onChange={(e) => update("minimap", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}
