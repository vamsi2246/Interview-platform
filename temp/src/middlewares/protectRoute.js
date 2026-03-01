import { clerkClient } from '@clerk/express';
import User from '../models/User.js';
import { upsertStream } from '../lib/stream.js';

export const protectRoute = [
    async (req, res, next) => {
        try {
            const auth = req.auth();
            const clerkId = auth?.userId;
            if (!clerkId) return res.status(401).json({ msg: "Unauthorized - invalid token" })

            // find user in db by clerkId
            let user = await User.findOne({ clerkId })

            // IF RUNNING LOCALLY, INNGEST WEBHOOKS MAY NOT TRIGGER, SO WE SYNC THE USER ON-THE-FLY
            if (!user) {
                try {
                    console.log(`User ${clerkId} not found in DB. Fetching from Clerk...`);
                    const clerkUser = await clerkClient.users.getUser(clerkId);

                    const newUser = {
                        clerkId: clerkId,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                        profileImage: clerkUser.imageUrl
                    };

                    user = await User.create(newUser);

                    // Sync the new user to Stream Video & Chat
                    await upsertStream({
                        id: user.clerkId.toString(),
                        name: user.name,
                        image: user.profileImage
                    });
                    console.log(`Successfully synced user ${clerkId} to DB and Stream.`);
                } catch (clerkError) {
                    console.error("Error fetching user from Clerk:", clerkError);
                    return res.status(404).json({ msg: "User not found and could not be synced from Clerk" });
                }
            }

            // attach user to req
            req.user = user
            next()
        } catch (error) {
            console.error("Error in protectRoute middleware", error)
            res.status(401).json({ msg: "Unauthorized" })
        }
    }
]