import { useState } from "react";
import { KeyboardIcon, TerminalIcon } from "lucide-react";

function OutputPanel({ output, customInput, onCustomInputChange }) {
  const [activeTab, setActiveTab] = useState("input");

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Tabs */}
      <div className="flex bg-base-200 border-b border-base-300">
        <button
          className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "input"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/50 hover:text-base-content"
            }`}
          onClick={() => setActiveTab("input")}
        >
          <KeyboardIcon className="size-3.5" />
          Input
        </button>

        <button
          className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "output"
              ? "border-success text-success"
              : "border-transparent text-base-content/50 hover:text-base-content"
            }`}
          onClick={() => setActiveTab("output")}
        >
          <TerminalIcon className="size-3.5" />
          Output
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "input" ? (
          <textarea
            className="w-full h-full bg-base-100 text-sm font-mono p-3 resize-none focus:outline-none placeholder:text-base-content/30"
            placeholder={"Enter custom input here...\ne.g.\n5\n1 2 3 4 5"}
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div className="p-4">
            {output === null ? (
              <p className="text-base-content/50 text-sm">
                Click "Run Code" to see the output here...
              </p>
            ) : output.success ? (
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                {output.output}
              </pre>
            ) : (
              <div>
                {output.output && (
                  <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                    {output.output}
                  </pre>
                )}
                <pre className="text-sm font-mono text-error whitespace-pre-wrap">
                  {output.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;