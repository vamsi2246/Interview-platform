import { chatClient, streamClient } from "../config/stream.js";
import Session from "../models/Session.js";
import { CustomError } from "../utils/CustomError.js";
import { ISession, DifficultyLevel } from "../interfaces/ISession.js";

export interface CreateSessionDTO {
  problem: string;
  difficulty: string;
  userId: string; // the database _id
  clerkId: string;
}

export class SessionService {
  /**
   * Generates a stream user token for the given clerk ID
   */
  public getStreamToken(userId: string): string {
    return streamClient.generateUserToken({ user_id: userId });
  }

  /**
   * Creates a new session in DB, Stream Video, and Stream Chat channels
   */
  public async createSession(dto: CreateSessionDTO): Promise<ISession> {
    const { problem, difficulty, userId, clerkId } = dto;

    if (!problem || !difficulty) {
      throw new CustomError("Problem and difficulty are required", 400);
    }

    const normalizedDifficulty = difficulty.toLowerCase() as DifficultyLevel;

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
      } as any);

      await channel.create();
    } catch (streamError) {
      // rollback db if stream fails
      await Session.findByIdAndDelete(session._id);
      console.error("Stream creation error:", streamError);
      throw new CustomError("Failed to initialize Stream resources for the session", 500);
    }

    return session;
  }

  /**
   * Get active sessions
   */
  public async getActiveSessions(): Promise<ISession[]> {
    return Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
  }

  /**
   * Get my completed recent sessions
   */
  public async getMyRecentSessions(userId: string): Promise<ISession[]> {
    return Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .populate("host", "name clerkId")
      .populate("participant", "name clerkId")
      .sort({ createdAt: -1 })
      .limit(20);
  }

  /**
   * Get a session by its DB ID
   */
  public async getSessionById(sessionId: string): Promise<ISession> {
    const session = await Session.findById(sessionId)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      throw new CustomError("Session not found", 404);
    }

    return session;
  }

  /**
   * Join an active session
   */
  public async joinSession(sessionId: string, userId: string, clerkId: string): Promise<ISession> {
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

  /**
   * Ends a session and cleans up stream calls/channels
   */
  public async endSession(sessionId: string, userId: string): Promise<ISession> {
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

  /**
   * Deletes a session entirely
   */
  public async deleteSession(sessionId: string, userId: string): Promise<void> {
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
}
