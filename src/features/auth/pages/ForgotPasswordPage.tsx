import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '@/features/auth/api';
import { AppRoutes } from '@/routes/appRoutes';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import styles from './AuthPages.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const msg = await forgotPasswordRequest(email.trim());
      setMessage(msg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Forgot password</h1>
      <p className={styles.subtitle}>
        Enter your email. If an account exists, you will receive reset instructions.
      </p>

      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.actions}>
            <Button type="submit" isLoading={submitting} size="lg">
              Send reset link
            </Button>
          </div>
        </form>
      </Card>

      <p className={styles.footer}>
        <Link to={AppRoutes.login}>Back to sign in</Link>
      </p>
    </div>
  );
}
