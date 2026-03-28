import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream STREAM_API_KEY OR STREAM_API_SECRET is missing");
}

export const streamClient = new StreamClient(apiKey, apiSecret);
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStream = async (userData: { id: string; name: string; image?: string }) => {
  try {
    await chatClient.upsertUser(userData);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream User: ", error);
  }
};

export const deleteStream = async (userId: string) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user successfully deleted:", userId);
  } catch (error) {
    console.error("Error deleting the Stream User: ", error);
  }
};
