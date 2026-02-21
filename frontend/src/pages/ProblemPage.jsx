import { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";

import Navbar from "../components/Navbar";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentProblemId = id && PROBLEMS[id] ? id : "two-sum";
  const currentProblem = PROBLEMS[currentProblemId];

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    currentProblem?.starterCode?.javascript || "// No starter code available."
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // ref keeps latest code so handleRunCode never sends stale content
  const codeRef = useRef(code);

  const updateCode = useCallback((val) => {
    if (val === undefined) return;
    codeRef.current = val;
    setCode(val);
  }, []);

  // reset editor when switching problems via dropdown
  const [prevId, setPrevId] = useState(currentProblemId);
  if (prevId !== currentProblemId) {
    setPrevId(currentProblemId);
    const fresh =
      PROBLEMS[currentProblemId]?.starterCode?.[selectedLanguage] ||
      "// No starter code available.";
    setCode(fresh);
    codeRef.current = fresh;
    setOutput(null);
  }

  function handleLanguageChange(e) {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const fresh =
      currentProblem?.starterCode?.[lang] || "// No starter code available.";
    setCode(fresh);
    codeRef.current = fresh;
    setOutput(null);
  }

  function handleProblemChange(newId) {
    navigate(`/problem/${newId}`);
  }

  // ── run & check ──────────────────────────────────

  async function handleRunCode() {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(
      selectedLanguage,
      codeRef.current,
      customInput
    );

    setOutput(result);
    setIsRunning(false);

    if (!result.success) {
      toast.error("Code execution failed!");
      return;
    }

    const expected = currentProblem?.expectedOutput?.[selectedLanguage];
    if (!expected) {
      toast("No expected output for this problem yet.", { icon: "ℹ️" });
      return;
    }

    if (matchesExpected(result.output, expected)) {
      fireConfetti();
      toast.success("All tests passed! Great job!");
    } else {
      toast.error("Tests failed. Check your output!");
    }
  }

  // ── helpers ──────────────────────────────────────

  function normalize(text) {
    return text
      .trim()
      .split("\n")
      .map((ln) =>
        ln
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter(Boolean)
      .join("\n");
  }

  function matchesExpected(actual, expected) {
    return normalize(actual) === normalize(expected);
  }

  function fireConfetti() {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  }

  // ── render ───────────────────────────────────────

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* problem description */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* code editor + output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={updateCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={30} minSize={20}>
                <OutputPanel
                  output={output}
                  customInput={customInput}
                  onCustomInputChange={setCustomInput}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;