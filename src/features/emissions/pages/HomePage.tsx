import Dashboard from '@/features/emissions/components/Dashboard';
import EmissionLogger from '@/features/emissions/components/EmissionLogger';
import Advisor from '@/features/emissions/components/Advisor';
import ExportReport from '@/features/emissions/components/ExportReport';
import { useEmissions } from '@/features/emissions/hooks/useEmissions';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { entries, stats, addEntry } = useEmissions();

  return (
    <div className={styles.page}>
      <Dashboard stats={stats} entries={entries} />
      <hr className={styles.divider} />
      <EmissionLogger onAdd={addEntry} />
      <hr className={styles.divider} />
      <Advisor />
      <hr className={styles.divider} />
      <ExportReport stats={stats} entries={entries} />
    </div>
  );
}
