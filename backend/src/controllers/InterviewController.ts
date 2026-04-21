import { Response, NextFunction } from "express";
import { BaseController } from "../utils/BaseController.js";
import { InterviewService } from "../services/InterviewService.js";
import { AuthRequest } from "../interfaces/AuthRequest.js";

/**
 * InterviewController maps HTTP requests to InterviewService calls.
 * It only handles request/response translation — zero business logic here.
 */
export class InterviewController extends BaseController {
  private readonly interviewService: InterviewService;

  constructor() {
    super();
    this.interviewService = new InterviewService();
  }

  /** POST /api/mock-interview */
  public createInterview = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const { role, techStack, experience } = req.body;

      const interview = await this.interviewService.createInterview({
        userId: req.user._id.toString(),
        role,
        techStack,
        experience: Number(experience),
      });

      this.sendSuccess(res, { interview }, 201);
    } catch (error) {
      next(error);
    }
  };

  /** GET /api/mock-interview */
  public getMyInterviews = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const interviews = await this.interviewService.getMyInterviews(
        req.user._id.toString()
      );

      this.sendSuccess(res, { interviews });
    } catch (error) {
      next(error);
    }
  };

  /** GET /api/mock-interview/:id */
  public getInterviewById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const interview = await this.interviewService.getInterviewById(
        req.params.id,
        req.user._id.toString()
      );

      this.sendSuccess(res, { interview });
    } catch (error) {
      next(error);
    }
  };

  /** POST /api/mock-interview/:id/answer */
  public saveAnswer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const { questionId, answerText } = req.body;

      const interview = await this.interviewService.saveAnswer(
        req.params.id,
        req.user._id.toString(),
        questionId,
        answerText
      );

      this.sendSuccess(res, { interview });
    } catch (error) {
      next(error);
    }
  };

  /** POST /api/mock-interview/:id/feedback */
  public generateFeedback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        this.sendError(res, "Unauthorized", 401);
        return;
      }

      const interview = await this.interviewService.generateAndSaveFeedback(
        req.params.id,
        req.user._id.toString()
      );

      this.sendSuccess(res, { interview });
    } catch (error) {
      next(error);
    }
  };
}
