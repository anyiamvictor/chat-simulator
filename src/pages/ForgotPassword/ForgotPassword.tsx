import { useState } from 'react';
import { supabase } from '@/utils/superbaseClient'; // Step 1

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://anyiamvictor.github.io/chat-simulator/#/reset-password'

, // Step 4
    });
      
      

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the reset link.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
            setMessage('');
          }}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
