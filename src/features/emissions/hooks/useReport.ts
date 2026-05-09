import { useState, useCallback } from 'react';
import { generateReportContent } from '@/features/emissions/api';
import { exportReportPDF } from '@/features/emissions/lib/pdfExport';
import type { DashboardStats, EmissionEntry, ReportData } from '@/shared/types';

type ReportStatus = 'idle' | 'generating' | 'ready' | 'error';

interface UseReportReturn {
  status: ReportStatus;
  error: string | null;
  lastReport: ReportData | null;
  generateAndExport: () => Promise<void>;
}

export function useReport(
  stats: DashboardStats,
  entries: EmissionEntry[],
): UseReportReturn {
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<ReportData | null>(null);

  const generateAndExport = useCallback(async () => {
    if (entries.length === 0) {
      setError('No emission entries to report. Log some data first.');
      setStatus('error');
      return;
    }

    setStatus('generating');
    setError(null);

    try {
      const { summary, advice } = await generateReportContent(stats, entries);

      const report: ReportData = {
        generatedAt: new Date().toISOString(),
        stats,
        entries,
        aiSummary: summary,
        aiAdvice: advice,
      };

      exportReportPDF(report);
      setLastReport(report);
      setStatus('ready');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate report';
      setError(msg);
      setStatus('error');
    }
  }, [stats, entries]);

  return { status, error, lastReport, generateAndExport };
}
