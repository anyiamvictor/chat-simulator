import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/LoadingOverlay/LoadingOverlay.tsx
import styles from './LoadingOverlay.module.css';
export default function LoadingOverlay({ show }) {
    if (!show)
        return null;
    return (_jsxs("div", { className: styles.overlay, children: [_jsx("div", { className: styles.spinner }), _jsx("p", { className: styles.text, children: "Just one minute please..." })] }));
}
