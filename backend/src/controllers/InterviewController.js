import { sendSuccess, sendError } from "../utils/BaseController.js";
import { createInterview as createInterviewService, getMyInterviews as getMyInterviewsService, getInterviewById as getInterviewByIdService, saveAnswer as saveAnswerService, generateAndSaveFeedback as generateAndSaveFeedbackService } from "../services/InterviewService.js";

export const createInterview = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const { role, techStack, experience } = req.body;

    const interview = await createInterviewService({
      userId: req.user._id.toString(),
      role,
      techStack,
      experience: Number(experience),
    });

    sendSuccess(res, { interview }, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyInterviews = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const interviews = await getMyInterviewsService(req.user._id.toString());

    sendSuccess(res, { interviews });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const interview = await getInterviewByIdService(
      req.params.id,
      req.user._id.toString()
    );

    sendSuccess(res, { interview });
  } catch (error) {
    next(error);
  }
};

export const saveAnswer = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const { questionId, answerText } = req.body;

    const interview = await saveAnswerService(
      req.params.id,
      req.user._id.toString(),
      questionId,
      answerText
    );

    sendSuccess(res, { interview });
  } catch (error) {
    next(error);
  }
};

export const generateFeedback = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const interview = await generateAndSaveFeedbackService(
      req.params.id,
      req.user._id.toString()
    );

    sendSuccess(res, { interview });
  } catch (error) {
    next(error);
  }
};
