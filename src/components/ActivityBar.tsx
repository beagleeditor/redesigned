import { Files, Search, GitBranch, Settings } from "lucide-react";

type SidebarView = "files" | "search" | "git" | "settings";

type Props = {
  active: SidebarView;
  onSelect: (view: SidebarView) => void;
};

export default function ActivityBar({ active, onSelect }: Props) {
  return (
    <div className="activity-bar">
      <button
        className={`activity-btn ${active === "files" ? "active" : ""}`}
        onClick={() => onSelect("files")}
      >
        <Files size={18} />
      </button>

      <button
        className={`activity-btn ${active === "search" ? "active" : ""}`}
        onClick={() => onSelect("search")}
      >
        <Search size={18} />
      </button>

      <button
        className={`activity-btn ${active === "git" ? "active" : ""}`}
        onClick={() => onSelect("git")}
      >
        <GitBranch size={18} />
      </button>

      <div className="activity-spacer" />

      <button
        className={`activity-btn ${active === "settings" ? "active" : ""}`}
        onClick={() => onSelect("settings")}
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
