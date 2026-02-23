import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getStreamToken, createSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession, endSession, deleteSession } from '../controllers/sessionController.js'

const router = express.Router();


router.get("/stream-token", protectRoute, getStreamToken);
router.post("/", protectRoute, createSession);

router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);
router.get("/:id", protectRoute, getSessionById);

router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);
router.delete("/:id", protectRoute, deleteSession);

export default router;