import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// components/ProtectedRoute.tsx
import { useChatStore } from '@/store/useChatStore';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
export default function ProtectedRoute({ children }) {
    const isLoggedIn = useChatStore((s) => s.isLoggedIn);
    const [checkingAuth, setCheckingAuth] = useState(true);
    useEffect(() => {
        // Allow Zustand to load from persisted storage before checking
        const timeout = setTimeout(() => setCheckingAuth(false), 50);
        return () => clearTimeout(timeout);
    }, []);
    if (checkingAuth)
        return null; // or <LoadingScreen />
    if (!isLoggedIn)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
}
