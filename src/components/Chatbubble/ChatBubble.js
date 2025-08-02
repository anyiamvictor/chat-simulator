import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatStore } from '@/store/useChatStore';
import styles from './ChatBubble.module.css';
export default function ChatBubble({ message }) {
    const userId = useChatStore((state) => state.userId);
    const participants = useChatStore((state) => state.participants);
    // const darkMode = useChatStore((state) => state.darkMode);
    const isYou = message.sender === userId;
    const sender = participants.find((p) => p.id === message.sender);
    const senderName = isYou ? 'You' : sender?.name || 'Unknown';
    const senderPhoto = sender?.photo || '/default-avatar.png'; // fallback to default image
    return (_jsxs("div", { className: isYou ? styles.bubbleRight : styles.bubbleLeft, children: [_jsx("img", { src: senderPhoto, alt: senderName, className: styles.dp }), _jsxs("div", { className: `${styles.bubble} ${isYou ? styles.you : styles.them}`, children: [!isYou && _jsx("div", { className: styles.sender, children: senderName }), _jsx("p", { children: message.content }), _jsx("div", { className: styles.meta, children: new Date(message.timestamp).toLocaleTimeString() })] })] }));
}
