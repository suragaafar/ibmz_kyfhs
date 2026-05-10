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

export function logApiError(req, errorType, error) {
  const message = String(error?.message || error || "Unknown error");
  console.error(
    `[api-error] type=${errorType} method=${req.method} path=${req.originalUrl} requestId=${req.requestId} message=${message}`
  );
}

export function requireApiTokenIfConfigured(req, res, next) {
  const configuredToken = String(process.env.API_SHARED_TOKEN || "").trim();
  if (!configuredToken) {
    return next();
  }

  const supplied = String(req.headers["x-api-token"] || "").trim();
  if (supplied !== configuredToken) {
    return res.status(401).json({
      error: "Unauthorized",
      details: {
        message: "x-api-token is missing or invalid",
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  return next();
}

export function createRateLimiter({ windowMs, max, keyPrefix = "global" }) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const now = Date.now();
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `${keyPrefix}:${ip}`;

    const current = hits.get(key);
    if (!current || now > current.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        details: {
          max,
          windowMs,
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
      });
    }

    return next();
  };
}
