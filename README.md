# AquaGuard

See developer setup and runbook: [aquaguard/README.md](aquaguard/README.md)

AquaGuard is an AI-powered Water Health Intelligence platform that helps communities detect possible water safety risks before they become public health crises.

Today, water alerts, flood warnings, contamination risks, infrastructure issues, and community concerns are often scattered across multiple sources and difficult to understand quickly. AquaGuard combines all of that into one intelligent dashboard.

The user enters a location, and the system provides:

- Risk level (Low / Medium-Low / Medium / Medium-High / High)
- Confidence score
- AI-generated explanation
- Contributing risk factors
- Community reports
- Sustainability insights

---

## Main Concept

The key principle is:

The AI does not randomly decide risk levels.

Instead:

1. We collect evidence.
2. We calculate a confidence/risk score.
3. Then IBM AI explains the result in plain English.

This makes the system:

- Explainable
- Transparent
- Technically stronger

---

## Example Scenario

Suppose:

- Heavy rainfall occurs near Windsor.
- A nearby municipality issues a boil-water advisory.
- The sewage system is shared.
- Multiple users report brown/cloudy water.

The platform combines this evidence and outputs:

Risk Level: Medium  
Confidence: 78%

Then the AI explains why.

Example:
"Recent environmental indicators suggest moderate contamination risk due to nearby flooding, shared sewage infrastructure, and multiple community reports."

---

## AI / RAG Architecture

We use a RAG-style workflow (Retrieval-Augmented Generation).

Meaning:
The AI retrieves real evidence first, then generates grounded explanations.

The AI does not invent information from nowhere.

Pipeline:

1. User enters location.
2. Backend collects:
	- Water advisories
	- Weather/flood alerts
	- News articles
	- Community reports
	- Municipality infrastructure relationships
3. Risk engine calculates:
	- Score
	- Confidence
	- Risk level
4. IBM watsonx.ai / Granite generates:
	- Explanation
	- Recommendations
	- Summary
5. Dashboard displays results.

---

## IBM Technologies

We are integrating:

- IBM watsonx.ai
- IBM Granite models
- IBM Cloud
- Optional watsonx Assistant

IBM AI is mainly used for:

- Summarization
- Explanation
- Alert interpretation
- Recommendation generation

Not for calculating the actual risk score.

---

## Sustainability / SDGs

Main SDG:

- SDG 6 — Clean Water and Sanitation

Secondary:

- SDG 3 — Good Health and Well-Being
- SDG 9 — Industry, Innovation and Infrastructure
- SDG 11 — Sustainable Cities and Communities
- SDG 13 — Climate Action

This makes the project:

- Sustainability-focused
- Humanitarian
- Climate-related
- Healthcare-related

---

## Risk Scoring Logic

Example weights:

- Boil-water advisory = +50
- Flood warning = +20
- Sewage overflow risk = +15
- Multiple community reports = +10

Risk levels:

- 0-24 = Low
- 25-39 = Medium-Low
- 40-59 = Medium
- 60-79 = Medium-High
- 80-100 = High

This logic lives inside the risk engine.

---

## Local Development

### Prerequisites

- Node.js 18+
- IBM watsonx.ai credentials (for live summary generation)

### Installation

```bash
git clone <repo-url>
cd IBMZ_KYFHS
```

### Install dependencies

```bash
cd aquaguard/frontend
npm install

cd ../backend
npm install
```

### Configure backend environment

```bash
cd aquaguard/backend
cp .env.example .env
```

Edit `.env` and set:

- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `WATSONX_BASE_URL` (for example `https://us-south.ml.cloud.ibm.com`)
- `WATSONX_MODEL_ID` (optional)
- `WATSONX_TIMEOUT_MS` (optional, default `10000`)
- `API_SHARED_TOKEN` (optional; if set, POST `/report` requires header `x-api-token`)

### Run frontend

```bash
cd aquaguard/frontend
cp .env.example .env
npm run dev
```

Open http://localhost:5173

`VITE_API_BASE_URL` defaults to `http://localhost:4000`.

### Run backend (when available)

```bash
cd aquaguard/backend
npm start
```

### Smoke test backend

```bash
cd aquaguard/backend
npm run smoke
```

### Contract validation test

```bash
cd aquaguard/backend
npm run test:contract
```

---

## API Contract (Person 2)

Base URL (local): `http://localhost:4000`

| Endpoint | Method | Required Input | Success Response (core fields) |
|---|---|---|---|
| `/health` | GET | None | `status`, `service` |
| `/risk` | GET | `location` query param | `location`, `risk`, `confidence`, `riskScore`, `factors`, `alerts`, `reports`, `generatedAt` |
| `/alerts` | GET | Optional `location` query param | `count`, `alerts[]` |
| `/report` | POST | JSON body: `location`, `issueType`, `description` | `message`, `report` |
| `/summary` | GET | `location` query param | `location`, `risk`, `confidence`, `summary`, `factors`, `generatedAt` |
| `/statistics/overview` | GET | None | `totalCompanies`, `uniqueCountries` |
| `/user/companies` | GET | Optional `limit` query param (`1..10000`) | `Company[]` |
| `/countries` | GET | None | `Country[]` |

### Validation Error Format

Validation errors return HTTP 400 with this shape:

```json
{
	"error": "validation message",
	"details": {
		"field": "context"
	},
	"requestId": "uuid",
	"timestamp": "ISO-8601"
}
```

### Runtime Protections

- Rate limits:
	- `/summary`: 25 requests per minute per IP
	- `/report`: 15 requests per minute per IP
- Optional auth guard:
	- If `API_SHARED_TOKEN` is set, `POST /report` requires header `x-api-token`.

### Example Requests

```bash
curl -sG "http://localhost:4000/risk" --data-urlencode "location=Mumbai, MH"
curl -sG "http://localhost:4000/summary" --data-urlencode "location=Mumbai, MH"
curl -s -X POST "http://localhost:4000/report" -H "Content-Type: application/json" -d '{"location":"Mumbai, MH","issueType":"cloudy water","description":"Water appears cloudy this morning."}'
```

### Example Success Responses

`GET /health`

```json
{
	"status": "ok",
	"service": "aquaguard-backend"
}
```

`GET /risk?location=Mumbai,%20MH`

```json
{
	"location": "Mumbai, MH",
	"risk": "Safe",
	"confidence": 71,
	"riskScore": 30,
	"factors": ["flood warning", "multiple community reports"],
	"alerts": [],
	"reports": [],
	"generatedAt": "2026-05-09T23:40:00.000Z"
}
```

`GET /summary?location=Mumbai,%20MH`

```json
{
	"location": "Mumbai, MH",
	"risk": "Safe",
	"confidence": 71,
	"summary": "AquaGuard marks Mumbai, MH as Safe...",
	"factors": ["flood warning", "multiple community reports"],
	"generatedAt": "2026-05-09T23:40:00.000Z"
}
```

### Build

```bash
cd aquaguard/frontend
npm run build
```
