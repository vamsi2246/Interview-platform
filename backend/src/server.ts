import express from "express";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-platform-sud3-git-main-vamsis-projects-362513cb.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/code", codeRoutes);

const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "success from ts api" });
});

app.get("/video", protectRoute, (req, res) => {
  res.status(200).json({ msg: "Video call is On" });
});

// Register Global Error Handler at the very end
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port: ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error in starting the server", error);
  }
};

startServer();
