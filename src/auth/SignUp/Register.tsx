import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/useChatStore';
import styles from './Register.module.css';
import BackButton from '@/components/BackButton/BackButton';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const registerUser = useChatStore((s) => s.registerUser);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    setError("Passwords don't match");
    return;
  }

  try {
    await registerUser(name, email, password);
    navigate('/login');
  } catch (err: any) {
    setError(err.message || 'Failed to register. Try again.');
  }
};


  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
          {error.includes('Network') && (
            <button onClick={handleRegister} className={styles.retryBtn}>
              Retry
            </button>
          )}
        </div>
      )}
      <BackButton />
      <h2 className={styles.title}>Register</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="fake@chat.com"
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
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>



        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}
