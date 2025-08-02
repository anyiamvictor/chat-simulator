import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import ChatBubble from '../Chatbubble/ChatBubble';
import ChatHeader from '@/components/ChatArea/ChatHeader';
import styles from './ChatArea.module.css';

export default function ChatArea({ chatRef }: { chatRef: React.RefObject<HTMLDivElement|null> }) {
  const {
    activeChatId,
    chats,
    participants,
    typingParticipantId,
    userId,
    userName,
    darkMode
  } = useChatStore();

  const messages = chats[activeChatId || ''] || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
    return (
      <div className={styles.emptyState}>
        Select a participant to start chatting.
      </div>
    );
  }

  return (
    <div ref={chatRef}
      className={`${styles.chatWrapper} ${darkMode ? styles.dark : styles.light}`}
    >
        <ChatHeader />
      <div  className={styles.chatArea}>
        <div className={styles.messagesList}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

       {typingParticipantId &&
  typingParticipantId !== null &&
  participants.some(p => p.id === typingParticipantId) && (
    <div
      className={`${styles.typingIndicator} ${
        typingParticipantId === userId ? styles.typingUser : styles.typingOther
      }`}
    >
      {typingParticipantId === userId
        ? `${userName} is typing`
        : `${participants.find(p => p.id === typingParticipantId)?.name} is typing`}
      <span className={styles.typingDots}>...</span>
    </div>
)}


          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
}
