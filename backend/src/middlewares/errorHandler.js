import { CustomError } from '../utils/CustomError.js';

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
};
