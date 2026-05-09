import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2026 EcoSense — Track, understand, and reduce your carbon footprint</p>
      </footer>
    </div>
  );
}
