import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStream, upsertStream } from "./stream.js";

export const inngest = new Inngest({ id: "IPproject" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    const newUser = {
      clerkId: id,
      email: email,
      name: name,
      profileImage: image_url
    };

    await User.create(newUser);

    await upsertStream({
      id: id.toString(),
      name: name,
      image: image_url,
    });
  }
);

const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
    await deleteStream(id.toString());
  }
);

export const functions = [syncUser, deleteUserFromDb];
