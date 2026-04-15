import { Router } from "express";
import { ChatController } from "../controllers/ChatController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const chatRouter = Router();
const chatController = new ChatController();

// We need to typecase controllers if their types mismatch due to generic Express handler requirements
// But since they match (Request, Response, NextFunction), they should work smoothly.

chatRouter.get("/token", protectRoute, chatController.getStreamToken);

export default chatRouter;
