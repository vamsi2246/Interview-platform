import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
            alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
            className="size-6 rounded"
          />
          <select className="select select-sm select-bordered" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-base-content/40 hidden sm:inline">
            Ctrl+Enter
          </span>
          <button className="btn btn-primary btn-sm gap-2" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang}
          value={code}
          onChange={onCodeChange}
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
            // Ctrl+Enter / Cmd+Enter to run code
            editor.addAction({
              id: "run-code",
              label: "Run Code",
              keybindings: [
                // eslint-disable-next-line no-bitwise
                2048 | 3, // CtrlCmd + Enter
              ],
              run: () => onRunCode(),
            });
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;