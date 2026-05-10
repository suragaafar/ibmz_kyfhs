const IAM_URL = "https://iam.cloud.ibm.com/identity/token";

const DEFAULT_TIMEOUT_MS = Number(process.env.WATSONX_TIMEOUT_MS || 10_000);

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function getIamToken(apiKey) {
  const body = new URLSearchParams({
    grant_type: "urn:ibm:params:oauth:grant-type:apikey",
    apikey: apiKey,
  });

  const response = await fetchWithTimeout(IAM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get IBM IAM token: ${response.status} ${text}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

export async function generateWatsonSummary({ location, risk, confidence, factors }) {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl = process.env.WATSONX_BASE_URL;
  const modelId = process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct";

  if (!apiKey || !projectId || !baseUrl) {
    return `AquaGuard marks ${location} as ${risk} (${confidence}% confidence) based on ${factors.join(", ") || "available evidence"}.`;
  }

  const token = await getIamToken(apiKey);
  const prompt = `You are AquaGuard AI. Explain this water-risk result in 2-4 concise sentences.\nLocation: ${location}\nRisk: ${risk}\nConfidence: ${confidence}%\nFactors: ${factors.join(", ") || "none"}`;

  const endpoint = `${baseUrl.replace(/\/$/, "")}/ml/v1/text/generation?version=2023-05-29`;
  const payload = {
    model_id: modelId,
    project_id: projectId,
    input: prompt,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 180,
      min_new_tokens: 40,
    },
  };

  let response = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Retry once for transient failures.
  if (response.status === 429 || response.status >= 500) {
    response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Watsonx generation failed: ${response.status} ${text}`);
  }

  const responseJson = await response.json();
  return responseJson?.results?.[0]?.generated_text?.trim() || "No summary generated.";
}
