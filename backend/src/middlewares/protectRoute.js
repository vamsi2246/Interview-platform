import { getUser } from '../services/UserService.js';
import { CustomError } from '../utils/CustomError.js';

export const protectRoute = async (req, res, next) => {
  try {
    const auth = req.auth ? req.auth() : null;
    const clerkId = auth?.userId;
    
    if (!clerkId) {
      res.status(401).json({ success: false, error: "Unauthorized - invalid token" });
      return;
    }

    const user = await userService.getUser(clerkId);
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
      return;
    }
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
};
