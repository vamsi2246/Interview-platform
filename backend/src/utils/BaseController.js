export function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json(data);
}

export function sendError(res, message, statusCode = 500) {
  res.status(statusCode).json({ success: false, error: message });
}
