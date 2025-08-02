import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import ChatSimulator from './pages/ChatSimulator/ChatSimulator';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from '@/auth/SignUp/Register';
import Login from '@/auth/Login/Login';
import ProtectedRoute from '@/ProtectedRoute';
import { useChatStore } from '@/store/useChatStore';
import LoadingOverlayProps from '@/components/LoadinOverlay/LoadingOverlayProps';
import useNetworkStatus from '@/utils/useNetworkStatus';
import './App.css';
import RootLayout from './components/RootLayout/RootLayout';
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword/ResetPassword';
export default function App() {
    const loading = useChatStore((state) => state.loading);
    const isOnline = useNetworkStatus();
    return (_jsxs("div", { className: "app-container", children: [!isOnline && (_jsx("div", { style: {
                    display: 'block',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 9999,
                    height: '2rem',
                    backdropFilter: 'blur(3px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }, children: "You are offline. Please check your internet connection." })), loading && _jsx(LoadingOverlayProps, { show: true }), _jsx(Routes, { children: _jsxs(Route, { element: _jsx(RootLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/chat", element: _jsx(ProtectedRoute, { children: _jsx(ChatSimulator, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "/reset-password", element: _jsx(ResetPassword, {}) })] }) })] }));
}
