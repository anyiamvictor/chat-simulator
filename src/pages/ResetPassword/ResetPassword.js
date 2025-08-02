import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setError(error.message);
        }
        else {
            setSuccess('Password updated! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        }
    };
    if (loading)
        return _jsx("p", { style: { textAlign: 'center' }, children: "Validating reset link..." });
    return (_jsxs("div", { style: { maxWidth: 400, margin: '2rem auto', padding: '1rem' }, children: [_jsx("h2", { children: "Reset Password" }), _jsxs("form", { onSubmit: handleReset, children: [_jsx("input", { type: "password", placeholder: "Enter new password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), required: true, style: { padding: '0.75rem', width: '100%', marginBottom: '1rem' } }), _jsx("button", { type: "submit", style: {
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }, children: "Update Password" })] }), success && _jsx("p", { style: { color: 'green' }, children: success }), error && _jsx("p", { style: { color: 'red' }, children: error })] }));
}
