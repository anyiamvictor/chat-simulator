import { useChatStore } from '@/store/useChatStore';
import styles from './ChatHeader.module.css';
import {
  Signal,
  Wifi,
  BatteryCharging,
  Clock,
  Phone,
  MoreHorizontal,
} from 'lucide-react';

export default function ChatHeader() {
  const activeChatId = useChatStore(state => state.activeChatId);
  const meta = useChatStore(state => state.chatMeta[activeChatId || '']);
  const userId = useChatStore(state => state.userId);
  const activeParticipants = useChatStore(state => state.activeParticipants);
  const darkMode = useChatStore(state => state.darkMode);


  if (!activeChatId || !meta) return null;
  const isGroup = meta.is_group;

  const recipient = activeParticipants.find(p => p.id !== userId);

  const renderGroupInfo = () => {
    const names = activeParticipants.map(p => p.name);
    const groupMembers = names.slice(0, 3).join(', ') + (names.length > 3 ? '...' : '');

    return (
      <>
        <img src={meta.group_icon || '/default-group.png'} alt="Group" className={styles.avatar} />
        <div className={styles.nameBlock}>
          <div className={styles.title}>{meta.title || 'Group Chat'}</div>
          <div className={styles.subtitle}>{groupMembers}</div>
        </div>
      </>
    );
  };

  const renderOneOnOneInfo = () => {
    if (!recipient) return null;
    return (
      <>
        <img src={recipient.photo} alt={recipient.name} className={styles.avatar} />
        <div className={styles.nameBlock}>
          <div className={styles.title}>{recipient.name}</div>
          <div className={styles.subtitle}>Online</div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`${styles.wrapper} ${darkMode ? styles.dark : styles.light}`}
    >
      <div className={styles.statusBar}>
        <span className={styles.time}>
          <Clock size={14} strokeWidth={1.5} className={styles.icon} />
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <Signal size={16} strokeWidth={1.5} className={styles.icon} />
        <Wifi size={16} strokeWidth={1.5} className={`${styles.icon} ${styles.pulse}`} />
        <BatteryCharging size={16} strokeWidth={1.5} className={`${styles.icon} ${styles.blink}`} />
      </div>

      <header className={styles.chatHeader}>
        <div className={styles.headerContent}>
          {isGroup ? renderGroupInfo() : renderOneOnOneInfo()}
        </div>
        <div className={styles.headerActions}>
          <Phone size={18} strokeWidth={1.8} className={styles.icon} />
          <MoreHorizontal size={20} strokeWidth={1.5} className={styles.icon} />
        </div>
      </header>
    </div>
  );
}
