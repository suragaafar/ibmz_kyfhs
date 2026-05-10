# AquaGuard

See project overview and architecture context: [../README.md](../README.md)

## Local Development

From the repository root:

```bash
cd aquaguard/backend
npm install
npm start
```

In a second terminal:

```bash
cd aquaguard/frontend
npm install
npm run dev
```

Open the frontend at http://localhost:5173.

## Environment Setup (Backend)

```bash
cd aquaguard/backend
cp .env.example .env
```

Set the following in `.env` for live AI summaries:

- `WATSONX_API_KEY`
- `WATSONX_PROJECT_ID`
- `WATSONX_BASE_URL`
- `WATSONX_MODEL_ID` (optional)
- `WATSONX_MODEL_CANDIDATES` (optional fallback list)

Optional security hardening:

- `API_SHARED_TOKEN` (if set, `POST /report` requires `x-api-token` header)

## Useful Scripts

Backend (`aquaguard/backend`):

- `npm start` - run API server on `http://localhost:4000`
- `npm run smoke` - smoke test core routes
- `npm run test:contract` - API contract checks

Frontend (`aquaguard/frontend`):

- `npm run dev` - run Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Tech Notes

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: IBM watsonx.ai (with model fallback support)
- Styling: Tailwind via CDN in `frontend/index.html`

## Troubleshooting

- If backend fails with `EADDRINUSE: 4000`, stop the process using port 4000 and rerun `npm start`.
- If frontend fails with port conflict on 5173, stop the process using that port and rerun `npm run dev`.
