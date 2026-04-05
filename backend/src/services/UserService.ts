import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import { upsertStream } from '../config/stream.js';
import { IUser } from '../interfaces/IUser.js';
import { CustomError } from '../utils/CustomError.js';

export class UserService {
  public async getUser(clerkId: string): Promise<IUser> {
    let user = await User.findOne({ clerkId });

    // Sync on the fly for local dev if not found
    if (!user) {
      try {
        console.log(`User ${clerkId} not found in DB. Fetching from Clerk...`);
        const clerkUser = await clerkClient.users.getUser(clerkId);

        if (!clerkUser) {
          throw new CustomError("Clerk user not found", 404);
        }

        user = await User.create({
          clerkId: clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          profileImage: clerkUser.imageUrl
        });

        await upsertStream({
          id: user.clerkId,
          name: user.name,
          image: user.profileImage
        });
        console.log(`Successfully synced user ${clerkId} to DB and Stream.`);
      } catch (error) {
        console.error("Error fetching user from Clerk:", error);
        throw new CustomError("User not found and could not be synced from Clerk", 404);
      }
    }

    return user;
  }
}
