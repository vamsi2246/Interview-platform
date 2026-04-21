import { Router } from "express";
import { InterviewController } from "../controllers/InterviewController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const interviewRouter = Router();
const interviewController = new InterviewController();

interviewRouter.post("/", protectRoute, interviewController.createInterview);
interviewRouter.get("/", protectRoute, interviewController.getMyInterviews);
interviewRouter.get("/:id", protectRoute, interviewController.getInterviewById);
interviewRouter.post("/:id/answer", protectRoute, interviewController.saveAnswer);
interviewRouter.post("/:id/feedback", protectRoute, interviewController.generateFeedback);

export default interviewRouter;
