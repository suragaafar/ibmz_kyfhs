import express from "express";
import { validationError } from "../lib/http.js";
import { addReport } from "../data/mockStore.js";

const router = express.Router();

router.post("/", (req, res) => {
	const location = String(req.body?.location || "").trim();
	const issueType = String(req.body?.issueType || "").trim();
	const description = String(req.body?.description || "").trim();
	const submittedBy = String(req.body?.submittedBy || "").trim();
	const severity = String(req.body?.severity || "medium").trim().toLowerCase();

	if (!location || !issueType || !description) {
		return validationError(req, res, "location, issueType, and description are required", {
			requiredFields: ["location", "issueType", "description"],
		});
	}

	if (location.length < 2 || location.length > 120) {
		return validationError(req, res, "location must be between 2 and 120 characters", {
			locationLength: location.length,
		});
	}

	if (issueType.length < 2 || issueType.length > 60) {
		return validationError(req, res, "issueType must be between 2 and 60 characters", {
			issueTypeLength: issueType.length,
		});
	}

	if (description.length < 8 || description.length > 1000) {
		return validationError(req, res, "description must be between 8 and 1000 characters", {
			descriptionLength: description.length,
		});
	}

	const validSeverities = ["low", "medium", "high"];
	if (!validSeverities.includes(severity)) {
		return validationError(req, res, "severity must be one of: low, medium, high", {
			severity,
			allowed: validSeverities,
		});
	}

	const report = addReport({
		location,
		issueType,
		description,
		submittedBy,
		severity,
	});

	return res.status(201).json({ message: "Report submitted", report });
});

export default router;
