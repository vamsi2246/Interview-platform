import { useState } from "react";
import {
  KeyboardIcon,
  TerminalIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

function OutputPanel({ output, customInput, onCustomInputChange }) {
  const [activeTab, setActiveTab] = useState("input");

  const hasOutput = output !== null && (output.output || output.success);
  const hasError = output !== null && !output.success && output.error;

  // Auto-switch to output/error tab when results come in
  const effectiveTab =
    activeTab === "input" && output !== null
      ? hasError && !hasOutput
        ? "error"
        : "output"
      : activeTab;

  const tabs = [
    {
      id: "input",
      label: "Input",
      icon: KeyboardIcon,
      color: "text-primary",
      bgActive: "bg-primary/10 border-primary",
    },
    {
      id: "output",
      label: "Output",
      icon: TerminalIcon,
      color: "text-success",
      bgActive: "bg-success/10 border-success",
      badge: hasOutput ? (
        <CheckCircle2Icon className="size-3 text-success" />
      ) : null,
    },
    {
      id: "error",
      label: "Error",
      icon: AlertTriangleIcon,
      color: "text-error",
      bgActive: "bg-error/10 border-error",
      badge: hasError ? (
        <XCircleIcon className="size-3 text-error" />
      ) : null,
    },
  ];

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Tab headers */}
      <div className="flex bg-base-200 border-b border-base-300">
        {tabs.map((tab) => {
          const isActive = effectiveTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? `${tab.bgActive} ${tab.color}`
                    : "border-transparent text-base-content/50 hover:text-base-content/80 hover:bg-base-300/50"
                }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
              {tab.badge && <span className="ml-0.5">{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {/* Input Tab */}
        {effectiveTab === "input" && (
          <textarea
            className="w-full h-full bg-base-100 text-sm font-mono p-4 resize-none focus:outline-none placeholder:text-base-content/30"
            placeholder={`Enter custom input (stdin) here...\ne.g.\n5\n1 2 3 4 5`}
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            spellCheck={false}
          />
        )}

        {/* Output Tab */}
        {effectiveTab === "output" && (
          <div className="p-4">
            {output === null ? (
              <p className="text-base-content/50 text-sm">
                Click &quot;Run Code&quot; to see the output here...
              </p>
            ) : output.success ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2Icon className="size-4 text-success" />
                  <span className="text-sm font-semibold text-success">
                    Execution Successful
                  </span>
                </div>
                <pre className="text-sm font-mono text-success whitespace-pre-wrap bg-success/5 rounded-lg p-3 border border-success/20">
                  {output.output}
                </pre>
              </div>
            ) : (
              <div className="space-y-2">
                {output.output ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <TerminalIcon className="size-4 text-base-content/60" />
                      <span className="text-sm font-semibold text-base-content/60">
                        Partial Output
                      </span>
                    </div>
                    <pre className="text-sm font-mono text-base-content whitespace-pre-wrap bg-base-200 rounded-lg p-3 border border-base-300">
                      {output.output}
                    </pre>
                  </>
                ) : (
                  <p className="text-base-content/50 text-sm">
                    No output produced. Check the Error tab for details.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Tab */}
        {effectiveTab === "error" && (
          <div className="p-4">
            {!hasError ? (
              <div className="flex flex-col items-center justify-center py-8 text-base-content/40">
                <CheckCircle2Icon className="size-8 mb-2" />
                <p className="text-sm">No errors</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <XCircleIcon className="size-4 text-error" />
                  <span className="text-sm font-semibold text-error">
                    Execution Error
                  </span>
                </div>
                <pre className="text-sm font-mono text-error whitespace-pre-wrap bg-error/5 rounded-lg p-3 border border-error/20">
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