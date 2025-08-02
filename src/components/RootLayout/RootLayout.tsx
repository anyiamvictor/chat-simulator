import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  return (
    <div className={styles.layoutWrapper}>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
