import { sendSuccess, sendError } from "../utils/BaseController.js";
import { getStreamToken as getStreamTokenService } from "../services/ChatService.js";

export const getStreamToken = (req, res, next) => {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const token = getStreamTokenService(req.user.clerkId);
    
    sendSuccess(res, [{
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.profileImage
    }]);
  } catch (error) {
    next(error);
  }
};
