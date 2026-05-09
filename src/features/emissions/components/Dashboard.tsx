import Card from '@/shared/components/ui/Card';
import type { DashboardStats, EmissionEntry } from '@/shared/types';
import styles from './Dashboard.module.css';

const CATEGORY_ICONS: Record<string, string> = {
  transportation: '🚗',
  energy: '⚡',
  food: '🥗',
  shopping: '🛍️',
  waste: '♻️',
};

interface DashboardProps {
  stats: DashboardStats;
  entries: EmissionEntry[];
}

export default function Dashboard({ stats, entries }: DashboardProps) {
  const recentEntries = entries.slice(0, 5);

  return (
    <section id="dashboard" className={styles.dashboard}>
      <h1 className={styles.heading}>Your Carbon Dashboard</h1>
      <p className={styles.subheading}>
        Track your emissions and work towards a greener lifestyle.
      </p>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <Card variant="accent">
          <div className={styles.statLabel}>Total Emissions</div>
          <div className={styles.statValue}>{stats.totalEmissions} kg</div>
          <div className={styles.statUnit}>CO₂ equivalent</div>
        </Card>

        <Card variant="accent">
          <div className={styles.statLabel}>Daily Average</div>
          <div className={styles.statValue}>{stats.monthlyAverage} kg</div>
          <div className={styles.statUnit}>CO₂e / day</div>
        </Card>

        <Card variant="accent">
          <div className={styles.statLabel}>Top Category</div>
          <div className={styles.statValue}>
            {CATEGORY_ICONS[stats.topCategory]} {stats.topCategory}
          </div>
          <div className={styles.statUnit}>Highest emitter</div>
        </Card>

        <Card variant="accent">
          <div className={styles.statLabel}>vs. Last Period</div>
          <div className={`${styles.statValue} ${stats.percentageChange < 0 ? styles.positive : styles.negative}`}>
            {stats.percentageChange > 0 ? '+' : ''}{stats.percentageChange}%
          </div>
          <div className={styles.statUnit}>{stats.percentageChange < 0 ? '↓ Great progress!' : '↑ Room to improve'}</div>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <h2 className={styles.sectionTitle}>Recent Entries</h2>
        <ul className={styles.entryList}>
          {recentEntries.map((entry) => (
            <li key={entry.id} className={styles.entryItem}>
              <span className={styles.entryIcon}>{CATEGORY_ICONS[entry.category]}</span>
              <div className={styles.entryDetails}>
                <span className={styles.entryDesc}>{entry.description}</span>
                <span className={styles.entryDate}>{entry.date}</span>
              </div>
              <span className={styles.entryAmount}>{entry.amount} kg CO₂e</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
