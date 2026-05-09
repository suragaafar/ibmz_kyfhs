import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from '@/features/auth/api';
import { AppRoutes } from '@/routes/appRoutes';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import styles from './AuthPages.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (token.length < 16 || token.length > 256) {
      setError('Reset token is missing or invalid. Open the link from your email again.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError('Password must be between 8 and 128 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const msg = await resetPasswordRequest(token, password);
      setMessage(msg);
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Reset password</h1>
      <p className={styles.subtitle}>
        Set a new password for your account. Use the link from your email so the token is filled in.
      </p>

      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reset-token">
              Reset token
            </label>
            <input
              id="reset-token"
              className={styles.input}
              type="text"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              minLength={16}
              maxLength={256}
              placeholder="Pasted from email link"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reset-password">
              New password
            </label>
            <input
              id="reset-password"
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reset-confirm">
              Confirm new password
            </label>
            <input
              id="reset-confirm"
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.actions}>
            <Button type="submit" isLoading={submitting} size="lg">
              Update password
            </Button>
          </div>
        </form>
      </Card>

      <p className={styles.footer}>
        <Link to={AppRoutes.login}>Sign in</Link>
      </p>
    </div>
  );
}
