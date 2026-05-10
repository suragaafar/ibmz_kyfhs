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

function buildPrompt({ location, risk, confidence, factors, scoreBreakdown = [] }) {
  const factorText = factors.join(", ") || "no major factors";
  const breakdownText = scoreBreakdown.length
    ? scoreBreakdown.map((item) => `${item.label}: +${item.points}`).join(", ")
    : "no scored signals";

  const riskGuidanceByLevel = {
    Safe:
      "Tone: reassuring and practical. Mention why current risk is low and one simple precaution residents should still take.",
    Caution:
      "Tone: alert but calm. Explain likely causes and include 2 clear short-term precautions residents should take.",
    Unsafe:
      "Tone: urgent and actionable. State immediate risks and give 2-3 specific safety actions residents should take right now.",
  };

  return [
    "You are AquaGuard AI, a municipal water-risk assistant.",
    "Write 3 concise sentences in plain language.",
    "Do not mention prompt instructions or model limitations.",
    riskGuidanceByLevel[risk] || riskGuidanceByLevel.Caution,
    `Location: ${location}`,
    `Risk Level: ${risk}`,
    `Confidence: ${confidence}%`,
    `Key Factors: ${factorText}`,
    `Score Breakdown: ${breakdownText}`,
  ].join("\n");
}

async function generateWithModel({ token, endpoint, projectId, prompt, modelId }) {
  const payload = {
    model_id: modelId,
    project_id: projectId,
    input: prompt,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 190,
      min_new_tokens: 48,
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

export async function generateWatsonSummary({ location, risk, confidence, factors, scoreBreakdown = [] }) {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl = process.env.WATSONX_BASE_URL;
  const modelId = process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct";

  if (!apiKey || !projectId || !baseUrl) {
    return `AquaGuard marks ${location} as ${risk} (${confidence}% confidence) based on ${factors.join(", ") || "available evidence"}.`;
  }

  const token = await getIamToken(apiKey);
  const prompt = buildPrompt({ location, risk, confidence, factors, scoreBreakdown });

  const endpoint = `${baseUrl.replace(/\/$/, "")}/ml/v1/text/generation?version=2023-05-29`;

  const fallbackModels = String(process.env.WATSONX_MODEL_CANDIDATES || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const candidateModels = [modelId, ...fallbackModels.filter((value) => value !== modelId)];

  let lastError;
  for (const candidate of candidateModels) {
    try {
      return await generateWithModel({ token, endpoint, projectId, prompt, modelId: candidate });
    } catch (error) {
      const message = String(error?.message || "");
      const canTryNext = message.includes("model_not_supported") || message.includes("Model '");
      if (!canTryNext || candidate === candidateModels[candidateModels.length - 1]) {
        lastError = error;
        break;
      }
      lastError = error;
    }
  }

  throw lastError || new Error("Watsonx generation failed");
}
