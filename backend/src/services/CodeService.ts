import { CustomError } from "../utils/CustomError.js";

const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  java: 62,       // Java (OpenJDK 13.0.1)
  cpp: 54,        // C++ (GCC 9.2.0)
};

export interface RunCodeData {
  language: string;
  code: string;
  stdin?: string;
}

export interface RunCodeResponse {
  success: boolean;
  output?: string;
  error?: string;
}

export class CodeService {
  public async executeCode({ language, code, stdin }: RunCodeData): Promise<RunCodeResponse> {
    if (!language || !code) {
      throw new CustomError("Language and code are required.", 400);
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()];

    if (!languageId) {
      throw new CustomError(`Unsupported language: ${language}`, 400);
    }

    try {
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
        throw new CustomError(`HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();

      const stdout = data.stdout || "";
      const stderr = data.stderr || "";
      const compileOutput = data.compile_output || "";
      const statusId = data.status?.id;

      // Status 6 = Compilation Error
      if (statusId === 6) {
        return { success: false, output: "", error: compileOutput || "Compilation error" };
      }

      // Status 11 = Runtime Error, or other failures > 3
      if (stderr) {
        return { success: false, output: stdout, error: stderr };
      }

      // Status 5 = Time Limit Exceeded
      if (statusId === 5) {
        return { success: false, error: "Time Limit Exceeded" };
      }

      // Status 3 = Accepted
      if (statusId === 3) {
        return { success: true, output: stdout || "No output" };
      }

      // Any other status
      return { success: false, error: data.status?.description || "Unknown error", output: stdout };
    } catch (error) {
      console.error("Code execution error:", error);
      throw new CustomError("Failed to execute code on server.", 500);
    }
  }
}
