import { Request, Response, NextFunction } from "express";
import { BaseController } from "../utils/BaseController.js";
import { CodeService } from "../services/CodeService.js";

export class CodeController extends BaseController {
  private codeService: CodeService;

  constructor() {
    super();
    this.codeService = new CodeService();
  }

  public runCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { language, code, stdin } = req.body;
      const result = await this.codeService.executeCode({ language, code, stdin });
      this.sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
