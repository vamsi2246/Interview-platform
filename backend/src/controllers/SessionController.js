import { sendSuccess, sendError } from "../utils/BaseController.js";
import { getStreamToken as getStreamTokenService, createSession as createSessionService, getActiveSessions as getActiveSessionsService, getMyRecentSessions as getMyRecentSessionsService, getSessionById as getSessionByIdService, joinSession as joinSessionService, endSession as endSessionService, deleteSession as deleteSessionService } from "../services/SessionService.js";

export const getStreamToken = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const token = getStreamTokenService(req.user.clerkId);
    sendSuccess(res, {
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const { problem, difficulty } = req.body;
    const session = await createSessionService({
      problem,
      difficulty,
      userId: req.user._id.toString(),
      clerkId: req.user.clerkId,
    });
    sendSuccess(res, { session }, 201);
  } catch (error) {
    next(error);
  }
};

export const getActiveSessions = async (req, res, next) => {
  try {
    const sessions = await getActiveSessionsService();
    sendSuccess(res, { sessions });
  } catch (error) {
    next(error);
  }
};

export const getMyRecentSessions = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const sessions = await getMyRecentSessionsService(req.user._id.toString());
    sendSuccess(res, { sessions });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await getSessionByIdService(id);
    sendSuccess(res, { session });
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const id = req.params.id;
    const session = await joinSessionService(id, req.user._id.toString(), req.user.clerkId);
    sendSuccess(res, { session });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const id = req.params.id;
    const session = await endSessionService(id, req.user._id.toString());
    sendSuccess(res, { session, message: "Session ended successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }
    const id = req.params.id;
    await deleteSessionService(id, req.user._id.toString());
    sendSuccess(res, { message: "Session deleted successfully" });
  } catch (error) {
    next(error);
  }
};
