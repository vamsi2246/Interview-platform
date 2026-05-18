import { Router } from "express";
import { getStreamToken } from "../controllers/ChatController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const chatRouter = Router();

chatRouter.get("/token", protectRoute, getStreamToken);

export default chatRouter;
