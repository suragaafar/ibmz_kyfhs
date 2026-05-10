# 💧 AquaGuard

**AI-powered Water Health Intelligence Platform** | Detect water safety risks before they become public health crises.

---

## 🎯 Overview

AquaGuard combines scattered water data from multiple sources—advisories, flood warnings, contamination risks, infrastructure issues, and community reports—into one intelligent dashboard that helps communities make informed decisions about water safety.

### Key Features

When a user enters a location, they receive:

- **Risk Level** — Low / Medium-Low / Medium / Medium-High / High
- **Confidence Score** — How certain the system is (0-100%)
- **AI-Generated Explanation** — Plain English summary of findings
- **Contributing Factors** — What triggered the assessment
- **Community Reports** — Real-time alerts from residents
- **Sustainability Insights** — Aligned with global water safety goals

---

## 🧠 How It Works

### Core Philosophy

**The AI does not randomly decide risk levels.**

Instead, AquaGuard follows a transparent, evidence-based approach:

1. **Collect Evidence** — Aggregate water advisories, weather alerts, news, reports, infrastructure data
2. **Calculate Risk** — Score and confidence metrics based on real data
3. **Explain Results** — IBM AI generates human-readable explanations backed by evidence

This makes the system **explainable**, **transparent**, and **technically sound**.

### Real-World Example

**Scenario:** Heavy rainfall near Windsor + boil-water advisory issued + shared sewage system + multiple brown water reports

**Result:**
```
Risk Level: Medium
Confidence: 78%
Explanation: "Recent environmental indicators suggest moderate 
contamination risk due to nearby flooding, shared sewage 
infrastructure, and multiple community reports."
```

### Processing Pipeline

```
User Input (Location)
         ↓
   Backend Aggregates Data:
   • Water advisories
   • Weather/flood alerts
   • News articles
   • Community reports
   • Infrastructure data
         ↓
   Risk Engine Calculates:
   • Score (0-100)
   • Confidence level
   • Risk classification
         ↓
   IBM watsonx.ai Generates:
   • Explanation
   • Recommendations
   • Summary
         ↓
   Dashboard Displays Results
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **AI** | IBM watsonx.ai (Granite models) |
| **Styling** | Tailwind CSS |
| **Cloud** | IBM Cloud |

---

## ⚙️ Risk Scoring Logic

### Example Weights

| Factor | Score |
|--------|-------|
| Boil-water advisory | +50 |
| Flood warning | +20 |
| Sewage overflow risk | +15 |
| Multiple community reports | +10 |

### Risk Level Scale

| Score | Classification |
|-------|-----------------|
| 0–24 | Low |
| 25–39 | Medium-Low |
| 40–59 | Medium |
| 60–79 | Medium-High |
| 80–100 | High |

---

## 🌍 Sustainability Alignment

**Primary SDG:** SDG 6 — Clean Water and Sanitation

**Supporting SDGs:**
- 🏥 SDG 3 — Good Health and Well-Being
- 🏗️ SDG 9 — Industry, Innovation and Infrastructure
- 🏙️ SDG 11 — Sustainable Cities and Communities
- 🌡️ SDG 13 — Climate Action

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **IBM watsonx.ai credentials** (for live AI features)

### Quick Setup

```bash
# Clone and navigate
git clone <repo-url>
cd IBMZ_KYFHS/aquaguard

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Configure backend
cd backend
cp .env.example .env
# Edit .env with your IBM watsonx credentials
```

### Run Local Development

**Terminal 1 — Backend:**
```bash
cd aquaguard/backend
npm start
# API runs on http://localhost:4000
```

**Terminal 2 — Frontend:**
```bash
cd aquaguard/frontend
npm run dev
# Dashboard runs on http://localhost:5173
```

### Environment Variables (Backend)

```env
# IBM watsonx.ai
WATSONX_API_KEY=<your-api-key>
WATSONX_PROJECT_ID=<your-project-id>
WATSONX_BASE_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=<optional>
WATSONX_TIMEOUT_MS=10000

# Optional security
API_SHARED_TOKEN=<optional-token-for-post-requests>
```

### Useful Commands

**Backend:**
```bash
npm start          # Start API server
npm run smoke      # Run smoke tests
npm run test:contract  # Validate API contracts
```

**Frontend:**
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `EADDRINUSE: 4000` | Kill the process on port 4000 and retry |
| Port 5173 conflict | Stop process on 5173 and retry frontend |

---

## 📡 API Reference

**Base URL:** `http://localhost:4000`

### Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/health` | GET | — | `status`, `service` |
| `/risk` | GET | `location` | `risk`, `confidence`, `riskScore`, `factors` |
| `/alerts` | GET | `location` (optional) | `alerts[]` |
| `/summary` | GET | `location` | `risk`, `summary`, `factors` |
| `/report` | POST | `location`, `issueType`, `description` | `message`, `report` |
| `/statistics/overview` | GET | — | `totalCompanies`, `uniqueCountries` |
| `/user/companies` | GET | `limit` (optional) | `Company[]` |
| `/countries` | GET | — | `Country[]` |

### Example Requests

```bash
# Get risk for a location
curl -sG "http://localhost:4000/risk" --data-urlencode "location=Mumbai, MH"

# Get AI summary
curl -sG "http://localhost:4000/summary" --data-urlencode "location=Mumbai, MH"

# Report a water issue
curl -X POST "http://localhost:4000/report" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Mumbai, MH",
    "issueType": "cloudy water",
    "description": "Water appears cloudy this morning."
  }'
```

### Example Responses

**`GET /risk?location=Mumbai, MH`**
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

### Error Format

```json
{
  "error": "Validation failed",
  "details": { "field": "context" },
  "requestId": "uuid",
  "timestamp": "2026-05-10T10:30:00.000Z"
}
```

### Rate Limits & Security

| Policy | Limit |
|--------|-------|
| `/summary` rate limit | 25 req/min per IP |
| `/report` rate limit | 15 req/min per IP |
| Optional auth guard | `API_SHARED_TOKEN` header if configured |

---

## 📁 Project Structure

```
IBMZ_KYFHS/
├── aquaguard/
│   ├── backend/           # Node.js + Express API
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── lib/           # Utilities (risk engine, etc.)
│   │   └── data/          # Mock & config data
│   │
│   └── frontend/          # React + Vite
│       ├── src/
│       │   ├── components/  # Reusable components
│       │   ├── pages/       # Page components
│       │   ├── api/         # API client
│       │   └── services/    # Frontend utilities
│       │
│       └── index.html     # Entry point
│
└── README.md              # This file
```

---

## 🤝 Contributing

TODO: Add contribution guidelines.

---

## 📝 License

TODO: Add license information.

---

**Last Updated:** May 10, 2026
