import { Message, useChatStore } from '@/store/useChatStore';
import styles from './ChatBubble.module.css';

type Props = {
  message: Message;
};

export default function ChatBubble({ message }: Props) {
  const userId = useChatStore((state) => state.userId);
  const participants = useChatStore((state) => state.participants);
  // const darkMode = useChatStore((state) => state.darkMode);


  const isYou = message.sender === userId;
  const sender = participants.find((p) => p.id === message.sender);
  const senderName = isYou ? 'You' : sender?.name || 'Unknown';
  const senderPhoto = sender?.photo || '/default-avatar.png'; // fallback to default image

  return (
    <div className={isYou ? styles.bubbleRight : styles.bubbleLeft}>
      
      <img src={senderPhoto} alt={senderName} className={styles.dp} />

      <div className={`${styles.bubble} ${isYou ? styles.you : styles.them}`}>
        {!isYou && <div className={styles.sender}>{senderName}</div>}
        <p>{message.content}</p>
        <div className={styles.meta}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
