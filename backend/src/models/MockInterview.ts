import mongoose, { Schema } from "mongoose";
import { IMockInterview } from "../interfaces/IMockInterview.js";

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const answerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    text: { type: String, default: "" },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const feedbackSchema = new Schema(
  {
    questionId: { type: String, required: true },
    correctAnswer: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 10, default: 5 },
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

const mockInterviewSchema = new Schema<IMockInterview>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    techStack: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    questions: { type: [questionSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
    feedback: { type: [feedbackSchema], default: [] },
    overallScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MockInterview = mongoose.model<IMockInterview>(
  "MockInterview",
  mockInterviewSchema
);
export default MockInterview;
