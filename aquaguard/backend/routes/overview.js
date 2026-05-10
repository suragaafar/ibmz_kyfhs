import express from "express";
import { validationError } from "../lib/http.js";
import { companies, countries, getOverviewStats } from "../data/overviewStore.js";

const router = express.Router();

router.get("/statistics/overview", (_req, res) => {
  return res.json(getOverviewStats());
});

router.get("/user/companies", (req, res) => {
  const rawLimit = req.query.limit;
  const limit = Number(rawLimit || 0);

  if (rawLimit !== undefined) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 10000) {
      return validationError(req, res, "limit must be an integer between 1 and 10000", {
        limit: rawLimit,
      });
    }
  }

  const data = Number.isFinite(limit) && limit > 0 ? companies.slice(0, limit) : companies;
  return res.json(data);
});

router.get("/countries", (_req, res) => {
  return res.json(countries);
});

export default router;
