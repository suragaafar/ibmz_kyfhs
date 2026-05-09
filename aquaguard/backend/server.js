import "dotenv/config";
import cors from "cors";
import express from "express";
import alertsRouter from "./routes/alerts.js";
import { assignRequestId, logRequest } from "./lib/http.js";
import reportRouter from "./routes/report.js";
import riskRouter from "./routes/risk.js";
import summaryRouter from "./routes/summary.js";
import overviewRouter from "./routes/overview.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);

function validateWatsonEnv() {
	const apiKey = process.env.WATSONX_API_KEY;
	const projectId = process.env.WATSONX_PROJECT_ID;
	const baseUrl = process.env.WATSONX_BASE_URL;

	const missing = [];
	if (!apiKey) missing.push("WATSONX_API_KEY");
	if (!projectId) missing.push("WATSONX_PROJECT_ID");
	if (!baseUrl) missing.push("WATSONX_BASE_URL");

	if (missing.length > 0) {
		console.warn(`[watsonx] Missing env vars: ${missing.join(", ")}. /summary will use local fallback.`);
		return;
	}

	if (/\s/.test(apiKey)) {
		console.warn("[watsonx] WATSONX_API_KEY contains whitespace. Re-copy the key without spaces or quotes.");
	}

	if (!String(baseUrl).startsWith("https://")) {
		console.warn("[watsonx] WATSONX_BASE_URL should start with https:// (example: https://us-south.ml.cloud.ibm.com)");
	}

	if (!String(baseUrl).includes("ml.cloud.ibm.com")) {
		console.warn("[watsonx] WATSONX_BASE_URL should usually be an IBM ML domain (example: us-south.ml.cloud.ibm.com)");
	}

	const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	if (!uuidV4Regex.test(String(projectId))) {
		console.warn("[watsonx] WATSONX_PROJECT_ID should be a UUID v4. Check your watsonx project id value.");
	}
}

app.use(cors());
app.use(express.json());
app.use(assignRequestId);
app.use(logRequest);

app.get("/health", (_req, res) => {
	res.json({ status: "ok", service: "aquaguard-backend" });
});

app.use("/risk", riskRouter);
app.use("/alerts", alertsRouter);
app.use("/report", reportRouter);
app.use("/summary", summaryRouter);
app.use("/", overviewRouter);

app.use((req, res) => {
	res.status(404).json({
		error: "Route not found",
		path: req.originalUrl,
		requestId: req.requestId,
		timestamp: new Date().toISOString(),
	});
});

validateWatsonEnv();

app.listen(PORT, () => {
	console.log(`AquaGuard backend listening on http://localhost:${PORT}`);
});
