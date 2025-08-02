import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await registerUser(name, email, password);
            navigate('/login');
        }
        catch (err) {
            setError(err.message || 'Failed to register. Try again.');
        }
    };
    return (_jsxs("div", { className: styles.container, children: [error && (_jsxs("div", { className: styles.error, children: [error, error.includes('Network') && (_jsx("button", { onClick: handleRegister, className: styles.retryBtn, children: "Retry" }))] })), _jsx(BackButton, {}), _jsx("h2", { className: styles.title, children: "Register" }), error && _jsx("p", { className: styles.error, children: error }), _jsxs("form", { onSubmit: handleRegister, className: styles.form, children: [_jsx("input", { type: "text", placeholder: "Name", className: styles.input, value: name, onChange: (e) => setName(e.target.value), required: true }), _jsx("input", { type: "email", placeholder: "fake@chat.com", className: styles.input, value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsxs("div", { className: styles.passwordWrapper, children: [_jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "Password", className: styles.input, value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "button", className: styles.eyeButton, onClick: () => setShowPassword((prev) => !prev), tabIndex: -1, children: showPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] }), _jsxs("div", { className: styles.passwordWrapper, children: [_jsx("input", { type: showConfirmPassword ? 'text' : 'password', placeholder: "Confirm Password", className: styles.input, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true }), _jsx("button", { type: "button", className: styles.eyeButton, onClick: () => setShowConfirmPassword((prev) => !prev), tabIndex: -1, children: showConfirmPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] }), _jsx("button", { type: "submit", className: styles.button, children: "Register" })] })] }));
}
