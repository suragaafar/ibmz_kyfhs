import { useState, type FormEvent } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import type { EmissionEntry, EmissionCategory } from '@/shared/types';
import styles from './EmissionLogger.module.css';

const CATEGORIES: EmissionCategory[] = [
  'transportation',
  'energy',
  'food',
  'shopping',
  'waste',
];

interface EmissionLoggerProps {
  onAdd: (entry: Omit<EmissionEntry, 'id'>) => void;
}

export default function EmissionLogger({ onAdd }: EmissionLoggerProps) {
  const [category, setCategory] = useState<EmissionCategory>('transportation');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      category,
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
    });

    setDescription('');
    setAmount('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <section id="log" className={styles.section}>
      <h2 className={styles.heading}>Log an Emission</h2>
      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <select
              id="category"
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as EmissionCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <input
              id="description"
              type="text"
              className={styles.input}
              placeholder="e.g. Drive to work (15 km)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="amount" className={styles.label}>CO₂e Amount (kg)</label>
            <input
              id="amount"
              type="number"
              className={styles.input}
              placeholder="e.g. 3.2"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit">Add Entry</Button>
            {submitted && (
              <span className={styles.success}>✓ Entry logged successfully!</span>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}
