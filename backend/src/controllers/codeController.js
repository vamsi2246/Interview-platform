const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  java: 62,       // Java (OpenJDK 13.0.1)
  cpp: 54,        // C++ (GCC 9.2.0)
};

export const runCodeController = async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, error: "Language and code are required." });
    }

    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    // Submit code for execution with wait=true to get result immediately
    const response = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: stdin || "",
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `HTTP error! status: ${response.status}`,
      });
    }

    const data = await response.json();

    // Judge0 status id 3 = Accepted (ran successfully)
    const stdout = data.stdout || "";
    const stderr = data.stderr || "";
    const compileOutput = data.compile_output || "";
    const statusId = data.status?.id;

    // Status 6 = Compilation Error
    if (statusId === 6) {
      return res.status(200).json({
        success: false,
        output: "",
        error: compileOutput || "Compilation error",
      });
    }

    // Status 11 = Runtime Error (NZEC), or other error statuses > 3
    if (stderr) {
      return res.status(200).json({
        success: false,
        output: stdout,
        error: stderr,
      });
    }

    // Status 5 = Time Limit Exceeded
    if (statusId === 5) {
      return res.status(200).json({
        success: false,
        error: "Time Limit Exceeded",
      });
    }

    // Status 3 = Accepted
    if (statusId === 3) {
      return res.status(200).json({
        success: true,
        output: stdout || "No output",
      });
    }

    // Any other status
    return res.status(200).json({
      success: false,
      error: data.status?.description || "Unknown error",
      output: stdout,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to execute code on server.",
    });
  }
};
