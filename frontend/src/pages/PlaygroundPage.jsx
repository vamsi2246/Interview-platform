import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, SaveIcon, Loader2Icon, PlayIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import toast from "react-hot-toast";

import { LANGUAGE_CONFIG } from "../data/problems";
import { codeApi } from "../api/code";
import OutputPanel from "../components/OutputPanel";

const PLAYGROUND_STORAGE_KEY = "playground_code_state";

export default function PlaygroundPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(() => {
    return LANGUAGE_CONFIG.javascript.monacoLang === "javascript"
      ? 'console.log("Hello Playground!");'
      : "";
  });
  const [fileName, setFileName] = useState("Untitled.js");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PLAYGROUND_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.language) setSelectedLanguage(parsed.language);
        if (parsed.code) setCode(parsed.code);
        if (parsed.fileName) setFileName(parsed.fileName);
        if (parsed.customInput) setCustomInput(parsed.customInput);
      } catch (error) {
        console.error("Failed to parse saved playground state", error);
      }
    }
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    
    // Auto-update file extension if the name is default or matches old extension
    const extensionMap = {
      javascript: ".js",
      python: ".py",
      java: ".java",
      cpp: ".cpp"
    };
    const newExt = extensionMap[newLang] || ".txt";
    
    setFileName((prev) => {
      const parts = prev.split(".");
      if (parts.length > 1) {
        parts.pop();
        return `${parts.join(".")}${newExt}`;
      }
      return `${prev}${newExt}`;
    });
  };

  const handleSave = () => {
    const stateToSave = {
      language: selectedLanguage,
      code,
      fileName,
      customInput,
    };
    localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(stateToSave));
    toast.success("Saved to local storage!");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await codeApi.runCode(selectedLanguage, code, customInput);
    setOutput(result);
    setIsRunning(false);
  };

  return (
    <div className="h-screen flex flex-col bg-base-100 overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between px-4 py-3 bg-base-200 border-b border-base-300">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn btn-ghost btn-circle btn-sm">
            <ArrowLeftIcon className="size-5" />
          </Link>
          <input
            type="text"
            className="input input-sm input-ghost text-lg font-bold w-48 focus:bg-base-100"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Filename"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-base-100 rounded-lg p-1 border border-base-300">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
              alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
              className="size-5 rounded ml-1"
            />
            <select
              className="select select-sm select-ghost w-32 outline-none focus:outline-none"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSave} className="btn btn-ghost btn-sm gap-2">
            <SaveIcon className="size-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="flex items-center gap-2 ml-2">
             <span className="text-xs text-base-content/40 hidden md:inline mr-1">
              Ctrl+Enter
            </span>
            <button
              className="btn btn-primary btn-sm gap-2"
              disabled={isRunning}
              onClick={handleRunCode}
            >
              {isRunning ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="size-4" />
                  Run
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN PLAYGROUND AREA */}
      <div className="flex-1">
        <PanelGroup direction="vertical">
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full bg-base-300 relative pt-2">
              <Editor
                height="100%"
                language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  fontSize: 16,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  minimap: { enabled: false },
                  padding: { top: 12 },
                  renderLineHighlight: "gutter",
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                }}
                onMount={(editor) => {
                  editor.addAction({
                    id: "run-code-playground",
                    label: "Run Code",
                    keybindings: [2048 | 3], // CtrlCmd + Enter
                    run: () => handleRunCode(),
                  });
                }}
              />
            </div>
          </Panel>

          <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

          <Panel defaultSize={40} minSize={20}>
            <OutputPanel
              output={output}
              customInput={customInput}
              onCustomInputChange={setCustomInput}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
