// ─── Emission Types ──────────────────────────────────────────────────────────

export type EmissionCategory =
  | 'transportation'
  | 'energy'
  | 'food'
  | 'shopping'
  | 'waste';

export interface EmissionEntry {
  id: string;
  category: EmissionCategory;
  description: string;
  amount: number; // kg CO₂e
  date: string;   // ISO date string
}

// ─── Advisor / Chat Types ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface AdvisorRequest {
  prompt: string;
  history?: ChatMessage[];
}

export interface AdvisorResponse {
  content: string;
  error?: string;
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalEmissions: number;
  monthlyAverage: number;
  topCategory: EmissionCategory;
  percentageChange: number;
}

// ─── PDF Report Types ────────────────────────────────────────────────────────

export interface ReportData {
  generatedAt: string;
  stats: DashboardStats;
  entries: EmissionEntry[];
  aiSummary: string;
  aiAdvice: string;
}
