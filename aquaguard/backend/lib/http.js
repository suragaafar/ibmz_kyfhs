import { randomUUID } from "node:crypto";

export function assignRequestId(req, res, next) {
  const incoming = req.headers["x-request-id"];
  const requestId = typeof incoming === "string" && incoming.trim() ? incoming.trim() : randomUUID();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}

export function logRequest(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(
      `[api] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms) requestId=${req.requestId}`
    );
  });

  next();
}

export function validationError(req, res, message, details = {}) {
  return res.status(400).json({
    error: message,
    details,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
}

export function internalError(req, res, message, hint) {
  return res.status(500).json({
    error: message,
    hint,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
}
