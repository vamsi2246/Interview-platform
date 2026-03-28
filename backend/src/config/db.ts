import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.DB_URL) throw new Error("DB_URL is missing in environment variables");
    const conn = await mongoose.connect(ENV.DB_URL, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });

    console.log("Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error);
    process.exit(1);
  }
};
