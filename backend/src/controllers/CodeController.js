import { sendSuccess, sendError } from "../utils/BaseController.js";
import { executeCode } from "../services/CodeService.js";

export const runCode = async (req, res, next) => {
  try {
    const { language, code, stdin } = req.body;
    const result = await executeCode({ language, code, stdin });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
