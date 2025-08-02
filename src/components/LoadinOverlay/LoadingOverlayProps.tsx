// components/LoadingOverlay/LoadingOverlay.tsx
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  show: boolean;
}

export default function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.text}>Just one minute please...</p>
    </div>
  );
}
