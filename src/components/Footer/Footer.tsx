import styles from './Footer.module.css';
import githubIcon from '@/assets/github.png';
import whatsappIcon from '@/assets/whatsapp.png'; 

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>Built with ❤️ by anyiamvictor</p>

      <div className={styles.iconLinks}>
        <a
          href="https://github.com/anyiamvictor"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="GitHub" className={styles.icon} />
        </a>

        <a
          href="https://wa.me/2347039153124" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={whatsappIcon} alt="WhatsApp" className={styles.icon} />
        </a>
      </div>
    </footer>
  );
}
