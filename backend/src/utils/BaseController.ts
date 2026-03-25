import { Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json(data);
  }

  protected sendError(res: Response, message: string, statusCode: number = 500): void {
    res.status(statusCode).json({ success: false, error: message });
  }
}
