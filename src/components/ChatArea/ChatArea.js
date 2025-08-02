import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import ChatBubble from '../Chatbubble/ChatBubble';
import ChatHeader from '@/components/ChatArea/ChatHeader';
import styles from './ChatArea.module.css';
export default function ChatArea({ chatRef }) {
    const { activeChatId, chats, participants, typingParticipantId, userId, userName, darkMode } = useChatStore();
    const messages = chats[activeChatId || ''] || [];
    const scrollRef = useRef(null);
    useEffect(() => {
        const isDesktop = window.innerWidth > 768; // adjust breakpoint if needed
        if (isDesktop && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, typingParticipantId]);
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.classList.remove('dark', 'light');
            chatRef.current.classList.add(darkMode ? 'dark' : 'light');
        }
    }, [chatRef, darkMode]);
    if (!activeChatId) {
        return (_jsx("div", { className: styles.emptyState, children: "Select a participant to start chatting." }));
    }
    return (_jsxs("div", { ref: chatRef, className: `${styles.chatWrapper} ${darkMode ? styles.dark : styles.light}`, children: [_jsx(ChatHeader, {}), _jsx("div", { className: styles.chatArea, children: _jsxs("div", { className: styles.messagesList, children: [messages.map((msg) => (_jsx(ChatBubble, { message: msg }, msg.id))), typingParticipantId &&
                            typingParticipantId !== null &&
                            participants.some(p => p.id === typingParticipantId) && (_jsxs("div", { className: `${styles.typingIndicator} ${typingParticipantId === userId ? styles.typingUser : styles.typingOther}`, children: [typingParticipantId === userId
                                    ? `${userName} is typing`
                                    : `${participants.find(p => p.id === typingParticipantId)?.name} is typing`, _jsx("span", { className: styles.typingDots, children: "..." })] })), _jsx("div", { ref: scrollRef })] }) })] }));
}
