import express from "express";
import { logApiError, validationError } from "../lib/http.js";
import { assessLocationRisk } from "../lib/liveRiskAssessment.js";

const router = express.Router();

router.get("/", async function (req, res) {
	const location = String(req.query.location || "").trim();

	if (!location) {
		return validationError(req, res, "location is required", {
			example: "/risk?location=Delhi, DL",
		});
	}

	if (location.length < 2 || location.length > 120) {
		return validationError(req, res, "location must be between 2 and 120 characters", {
			locationLength: location.length,
		});
	}

	try {
		const result = await assessLocationRisk(location);
		return res.json(result);
	} catch (error) {
		logApiError(req, "risk_assessment_failed", error);
		return res.status(500).json({
			error: "Failed to assess risk",
			message: String(error?.message || "Unexpected error"),
			requestId: req.requestId,
			timestamp: new Date().toISOString(),
		});
	}
});

export default router;
