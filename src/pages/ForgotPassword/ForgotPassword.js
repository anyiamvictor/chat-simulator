import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '@/utils/superbaseClient'; // Step 1
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleReset = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://anyiamvictor.github.io/chat-simulator/#/reset-password', // Step 4
        });
        if (error) {
            setError(error.message);
        }
        else {
            setMessage('Check your email for the reset link.');
        }
    };
    return (_jsxs("div", { style: { maxWidth: 400, margin: '2rem auto', padding: '1rem' }, children: [_jsx("h2", { children: "Forgot Password" }), _jsxs("form", { onSubmit: handleReset, children: [_jsx("input", { type: "email", placeholder: "Enter your email", value: email, onChange: (e) => {
                            setEmail(e.target.value);
                            setError('');
                            setMessage('');
                        }, required: true }), _jsx("button", { type: "submit", children: "Send Reset Link" })] }), message && _jsx("p", { style: { color: 'green' }, children: message }), error && _jsx("p", { style: { color: 'red' }, children: error })] }));
}
