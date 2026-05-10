import express from "express";
import { validationError } from "../lib/http.js";
import { alerts } from "../data/mockStore.js";
import { getAlertSignal } from "../services/alertsService.js";

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

router.get("/signal", async (req, res, next) => {
	try {
		const location = String(req.query.location || "").trim();
		if (!location) {
			return validationError(req, res, "location is required");
		}

		const signal = await getAlertSignal(location);
		if (!signal) {
			return res.status(404).json({ message: "No alert coordinates available for this location" });
		}

		return res.json(signal);
	} catch (error) {
		return next(error);
	}
});

export default router;
