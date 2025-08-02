import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useChatStore } from '@/store/useChatStore';
import styles from './ChatHeader.module.css';
import { Signal, Wifi, BatteryCharging, Clock, Phone, MoreHorizontal, } from 'lucide-react';
export default function ChatHeader() {
    const activeChatId = useChatStore(state => state.activeChatId);
    const meta = useChatStore(state => state.chatMeta[activeChatId || '']);
    const userId = useChatStore(state => state.userId);
    const activeParticipants = useChatStore(state => state.activeParticipants);
    const darkMode = useChatStore(state => state.darkMode);
    if (!activeChatId || !meta)
        return null;
    const isGroup = meta.is_group;
    const recipient = activeParticipants.find(p => p.id !== userId);
    const renderGroupInfo = () => {
        const names = activeParticipants.map(p => p.name);
        const groupMembers = names.slice(0, 3).join(', ') + (names.length > 3 ? '...' : '');
        return (_jsxs(_Fragment, { children: [_jsx("img", { src: meta.group_icon || '/default-group.png', alt: "Group", className: styles.avatar }), _jsxs("div", { className: styles.nameBlock, children: [_jsx("div", { className: styles.title, children: meta.title || 'Group Chat' }), _jsx("div", { className: styles.subtitle, children: groupMembers })] })] }));
    };
    const renderOneOnOneInfo = () => {
        if (!recipient)
            return null;
        return (_jsxs(_Fragment, { children: [_jsx("img", { src: recipient.photo, alt: recipient.name, className: styles.avatar }), _jsxs("div", { className: styles.nameBlock, children: [_jsx("div", { className: styles.title, children: recipient.name }), _jsx("div", { className: styles.subtitle, children: "Online" })] })] }));
    };
    return (_jsxs("div", { className: `${styles.wrapper} ${darkMode ? styles.dark : styles.light}`, children: [_jsxs("div", { className: styles.statusBar, children: [_jsxs("span", { className: styles.time, children: [_jsx(Clock, { size: 14, strokeWidth: 1.5, className: styles.icon }), new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsx(Signal, { size: 16, strokeWidth: 1.5, className: styles.icon }), _jsx(Wifi, { size: 16, strokeWidth: 1.5, className: `${styles.icon} ${styles.pulse}` }), _jsx(BatteryCharging, { size: 16, strokeWidth: 1.5, className: `${styles.icon} ${styles.blink}` })] }), _jsxs("header", { className: styles.chatHeader, children: [_jsx("div", { className: styles.headerContent, children: isGroup ? renderGroupInfo() : renderOneOnOneInfo() }), _jsxs("div", { className: styles.headerActions, children: [_jsx(Phone, { size: 18, strokeWidth: 1.8, className: styles.icon }), _jsx(MoreHorizontal, { size: 20, strokeWidth: 1.5, className: styles.icon })] })] })] }));
}
