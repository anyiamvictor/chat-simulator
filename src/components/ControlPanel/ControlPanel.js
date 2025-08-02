import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/useChatStore';
import styles from '@/components/ControlPanel/ControlPanel.module.css';
import RecordButton from '../Recording/RecordButton';
export default function ControlPanel({ chatRef }) {
    const { activeChatId, activeParticipants, sendMessage, typingParticipantId, setTypingParticipant, activeSenderId, setActiveSender, darkMode, toggleDarkMode } = useChatStore();
    const [input, setInput] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const inputRef = useRef(null);
    const [showSelectWarning, setShowSelectWarning] = useState(false);
    useEffect(() => {
        if (inputRef.current)
            inputRef.current.focus();
    }, [activeSenderId]);
    useEffect(() => {
        return () => {
            if (typingTimeout)
                clearTimeout(typingTimeout);
        };
    }, [typingTimeout]);
    const handleSend = () => {
        const trimmed = input.trim();
        // if (!trimmed || !activeSenderId) return;
        if (!trimmed || !activeSenderId || !activeChatId)
            return;
        sendMessage(activeChatId, trimmed, activeSenderId);
        setInput('');
        setTypingParticipant(null);
    };
    const handleTyping = (e) => {
        const value = e.target.value;
        setInput(value);
        if (!activeSenderId) {
            setShowSelectWarning(true);
            setTypingParticipant(null);
            return;
        }
        setShowSelectWarning(false);
        setTypingParticipant(activeSenderId);
        if (typingTimeout)
            clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setTypingParticipant(null), 3000));
    };
    const handleToggleTheme = () => {
        if (!chatRef.current)
            return;
        chatRef.current.classList.toggle('dark');
        chatRef.current.classList.toggle('light');
        toggleDarkMode(); // still update the store if needed elsewhere
    };
    const typingName = activeParticipants.find((p) => p.id === typingParticipantId)?.name ?? 'Someone';
    if (!activeChatId || activeParticipants.length === 0) {
        return _jsx("div", { className: styles.panel, children: "No active chat or participants." });
    }
    return (_jsxs("div", { className: styles.panel, children: [_jsx("button", { className: `${styles.toggleSwitch} ${darkMode ? styles.darkModeEnabled : ''}`, onClick: handleToggleTheme, "aria-pressed": darkMode, children: _jsx("span", { className: styles.thumb, children: darkMode ? '🌙' : '🌞' }) }), _jsx("div", { className: styles.subheading, children: "Participants (select a particpant to chat)" }), _jsx("ul", { className: styles.participantList, children: activeParticipants.map((p) => (_jsxs("li", { className: `${styles.participantItem} ${activeSenderId === p.id ? styles.activeParticipant : ''}`, onClick: () => setActiveSender(p.id), children: [_jsx("img", { src: p.photo, alt: p.name, className: styles.avatarSmall }), p.name] }, p.id))) }), _jsxs("div", { className: styles.messageSection, children: [_jsx("textarea", { ref: inputRef, className: styles.textarea, rows: 3, placeholder: "Type your message...", value: input, onChange: handleTyping, disabled: !activeSenderId }), showSelectWarning && (_jsx("div", { className: styles.warning, children: "Select a participant to send a message." })), typingParticipantId && activeSenderId && typingParticipantId !== activeSenderId && (_jsxs("div", { className: styles.typingIndicator, children: [typingName, " is typing..."] })), _jsx("div", { className: styles.controls, children: _jsx("button", { className: styles.sendButton, onClick: handleSend, disabled: !input.trim() || !activeSenderId, children: "Send" }) })] }), _jsx(RecordButton, { targetRef: chatRef })] }));
}
