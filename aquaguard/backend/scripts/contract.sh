#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:4000}"

echo "[contract] Validate /risk missing location -> 400"
status="$(curl -s -o /tmp/risk_missing.json -w "%{http_code}" "${BASE_URL}/risk")"
[[ "$status" == "400" ]] || { echo "Expected 400, got $status"; cat /tmp/risk_missing.json; exit 1; }

echo "[contract] Validate /user/companies bad limit -> 400"
status="$(curl -s -o /tmp/companies_bad_limit.json -w "%{http_code}" "${BASE_URL}/user/companies?limit=0")"
[[ "$status" == "400" ]] || { echo "Expected 400, got $status"; cat /tmp/companies_bad_limit.json; exit 1; }

echo "[contract] Validate /report missing body -> 400"
status="$(curl -s -o /tmp/report_missing_fields.json -w "%{http_code}" -X POST "${BASE_URL}/report" -H "Content-Type: application/json" -d '{}')"
[[ "$status" == "400" ]] || { echo "Expected 400, got $status"; cat /tmp/report_missing_fields.json; exit 1; }

echo "[contract] Validate /risk success -> 200"
status="$(curl -s -o /tmp/risk_success.json -w "%{http_code}" -G "${BASE_URL}/risk" --data-urlencode "location=Mumbai, MH")"
[[ "$status" == "200" ]] || { echo "Expected 200, got $status"; cat /tmp/risk_success.json; exit 1; }

echo "[contract] Passed"
