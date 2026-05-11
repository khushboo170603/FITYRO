"use client";

import styles from "../styles/Footer.module.css";

export default function Footer() {

  // Smooth scroll for footer links
  const goTo = (id) => {
    const el = document.querySelector(id);
    if (!el) return;

    if (window.lenis) {
      window.lenis.scrollTo(el, {
        offset: -80,
        duration: 1.2,
        easing: (t) => t,
      });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={styles.footer}>

      {/* Top Section */}
      <div className={styles.topRow}>

        {/* Brand Block */}
        <div className={styles.brand}>
          <h2>Fityro</h2>
          <p>Virtual Try-On Experience Powered by AI</p>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h4>Explore</h4>
          <button onClick={() => goTo("#top")}>Home</button>
          <button onClick={() => goTo("#experience")}>Experience</button>
          <button onClick={() => goTo("#smart-fitting")}>Features</button>
          <button onClick={() => window.location.href = "/tryon"}>Try-On</button>
        </div>

        {/* Legal */}
        <div className={styles.column}>
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Cookies Policy</a>
        </div>

        {/* Social Icons */}
        <div className={styles.column}>
          <h4>Connect</h4>
          <div className={styles.socials}>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M7 2h10c2.76 0 5 2.24 5 5v10c0 2.76-2.24 5-5 5H7c-2.76 
                0-5-2.24-5-5V7c0-2.76 2.24-5 5-5zm5 6a4 
                4 0 100 8 4 4 0 000-8zm6.5-2a1.5 
                1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M4.98 3.5A2.5 2.5 0 107.5 6 2.5 
                2.5 0 004.98 3.5zM3 8.98h4v12H3zM10 
                8.98h3.8v1.7h.05c.53-.99 1.83-2.03 
                3.77-2.03 4.03 0 4.78 2.65 4.78 
                6.1v6.23h-4v-5.52c0-1.32-.03-3.03-1.85-3.03-1.85 
                0-2.13 1.45-2.13 2.94v5.61h-4z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" className={styles.icon}>
                <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.8-1.5-.8-1.9-.9C17.9 
                2.5 12 2.5 12 2.5h-.1s-5.9 0-8.8.5c-.4.1-1.2.1-1.9.9C.7 
                4.6.5 6.2.5 6.2S0 8.1 0 9.9v2.2c0 1.8.5 3.7.5 3.7s.2 
                1.6.8 2.3c.7.8 1.6.8 2 1C4.9 19.5 12 19.5 12 19.5s5.9 
                0 8.8-.5c.4-.1 1.2-.1 1.9-.9.6-.7.8-2.3.8-2.3s.5-1.9.5-3.7V9.9c0-1.8-.5-3.7-.5-3.7zM9.7 
                14.8V8.5l6.3 3.2-6.3 3.1z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Mini Line */}
      <div className={styles.bottomLine}>
        © 2026 Fityro. All Rights Reserved.
      </div>

    </footer>
  );
}
