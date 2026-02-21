// Judge0 CE API for code execution
// Replaces the old Piston API which was shut down on Feb 15, 2026

const JUDGE0_API = "https://ce.judge0.com";

// Judge0 language IDs for supported languages
const LANGUAGE_IDS = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  java: 62,       // Java (OpenJDK 13.0.1)
};

export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // Submit code for execution with wait=true to get result immediately
    const response = await fetch(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
        }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    // Judge0 status id 3 = Accepted (ran successfully)
    const stdout = data.stdout || "";
    const stderr = data.stderr || "";
    const compileOutput = data.compile_output || "";
    const statusId = data.status?.id;

    // Status 6 = Compilation Error
    if (statusId === 6) {
      return {
        success: false,
        output: "",
        error: compileOutput || "Compilation error",
      };
    }

    // Status 11 = Runtime Error (NZEC), or other error statuses > 3
    if (stderr) {
      return {
        success: false,
        output: stdout,
        error: stderr,
      };
    }

    // Status 5 = Time Limit Exceeded
    if (statusId === 5) {
      return {
        success: false,
        error: "Time Limit Exceeded",
      };
    }

    // Status 3 = Accepted
    if (statusId === 3) {
      return {
        success: true,
        output: stdout || "No output",
      };
    }

    // Any other status
    return {
      success: false,
      error: data.status?.description || "Unknown error",
      output: stdout,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}