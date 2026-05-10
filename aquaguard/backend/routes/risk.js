import express from "express";
import { validationError } from "../lib/http.js";
import { calculateRisk } from "../lib/riskEngine.js";

const router = express.Router();

router.get("/", (req, res) => {
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

	const result = calculateRisk(location);
	return res.json(result);
});

export default router;
