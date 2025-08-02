import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/useChatStore';
import styles from './Login.module.css';
import BackButton from '@/components/BackButton/BackButton';
import { Eye, EyeOff } from 'lucide-react'; // Icon library (assuming you're using lucide)

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const loginUser = useChatStore((s) => s.loginUser);
  const syncParticipantsFromServer = useChatStore((s) => s.syncParticipantsFromServer); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await loginUser(email, password);
      await syncParticipantsFromServer();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
          {error.includes('Network') && (
            <button onClick={handleLogin} className={styles.retryBtn}>
              Retry
            </button>
          )}
        </div>
      )}
      <BackButton />
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

            <div className={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
}
