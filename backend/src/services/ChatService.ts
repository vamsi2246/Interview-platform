import { chatClient } from "../config/stream.js";
import { CustomError } from "../utils/CustomError.js";

export class ChatService {
  public getStreamToken(clerkId: string): string {
    try {
      const token = chatClient.createToken(clerkId);
      return token;
    } catch (error) {
      console.error("Error creating stream token:", error);
      throw new CustomError("Internal server error during token generation", 500);
    }
  }
}
