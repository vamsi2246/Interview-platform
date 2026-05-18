import { Router } from "express";
import { getStreamToken, createSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession, endSession, deleteSession } from "../controllers/SessionController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const sessionRouter = Router();

sessionRouter.get("/token", protectRoute, getStreamToken);
sessionRouter.post("/create", protectRoute, createSession);
sessionRouter.get("/active", protectRoute, getActiveSessions);
sessionRouter.get("/my-recent", protectRoute, getMyRecentSessions);
sessionRouter.get("/:id", protectRoute, getSessionById);
sessionRouter.post("/:id/join", protectRoute, joinSession);
sessionRouter.post("/:id/end", protectRoute, endSession);
sessionRouter.delete("/:id", protectRoute, deleteSession);

export default sessionRouter;
