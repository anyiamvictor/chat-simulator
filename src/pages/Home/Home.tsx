import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import image from '@/assets/logo.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img src={image} alt="Chat Simulator Logo" className={styles.logo} />

      <h1 className={styles.title}>Welcome to Chat Simulator</h1>
      <p className={styles.subtitle}>
        Create participants, simulate chat interactions, and even record your chats as video!
      </p>

      <div className={styles.buttonGroup}>
        <button
          className={styles.getStarted}
          onClick={() => navigate('/login')}
        >
          Log in
        </button>

        <div className={styles.authLinks}>
          <p>
            Don't have an account?{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/register')}
            >
              Get Started
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
