import { Response, NextFunction } from "express";
import { BaseController } from "../utils/BaseController.js";
import { SessionService } from "../services/SessionService.js";
import { AuthRequest } from "../interfaces/AuthRequest.js";

export class SessionController extends BaseController {
  private sessionService: SessionService;

  constructor() {
    super();
    this.sessionService = new SessionService();
  }

  public getStreamToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const token = this.sessionService.getStreamToken(req.user.clerkId);
      this.sendSuccess(res, {
        token,
        userId: req.user.clerkId,
        userName: req.user.name,
        userImage: req.user.profileImage,
      });
    } catch (error) {
      next(error);
    }
  };

  public createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const { problem, difficulty } = req.body;
      const session = await this.sessionService.createSession({
        problem,
        difficulty,
        userId: req.user._id.toString(),
        clerkId: req.user.clerkId,
      });
      this.sendSuccess(res, { session }, 201);
    } catch (error) {
      next(error);
    }
  };

  public getActiveSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await this.sessionService.getActiveSessions();
      this.sendSuccess(res, { sessions });
    } catch (error) {
      next(error);
    }
  };

  public getMyRecentSessions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const sessions = await this.sessionService.getMyRecentSessions(req.user._id.toString());
      this.sendSuccess(res, { sessions });
    } catch (error) {
      next(error);
    }
  };

  public getSessionById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const session = await this.sessionService.getSessionById(id);
      this.sendSuccess(res, { session });
    } catch (error) {
      next(error);
    }
  };

  public joinSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const id = req.params.id as string;
      const session = await this.sessionService.joinSession(id, req.user._id.toString(), req.user.clerkId);
      this.sendSuccess(res, { session });
    } catch (error) {
      next(error);
    }
  };

  public endSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const id = req.params.id as string;
      const session = await this.sessionService.endSession(id, req.user._id.toString());
      this.sendSuccess(res, { session, message: "Session ended successfully" });
    } catch (error) {
      next(error);
    }
  };

  public deleteSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }
      const id = req.params.id as string;
      await this.sessionService.deleteSession(id, req.user._id.toString());
      this.sendSuccess(res, { message: "Session deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
