import { Router } from "express";
import { runCode } from "../controllers/CodeController.js";

const codeRouter = Router();

codeRouter.post("/run-code", runCode);

export default codeRouter;
