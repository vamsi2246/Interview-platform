import MockInterview from "../models/MockInterview.js";
import { generateQuestions, generateFeedback } from "./AIService.js";
import { CustomError } from "../utils/CustomError.js";

export async function createInterview({ userId, role, techStack, experience }) {

    if (!role || !techStack || experience === undefined) {
      throw new CustomError("role, techStack, and experience are required", 400);
    }

    // Generate questions first — if AI fails, we don't persist anything
    const questions = await generateQuestions(role, techStack, experience);

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

export async function getMyInterviews(userId) {
    return MockInterview.find({ userId })
      .sort({ createdAt: -1 })
      .select("-answers -feedback") // lightweight for dashboard cards
      .limit(20);
  }

export async function getInterviewById(interviewId, userId) {
    const interview = await MockInterview.findById(interviewId);

    if (!interview) {
      throw new CustomError("Interview not found", 404);
    }

    if (interview.userId.toString() !== userId) {
      throw new CustomError("Forbidden", 403);
    }

    return interview;
  }

export async function saveAnswer(interviewId, userId, questionId, answerText) {
    const interview = await getInterviewById(interviewId, userId);

    const existingIdx = interview.answers.findIndex(
      (a) => a.questionId === questionId
    );

    const newAnswer = {
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

export async function generateAndSaveFeedback(interviewId, userId) {
    const interview = await getInterviewById(interviewId, userId);

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
      const result = await generateFeedback(questionText, answer.text);
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
