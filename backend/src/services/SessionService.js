import { chatClient, streamClient } from "../config/stream.js";
import Session from "../models/Session.js";
import { CustomError } from "../utils/CustomError.js";

export function getStreamToken(userId) {
  return streamClient.generateUserToken({ user_id: userId });
}

export async function createSession({ problem, difficulty, userId, clerkId }) {

    if (!problem || !difficulty) {
      throw new CustomError("Problem and difficulty are required", 400);
    }

    const normalizedDifficulty = difficulty.toLowerCase();

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problem,
      difficulty: normalizedDifficulty,
      host: userId,
      callId,
    });

    try {
      // create stream video call
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty: normalizedDifficulty, sessionId: session._id.toString() },
        },
      });

      // chat messaging
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });

      await channel.create();
    } catch (streamError) {
      // rollback db if stream fails
      await Session.findByIdAndDelete(session._id);
      console.error("Stream creation error:", streamError);
      throw new CustomError("Failed to initialize Stream resources for the session", 500);
    }

    return session;
  }

export async function getActiveSessions() {
    return Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
  }

export async function getMyRecentSessions(userId) {
    return Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name clerkId")
      .populate("participant", "name clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
  }

export async function getSessionById(sessionId) {
    const session = await Session.findById(sessionId)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      throw new CustomError("Session not found", 404);
    }

    return session;
  }

export async function joinSession(sessionId, userId, clerkId) {
    const session = await Session.findById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.status !== "active") {
      throw new CustomError("Cannot join a completed session", 400);
    }

    if (session.host.toString() === userId.toString()) {
      throw new CustomError("Host cannot join their own session as participant", 400);
    }

    if (session.participant) {
      throw new CustomError("Session is full", 409);
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    return session;
  }

export async function endSession(sessionId, userId) {
    const session = await Session.findById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.host.toString() !== userId.toString()) {
      throw new CustomError("Only the host can end the session", 403);
    }

    if (session.status === "completed") {
      throw new CustomError("Session is already completed", 400);
    }

    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });

      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (streamError) {
      console.warn("Could not delete stream resources explicitly", streamError);
    }

    session.status = "completed";
    await session.save();

    return session;
  }

export async function deleteSession(sessionId, userId) {
    const session = await Session.findById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.host.toString() !== userId.toString()) {
      throw new CustomError("Only the host can delete the session", 403);
    }

    if (session.status === "active") {
      try {
        const call = streamClient.video.call("default", session.callId);
        await call.delete({ hard: true });
      } catch {
        // may not exist
      }
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();
      } catch {
        // may not exist
      }
    }

    await Session.findByIdAndDelete(sessionId);
  }
