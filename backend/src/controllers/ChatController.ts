import { Response, NextFunction } from "express";
import { BaseController } from "../utils/BaseController.js";
import { ChatService } from "../services/ChatService.js";
import { AuthRequest } from "../interfaces/AuthRequest.js";

export class ChatController extends BaseController {
  private chatService: ChatService;

  constructor() {
    super();
    this.chatService = new ChatService();
  }

  public getStreamToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const token = this.chatService.getStreamToken(req.user.clerkId);
      
      this.sendSuccess(res, [{
        token,
        userId: req.user.clerkId,
        userName: req.user.name,
        userImage: req.user.profileImage
      }]);
    } catch (error) {
      next(error);
    }
  };
}
