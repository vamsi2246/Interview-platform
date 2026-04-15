import { Router } from "express";
import { CodeController } from "../controllers/CodeController.js";

const codeRouter = Router();
const codeController = new CodeController();

codeRouter.post("/run-code", codeController.runCode);

export default codeRouter;
