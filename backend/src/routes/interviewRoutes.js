import { Router } from "express";
import { createInterview, getMyInterviews, getInterviewById, saveAnswer, generateFeedback } from "../controllers/InterviewController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const interviewRouter = Router();

interviewRouter.post("/", protectRoute, createInterview);
interviewRouter.get("/", protectRoute, getMyInterviews);
interviewRouter.get("/:id", protectRoute, getInterviewById);
interviewRouter.post("/:id/answer", protectRoute, saveAnswer);
interviewRouter.post("/:id/feedback", protectRoute, generateFeedback);

export default interviewRouter;
