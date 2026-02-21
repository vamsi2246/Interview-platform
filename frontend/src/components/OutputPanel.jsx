import { KeyboardIcon, TerminalIcon } from "lucide-react";

function OutputPanel({ output, customInput, onCustomInputChange }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Tab headers */}
      <div className="flex bg-base-200 border-b border-base-300">
        <div className="flex-1 flex">
          <div className="px-4 py-2 font-semibold text-sm flex items-center gap-2 border-r border-base-300">
            <KeyboardIcon className="size-3.5 text-primary" />
            Input
          </div>
          <div className="px-4 py-2 font-semibold text-sm flex items-center gap-2">
            <TerminalIcon className="size-3.5 text-success" />
            Output
          </div>
        </div>
      </div>

      {/* Split content: Input (left) | Output (right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Custom Input (left side) */}
        <div className="w-2/5 flex flex-col border-r border-base-300">
          <textarea
            className="flex-1 w-full bg-base-100 text-sm font-mono p-3 resize-none focus:outline-none placeholder:text-base-content/30"
            placeholder={"Enter custom input here...\ne.g.\n5\n1 2 3 4 5"}
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Output (right side) */}
        <div className="w-3/5 overflow-auto p-4">
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
      </div>
    </div>
  );
}
export default OutputPanel;