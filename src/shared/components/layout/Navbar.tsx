import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AppRoutes } from '@/routes/appRoutes';
import styles from './Navbar.module.css';

const SECTION_LINKS = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Log Emissions', href: '#log' },
  { label: 'AI Advisor', href: '#advisor' },
  { label: 'Export PDF', href: '#export' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, bootstrapping } = useAuth();

  const onHome = location.pathname === AppRoutes.home;

  return (
    <nav className={styles.navbar}>
      <Link className={styles.brand} to={AppRoutes.home} onClick={() => setMenuOpen(false)}>
        <span className={styles.logo}>🌿</span>
        <span className={styles.brandName}>EcoSense</span>
      </Link>

      <button
        className={styles.menuToggle}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
        {onHome &&
          SECTION_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}

        {!bootstrapping && !isAuthenticated && (
          <>
            <li>
              <Link to={AppRoutes.login} onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            </li>
            <li>
              <Link to={AppRoutes.register} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </li>
          </>
        )}

        {!bootstrapping && isAuthenticated && user && (
          <>
            <li className={styles.userLabel} aria-hidden>
              <span className={styles.userEmail}>{user.displayName?.trim() || user.email}</span>
            </li>
            <li>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                Log out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
