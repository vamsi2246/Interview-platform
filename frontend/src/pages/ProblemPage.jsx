import { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Derive the problem ID directly from the URL param — no effect needed
  const currentProblemId = id && PROBLEMS[id] ? id : "two-sum";
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId]?.starterCode?.javascript ||
    "// No starter code available for this problem yet."
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // Keep a ref to always have the latest code for handleRunCode
  const codeRef = useRef(code);
  const handleCodeChange = useCallback((newCode) => {
    if (newCode !== undefined) {
      codeRef.current = newCode;
      setCode(newCode);
    }
  }, []);

  const currentProblem = PROBLEMS[currentProblemId];

  // Reset code & output when the problem changes (URL navigation)
  const [prevProblemId, setPrevProblemId] = useState(currentProblemId);
  if (prevProblemId !== currentProblemId) {
    setPrevProblemId(currentProblemId);
    const newCode =
      PROBLEMS[currentProblemId]?.starterCode?.[selectedLanguage] ||
      "// No starter code available for this problem yet.";
    setCode(newCode);
    codeRef.current = newCode;
    setOutput(null);
  }

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const newCode =
      currentProblem?.starterCode?.[newLang] ||
      "// No starter code available for this problem yet.";
    setCode(newCode);
    codeRef.current = newCode;
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) =>
    navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual === normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    // Always read from the ref for latest code
    const result = await executeCode(
      selectedLanguage,
      codeRef.current,
      customInput
    );
    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output
    if (result.success) {
      const expectedOutput =
        currentProblem?.expectedOutput?.[selectedLanguage];
      if (!expectedOutput) {
        toast("No expected output defined for this problem yet.", {
          icon: "ℹ️",
        });
        return;
      }
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={handleCodeChange}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

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