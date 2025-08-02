import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import ChatArea from '@/components/ChatArea/ChatArea';
import styles from './ChatSimulator.module.css';
import BackButton from '@/components/BackButton/BackButton';
export default function ChatSimulator() {
    const chatRef = useRef(null);
    return (_jsxs("div", { className: styles.wrapperOne, children: [_jsx(BackButton, {}), _jsxs("div", { className: styles.wrapper, children: [_jsx("div", { className: styles.leftPanel, children: _jsx(ControlPanel, { chatRef: chatRef }) }), _jsx("div", { className: styles.rightPanel, children: _jsx(ChatArea, { chatRef: chatRef }) })] })] }));
}
