import express from "express";
import { runCodeController } from "../controllers/codeController.js";

const router = express.Router();

// Route: /api/code/run-code
router.post("/run-code", runCodeController);

export default router;
