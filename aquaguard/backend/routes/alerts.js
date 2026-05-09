import express from "express";
import { validationError } from "../lib/http.js";
import { alerts } from "../data/mockStore.js";

const router = express.Router();

router.get("/", (req, res) => {
	const location = String(req.query.location || "").trim().toLowerCase();

	if (location.length > 120) {
		return validationError(req, res, "location filter must be 120 characters or less", {
			locationLength: location.length,
		});
	}

	const results = alerts.filter((item) => {
		if (!item.active) return false;
		if (!location) return true;
		return item.location.toLowerCase().includes(location);
	});

	return res.json({ count: results.length, alerts: results });
});

export default router;
