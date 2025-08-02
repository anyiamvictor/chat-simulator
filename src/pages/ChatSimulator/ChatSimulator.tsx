import { useRef } from 'react';
import ControlPanel from '@/components/ControlPanel/ControlPanel';
import ChatArea from '@/components/ChatArea/ChatArea';
import styles from './ChatSimulator.module.css';
import BackButton from '@/components/BackButton/BackButton';

export default function ChatSimulator() {
  const chatRef = useRef < HTMLDivElement|null>(null);

  return (
    <div className={styles.wrapperOne}>
    <BackButton/> 
    <div className={styles.wrapper}>
      <div className={styles.leftPanel}>
        <ControlPanel chatRef={chatRef} />
      </div>

      <div className={styles.rightPanel}>
        <ChatArea chatRef={chatRef} />
      </div>
      </div>
    </div>
      
  );
}
