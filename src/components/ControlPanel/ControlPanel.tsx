import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/useChatStore';
import styles from '@/components/ControlPanel/ControlPanel.module.css';
import RecordButton from '../Recording/RecordButton';

interface Props {
  chatRef: React.RefObject<HTMLDivElement|null>;
}

export default function ControlPanel({ chatRef }: Props) {
  const {
    activeChatId,
    activeParticipants,
    sendMessage,
    typingParticipantId,
    setTypingParticipant,
    activeSenderId,
    setActiveSender,
    darkMode,
    toggleDarkMode
  } = useChatStore();

  const [input, setInput] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSelectWarning, setShowSelectWarning] = useState(false);


  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [activeSenderId]);

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);


  

  const handleSend = () => {
    const trimmed = input.trim();
    // if (!trimmed || !activeSenderId) return;
     if (!trimmed || !activeSenderId || !activeChatId) return;

    sendMessage(activeChatId, trimmed, activeSenderId);
    setInput('');
    setTypingParticipant(null);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

      if (!activeSenderId) {
        setShowSelectWarning(true);
         setTypingParticipant(null); 
    return;
    }
    
     setShowSelectWarning(false);

    setTypingParticipant(activeSenderId);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setTypingParticipant(null), 3000));
  };


  const handleToggleTheme = () => {
  if (!chatRef.current) return;

  chatRef.current.classList.toggle('dark');
  chatRef.current.classList.toggle('light');

  toggleDarkMode(); // still update the store if needed elsewhere
};


  const typingName =
    activeParticipants.find((p) => p.id === typingParticipantId)?.name ?? 'Someone';

  if (!activeChatId || activeParticipants.length === 0) {
    return <div className={styles.panel}>No active chat or participants.</div>;
  }
  

  return (
    <div className={styles.panel}>
      
 <button
  className={`${styles.toggleSwitch} ${darkMode ? styles.darkModeEnabled : ''}`}
  onClick={handleToggleTheme}
  aria-pressed={darkMode}
>
  <span className={styles.thumb}>
    {darkMode ? '🌙' : '🌞'}
  </span>
</button>




      <div className={styles.subheading}>Participants (select a particpant to chat)</div>
      <ul className={styles.participantList}>
        {activeParticipants.map((p) => (
          <li
            key={p.id}
            className={`${styles.participantItem} ${activeSenderId === p.id ? styles.activeParticipant : ''
              }`}
            onClick={() => setActiveSender(p.id)}
          >
            <img src={p.photo} alt={p.name} className={styles.avatarSmall} />
            {p.name}
          </li>
        ))}
      </ul>

    <div className={styles.messageSection}>
  <textarea
    ref={inputRef}
    className={styles.textarea}
    rows={3}
    placeholder="Type your message..."
    value={input}
    onChange={handleTyping}
          disabled={!activeSenderId}
          
  />
  {showSelectWarning && (
    <div className={styles.warning}>
      Select a participant to send a message.
    </div>
  )}

  {typingParticipantId && activeSenderId && typingParticipantId !== activeSenderId && (
    <div className={styles.typingIndicator}>{typingName} is typing...</div>
  )}

  <div className={styles.controls}>
    <button
      className={styles.sendButton}
      onClick={handleSend}
      disabled={!input.trim() || !activeSenderId}
    >
      Send
    </button>
  </div>
</div>


      <RecordButton targetRef={chatRef} />
    </div>
    
  );
}
