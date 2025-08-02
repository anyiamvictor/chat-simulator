import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import image from '@/assets/logo.png';
export default function Home() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: styles.container, children: [_jsx("img", { src: image, alt: "Chat Simulator Logo", className: styles.logo }), _jsx("h1", { className: styles.title, children: "Welcome to Chat Simulator" }), _jsx("p", { className: styles.subtitle, children: "Create participants, simulate chat interactions, and even record your chats as video!" }), _jsxs("div", { className: styles.buttonGroup, children: [_jsx("button", { className: styles.getStarted, onClick: () => navigate('/login'), children: "Log in" }), _jsx("div", { className: styles.authLinks, children: _jsxs("p", { children: ["Don't have an account?", ' ', _jsx("span", { className: styles.link, onClick: () => navigate('/register'), children: "Get Started" })] }) })] })] }));
}
