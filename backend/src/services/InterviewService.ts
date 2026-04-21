import MockInterview from "../models/MockInterview.js";
import { IMockInterview, IAnswer } from "../interfaces/IMockInterview.js";
import { AIService } from "./AIService.js";
import { CustomError } from "../utils/CustomError.js";

export interface CreateInterviewDTO {
  userId: string;
  role: string;
  techStack: string;
  experience: number;
}

/**
 * InterviewService handles all business logic for the mock interview flow.
 * It composes AIService for AI operations and speaks to the MockInterview model.
 */
export class InterviewService {
  private readonly aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Creates a new interview record and immediately generates 5 AI questions.
   */
  public async createInterview(dto: CreateInterviewDTO): Promise<IMockInterview> {
    const { userId, role, techStack, experience } = dto;

    if (!role || !techStack || experience === undefined) {
      throw new CustomError("role, techStack, and experience are required", 400);
    }

    // Generate questions first — if AI fails, we don't persist anything
    const questions = await this.aiService.generateQuestions(role, techStack, experience);

    const interview = await MockInterview.create({
      userId,
      role,
      techStack,
      experience,
      questions,
      status: "pending",
    });

    return interview;
  }

  /**
   * Returns all interviews belonging to the authenticated user, newest first.
   */
  public async getMyInterviews(userId: string): Promise<IMockInterview[]> {
    return MockInterview.find({ userId })
      .sort({ createdAt: -1 })
      .select("-answers -feedback") // lightweight for dashboard cards
      .limit(20);
  }

  /**
   * Returns a single interview by ID after verifying ownership.
   */
  public async getInterviewById(interviewId: string, userId: string): Promise<IMockInterview> {
    const interview = await MockInterview.findById(interviewId);

    if (!interview) {
      throw new CustomError("Interview not found", 404);
    }

    if (interview.userId.toString() !== userId) {
      throw new CustomError("Forbidden", 403);
    }

    return interview;
  }

  /**
   * Saves or updates a single answer for a given question.
   * Marks the interview as in-progress on first answer.
   */
  public async saveAnswer(
    interviewId: string,
    userId: string,
    questionId: string,
    answerText: string
  ): Promise<IMockInterview> {
    const interview = await this.getInterviewById(interviewId, userId);

    const existingIdx = interview.answers.findIndex(
      (a) => a.questionId === questionId
    );

    const newAnswer: IAnswer = {
      questionId,
      text: answerText,
      recordedAt: new Date(),
    };

    if (existingIdx >= 0) {
      interview.answers[existingIdx] = newAnswer;
    } else {
      interview.answers.push(newAnswer);
    }

    if (interview.status === "pending") {
      interview.status = "in-progress";
    }

    await interview.save();
    return interview;
  }

  /**
   * Calls AIService to generate feedback for every answered question,
   * computes the overall score, and marks the interview as completed.
   */
  public async generateAndSaveFeedback(
    interviewId: string,
    userId: string
  ): Promise<IMockInterview> {
    const interview = await this.getInterviewById(interviewId, userId);

    if (interview.status === "completed") {
      // Idempotent — return existing result without re-calling OpenAI
      return interview;
    }

    if (!interview.answers.length) {
      throw new CustomError("No answers recorded yet", 400);
    }

    // Build a lookup map: questionId → question text
    const questionMap = new Map(
      interview.questions.map((q) => [q._id.toString(), q.text])
    );

    // Fire feedback requests sequentially to avoid rate-limit bursts
    const feedbackResults = [];
    for (const answer of interview.answers) {
      const questionText = questionMap.get(answer.questionId) || "Unknown question";
      const result = await this.aiService.generateFeedback(questionText, answer.text);
      feedbackResults.push({ questionId: answer.questionId, ...result });
    }

    interview.feedback = feedbackResults;

    // Overall score = average of individual ratings, rounded to 1 decimal
    const totalRating = feedbackResults.reduce((sum, f) => sum + f.rating, 0);
    interview.overallScore = Math.round((totalRating / feedbackResults.length) * 10) / 10;
    interview.status = "completed";

    await interview.save();
    return interview;
  }
}
