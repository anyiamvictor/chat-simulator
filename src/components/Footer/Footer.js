import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Footer.module.css';
import githubIcon from '@/assets/github.png';
import whatsappIcon from '@/assets/whatsapp.png';
export default function Footer() {
    return (_jsxs("footer", { className: styles.footer, children: [_jsx("p", { className: styles.text, children: "Built with \u2764\uFE0F by anyiamvictor" }), _jsxs("div", { className: styles.iconLinks, children: [_jsx("a", { href: "https://github.com/anyiamvictor", target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: githubIcon, alt: "GitHub", className: styles.icon }) }), _jsx("a", { href: "https://wa.me/2347039153124", target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { src: whatsappIcon, alt: "WhatsApp", className: styles.icon }) })] })] }));
}
