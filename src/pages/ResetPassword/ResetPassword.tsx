import { useEffect, useState } from 'react';
import { supabase } from '@/utils/superbaseClient'; // adjust path as needed
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeToken = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
      if (error) {
        setError('Reset link is invalid or expired.');
        console.error('Token exchange error:', error.message);
      }
      setLoading(false);
    };

    exchangeToken();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Validating reset link...</p>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ padding: '0.75rem', width: '100%', marginBottom: '1rem' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update Password
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
