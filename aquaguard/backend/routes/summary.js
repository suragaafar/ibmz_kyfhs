import express from "express";
import { logApiError, validationError } from "../lib/http.js";
import { calculateRisk } from "../lib/riskEngine.js";
import { generateWatsonSummary } from "../lib/watsonx.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const location = String(req.query.location || "").trim();
    if (!location) {
      return validationError(req, res, "location is required", {
        example: "/summary?location=Mumbai, MH",
      });
    }

    if (location.length < 2 || location.length > 120) {
      return validationError(req, res, "location must be between 2 and 120 characters", {
        locationLength: location.length,
      });
    }

    const risk = calculateRisk(location);
    const summary = await generateWatsonSummary({
      location: risk.location,
      risk: risk.risk,
      confidence: risk.confidence,
      factors: risk.factors,
    });

    return res.json({
      location: risk.location,
      risk: risk.risk,
      confidence: risk.confidence,
      summary,
      factors: risk.factors,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logApiError(req, "summary_generation_failed", error);
    const message = String(error?.message || "Unknown error");
    const invalidApiKey = message.includes("BXNIM0415E") || message.includes("Provided API key could not be found");
    const invalidProjectId = message.includes("project_id should be a version 4 uuid");

    return res.status(500).json({
      error: "Failed to generate summary",
      message,
      hint: invalidApiKey
        ? "Invalid IBM IAM API key. Update WATSONX_API_KEY in backend .env and restart backend."
        : invalidProjectId
        ? "WATSONX_PROJECT_ID must be a UUID v4 from your watsonx project settings."
        : "Check WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_BASE_URL in backend .env",
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
