import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { listen } from "@tauri-apps/api/event";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile, readDir } from "@tauri-apps/plugin-fs";
import { homeDir } from "@tauri-apps/api/path";

import ActivityBar from "./components/ActivityBar";
import Explorer from "./components/Explorer";
import EditorTabs from "./components/EditorTabs";
import StatusBar from "./components/StatusBar";
import WelcomeScreen from "./components/WelcomeScreen";

import "./App.css";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

type SidebarView = "files" | "search" | "git" | "settings";
type Theme = "dark" | "light";

type FileNode = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
};

type Tab = {
  id: string;
  path: string | null;
  name: string;
  content: string;
  dirty: boolean;
};

/* -------------------------------------------------------
   APP
------------------------------------------------------- */

export default function App() {
  /* ---------------- UI STATE ---------------- */

  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");

  const [sidebarView, setSidebarView] = useState<SidebarView>("files");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  /* ---------------- FILE SYSTEM ---------------- */

  const [workspaceDir, setWorkspaceDir] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);

  /* ---------------- EDITOR ---------------- */

  const editorRef = useRef<any>(null);

  /* ---------------- TABS ---------------- */

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  /* -------------------------------------------------------
     NEW TAB
  ------------------------------------------------------- */

  const newFile = () => {
    const id = crypto.randomUUID();

    setTabs((prev) => [
      ...prev,
      {
        id,
        path: null,
        name: "Untitled",
        content: "",
        dirty: false,
      },
    ]);

    setActiveTabId(id);
    setShowWelcome(false);
  };

  /* -------------------------------------------------------
     OPEN FILE
  ------------------------------------------------------- */

  const openFile = useCallback(async () => {
    const selected = await open({
      multiple: false,
      directory: false,
    });

    if (!selected || Array.isArray(selected)) return;

    const text = await readTextFile(selected);
    const name = selected.split(/[/\\]/).pop() ?? "file";

    const id = crypto.randomUUID();

    setTabs((prev) => [
      ...prev,
      {
        id,
        path: selected,
        name,
        content: text,
        dirty: false,
      },
    ]);

    setActiveTabId(id);
    setShowWelcome(false);
  }, []);

  /* -------------------------------------------------------
     SAVE FILE
  ------------------------------------------------------- */

  const saveFile = useCallback(async () => {
    if (!activeTab) return;

    let path = activeTab.path;

    if (!path) {
      path = await save({
        title: "Save File",
        defaultPath: await homeDir(),
      });

      if (!path) return;
    }

    await writeTextFile(path, activeTab.content);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTab.id ? { ...t, path, dirty: false } : t,
      ),
    );
  }, [activeTab]);

  /* -------------------------------------------------------
     OPEN FOLDER (FIXED CORE ISSUE)
  ------------------------------------------------------- */

  const openFolder = async () => {
    const dir = await open({
      directory: true,
      multiple: false,
    });

    if (!dir || Array.isArray(dir)) return;

    setWorkspaceDir(dir);
    setShowWelcome(false);

    // 🔥 IMPORTANT: build ROOT node properly
    const entries = await readDir(dir);

    const tree: FileNode = {
      name: dir.split(/[/\\]/).pop() ?? "root",
      path: dir,
      is_dir: true,
      children: entries.map((e: any) => ({
        name: e.name,
        path: `${dir}/${e.name}`,
        is_dir: e.children !== undefined,
        children: e.children,
      })),
    };

    setFileTree(tree);
  };

  /* -------------------------------------------------------
     OPEN FROM EXPLORER
  ------------------------------------------------------- */

  const openFileFromExplorer = async (path: string) => {
    const text = await readTextFile(path);
    const name = path.split(/[/\\]/).pop() ?? "file";

    const id = crypto.randomUUID();

    setTabs((prev) => [
      ...prev,
      { id, path, name, content: text, dirty: false },
    ]);

    setActiveTabId(id);
  };

  /* -------------------------------------------------------
     UPDATE CONTENT
  ------------------------------------------------------- */

  const updateContent = (value?: string) => {
    if (!activeTab) return;

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTab.id ? { ...t, content: value ?? "", dirty: true } : t,
      ),
    );
  };

  /* -------------------------------------------------------
     RENDER
------------------------------------------------------- */

  return (
    <div className={`app theme-${theme}`}>
      <div className="workspace">
        <ActivityBar active={sidebarView} onSelect={setSidebarView} />

        {sidebarVisible && sidebarView === "files" && (
          <Explorer tree={fileTree} onOpenFile={openFileFromExplorer} />
        )}

        <main className="main">
          <EditorTabs
            tabs={tabs}
            activeTabId={activeTabId}
            onSelect={setActiveTabId}
            onNewTab={newFile}
            onClose={(id) => setTabs((prev) => prev.filter((t) => t.id !== id))}
          />

          {showWelcome ? (
            <WelcomeScreen
              onOpen={openFile}
              onNewFile={newFile}
              onOpenFolder={openFolder}
            />
          ) : (
            <Editor
              language="plaintext"
              value={activeTab?.content ?? ""}
              onChange={updateContent}
              theme={theme === "dark" ? "vs-dark" : "vs"}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          )}
        </main>
      </div>

      <StatusBar language="Plain Text" />
    </div>
  );
}
