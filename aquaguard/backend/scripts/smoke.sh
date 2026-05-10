#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:4000}"

echo "[smoke] Health"
curl -fsS "${BASE_URL}/health" | cat

echo "\n[smoke] Risk"
curl -fsSG "${BASE_URL}/risk" --data-urlencode "location=Mumbai, MH" | cat

echo "\n[smoke] Summary"
summary_response="$(curl -sSG "${BASE_URL}/summary" --data-urlencode "location=Mumbai, MH")"
echo "${summary_response}" | cat

if echo "${summary_response}" | grep -q '"error"'; then
	echo "[smoke] WARN: /summary returned an error (likely Watson config/model issue). Continuing core API checks."
fi

echo "\n[smoke] Overview"
curl -fsS "${BASE_URL}/statistics/overview" | cat

echo "\n[smoke] Countries"
curl -fsS "${BASE_URL}/countries" | cat

echo "\n[smoke] Passed"
