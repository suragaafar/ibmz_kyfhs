import { useState, useCallback } from 'react';
import type { EmissionEntry, EmissionCategory, DashboardStats } from '@/shared/types';

const DEMO_DATA: EmissionEntry[] = [
  { id: '1', category: 'transportation', description: 'Daily commute (car)', amount: 3.2, date: '2026-04-01' },
  { id: '2', category: 'energy', description: 'Home electricity', amount: 4.5, date: '2026-04-01' },
  { id: '3', category: 'food', description: 'Beef meal', amount: 2.7, date: '2026-04-02' },
  { id: '4', category: 'transportation', description: 'Flight (short-haul)', amount: 180, date: '2026-04-03' },
  { id: '5', category: 'shopping', description: 'New clothing item', amount: 8.0, date: '2026-04-03' },
];

interface UseEmissionsReturn {
  entries: EmissionEntry[];
  stats: DashboardStats;
  addEntry: (entry: Omit<EmissionEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
}

function computeStats(entries: EmissionEntry[]): DashboardStats {
  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  const byCat = entries.reduce<Record<EmissionCategory, number>>(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    },
    {} as Record<EmissionCategory, number>
  );

  const topCategory = (Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    'transportation') as EmissionCategory;

  return {
    totalEmissions: Number(total.toFixed(1)),
    monthlyAverage: Number((total / 30).toFixed(1)),
    topCategory,
    percentageChange: -12,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useEmissions(): UseEmissionsReturn {
  const [entries, setEntries] = useState<EmissionEntry[]>(DEMO_DATA);

  const stats = computeStats(entries);

  const addEntry = useCallback((entry: Omit<EmissionEntry, 'id'>) => {
    setEntries((prev) => [{ ...entry, id: generateId() }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, stats, addEntry, removeEntry };
}
