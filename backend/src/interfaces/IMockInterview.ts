import { Document } from "mongoose";
import { IUser } from "./IUser.js";

export interface IQuestion {
  _id: string;
  text: string;
  order: number;
}

export interface IAnswer {
  questionId: string;
  text: string;
  recordedAt: Date;
}

export interface IFeedback {
  questionId: string;
  correctAnswer: string;
  rating: number; // 1–10
  feedback: string;
}

export type InterviewStatus = "pending" | "in-progress" | "completed";

export interface IMockInterview extends Document {
  userId: string | IUser;
  role: string;
  techStack: string;
  experience: number;
  questions: IQuestion[];
  answers: IAnswer[];
  feedback: IFeedback[];
  overallScore: number;
  status: InterviewStatus;
  createdAt: Date;
  updatedAt: Date;
}
