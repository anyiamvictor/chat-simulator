import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await loginUser(email, password);
            await syncParticipantsFromServer();
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.message || 'Login failed');
        }
    };
    return (_jsxs("div", { className: styles.container, children: [error && (_jsxs("div", { className: styles.error, children: [error, error.includes('Network') && (_jsx("button", { onClick: handleLogin, className: styles.retryBtn, children: "Retry" }))] })), _jsx(BackButton, {}), _jsx("h2", { className: styles.title, children: "Login" }), error && _jsx("p", { className: styles.error, children: error }), _jsxs("form", { onSubmit: handleLogin, className: styles.form, children: [_jsx("input", { type: "email", placeholder: "Email", className: styles.input, value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsxs("div", { className: styles.passwordWrapper, children: [_jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "Password", className: styles.input, value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "button", className: styles.eyeButton, onClick: () => setShowPassword((prev) => !prev), children: showPassword ? _jsx(EyeOff, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), _jsx("button", { type: "submit", className: styles.button, children: "Login" })] }), _jsx("p", { children: _jsx(Link, { to: "/forgot-password", children: "Forgot password?" }) })] }));
}
