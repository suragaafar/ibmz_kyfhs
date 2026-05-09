import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from '@/config/env';
import type { AdvisorRequest, AdvisorResponse, ChatMessage, DashboardStats, EmissionEntry } from '@/shared/types';

const API_KEY = getGeminiApiKey();

const SYSTEM_INSTRUCTION = `You are EcoSense AI, a knowledgeable and friendly carbon footprint advisor.
Your role is to help users understand and reduce their carbon emissions.
Provide clear, actionable, and encouraging advice. Keep responses concise (2-4 paragraphs).
Focus on practical tips, alternatives, and positive reinforcement.
When discussing emissions, use kg CO₂e as the unit where relevant.`;

function createClient(): GoogleGenerativeAI | null {
  if (!API_KEY) return null;
  return new GoogleGenerativeAI(API_KEY);
}

function toGeminiHistory(history: ChatMessage[]) {
  return history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
}

/**
 * Send a message to the Gemini API and get an eco-advisor response.
 */
export async function getAdvisorResponse(
  request: AdvisorRequest
): Promise<AdvisorResponse> {
  const client = createClient();

  if (!client) {
    return {
      content: '',
      error:
        'Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.',
    };
  }

  try {
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: toGeminiHistory(request.history ?? []),
    });

    const result = await chat.sendMessage(request.prompt);
    const content = result.response.text();

    return { content };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { content: '', error: `Gemini API error: ${message}` };
  }
}

/**
 * Generate eco-tips for a specific emission category using Gemini.
 */
export async function getEcoTips(category: string): Promise<AdvisorResponse> {
  return getAdvisorResponse({
    prompt: `Give me 3 practical tips to reduce my carbon footprint from ${category}. Format as a numbered list.`,
  });
}

/**
 * Generate a concise report summary and actionable advice for a PDF export.
 * Returns { summary, advice } or error strings if the API is unavailable.
 */
export async function generateReportContent(
  stats: DashboardStats,
  entries: EmissionEntry[]
): Promise<{ summary: string; advice: string }> {
  const categoryBreakdown = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = Number(((acc[e.category] ?? 0) + e.amount).toFixed(2));
    return acc;
  }, {});

  const breakdownText = Object.entries(categoryBreakdown)
    .map(([cat, kg]) => `  • ${cat}: ${kg} kg CO₂e`)
    .join('\n');

  const trend =
    stats.percentageChange < 0
      ? `down ${Math.abs(stats.percentageChange)}% from last period`
      : `up ${stats.percentageChange}% from last period`;

  const summaryPrompt = `
Write a 2-3 sentence narrative summary of the following carbon footprint data for inclusion in a PDF report.
Be factual, clear, and encouraging. Do not use markdown or bullet points.

Total emissions: ${stats.totalEmissions} kg CO₂e
Daily average: ${stats.monthlyAverage} kg CO₂e/day
Trend: ${trend}
Top category: ${stats.topCategory}
Category breakdown:
${breakdownText}
`.trim();

  const advicePrompt = `
Based on the carbon footprint data below, write 3-5 concise, actionable recommendations to reduce emissions.
Format each recommendation as a plain numbered list (e.g. "1. ..."). No markdown headers or bold text.

Top category: ${stats.topCategory}
Category breakdown:
${breakdownText}
`.trim();

  const [summaryRes, adviceRes] = await Promise.all([
    getAdvisorResponse({ prompt: summaryPrompt }),
    getAdvisorResponse({ prompt: advicePrompt }),
  ]);

  const fallbackSummary =
    `Total emissions recorded: ${stats.totalEmissions} kg CO₂e ` +
    `(daily average ${stats.monthlyAverage} kg CO₂e/day). ` +
    `Top emitting category: ${stats.topCategory}.`;

  const fallbackAdvice =
    '1. Reduce car trips by combining errands or using public transport.\n' +
    '2. Switch to energy-efficient appliances and LED lighting.\n' +
    '3. Reduce meat consumption, especially beef.\n' +
    '4. Buy second-hand or only what you need.\n' +
    '5. Compost organic waste to reduce landfill methane.';

  return {
    summary: summaryRes.error || !summaryRes.content ? fallbackSummary : summaryRes.content,
    advice: adviceRes.error || !adviceRes.content ? fallbackAdvice : adviceRes.content,
  };
}
