import axiosInstance from "../lib/axios";

export const codeApi = {
  runCode: async (language, code, stdin = "") => {
    try {
      const res = await axiosInstance.post("/code/run-code", {
        language,
        code,
        stdin,
      });
      return res.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        error: `Failed to execute code: ${error.message}`,
      };
    }
  },
};
