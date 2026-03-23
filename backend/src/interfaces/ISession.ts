import { Document } from 'mongoose';
import { IUser } from './IUser.js';

export type SessionStatus = "active" | "completed";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface ISession extends Document {
  problem: string;
  difficulty: DifficultyLevel;
  host: string | IUser; 
  participant?: string | IUser | null;
  status: SessionStatus;
  callId: string;
  createdAt: Date;
  updatedAt: Date;
}
