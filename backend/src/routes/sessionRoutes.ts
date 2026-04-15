import { Router } from "express";
import { SessionController } from "../controllers/SessionController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.get("/token", protectRoute, sessionController.getStreamToken);
sessionRouter.post("/create", protectRoute, sessionController.createSession);
sessionRouter.get("/active", protectRoute, sessionController.getActiveSessions);
sessionRouter.get("/my-recent", protectRoute, sessionController.getMyRecentSessions);
sessionRouter.get("/:id", protectRoute, sessionController.getSessionById);
sessionRouter.post("/:id/join", protectRoute, sessionController.joinSession);
sessionRouter.post("/:id/end", protectRoute, sessionController.endSession);
sessionRouter.delete("/:id", protectRoute, sessionController.deleteSession);

export default sessionRouter;
