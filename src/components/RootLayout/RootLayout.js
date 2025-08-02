import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import styles from './RootLayout.module.css';
export default function RootLayout() {
    return (_jsxs("div", { className: styles.layoutWrapper, children: [_jsx("main", { className: styles.mainContent, children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
