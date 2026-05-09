import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { useReport } from '@/features/emissions/hooks/useReport';
import type { DashboardStats, EmissionEntry } from '@/shared/types';
import styles from './ExportReport.module.css';

interface ExportReportProps {
  stats: DashboardStats;
  entries: EmissionEntry[];
}

export default function ExportReport({ stats, entries }: ExportReportProps) {
  const { status, error, lastReport, generateAndExport } = useReport(stats, entries);

  const isGenerating = status === 'generating';

  return (
    <section id="export" className={styles.section}>
      <h2 className={styles.heading}>📄 Export Report</h2>
      <p className={styles.subheading}>
        Generate a PDF report with your emissions summary and AI-powered advice.
      </p>

      <Card className={styles.card}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Entries included</span>
            <span className={styles.infoValue}>{entries.length}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total emissions</span>
            <span className={styles.infoValue}>{stats.totalEmissions} kg CO₂e</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>AI advice</span>
            <span className={styles.infoValue}>Included ✓</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Format</span>
            <span className={styles.infoValue}>PDF (A4)</span>
          </div>
        </div>

        {isGenerating && (
          <div className={styles.progress}>
            <div className={styles.progressBar} />
            <p className={styles.progressText}>
              Generating AI summary and building your PDF…
            </p>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {status === 'ready' && lastReport && (
          <p className={styles.success}>
            ✓ Report downloaded —{' '}
            <span className={styles.filename}>
              ecosense-report-{lastReport.generatedAt.split('T')[0]}.pdf
            </span>
          </p>
        )}

        <div className={styles.actions}>
          <Button
            onClick={generateAndExport}
            isLoading={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Generating…' : '⬇ Download PDF Report'}
          </Button>
          <p className={styles.hint}>
            The report includes an emissions breakdown, AI-generated narrative summary,
            and personalised recommendations.
          </p>
        </div>
      </Card>
    </section>
  );
}
