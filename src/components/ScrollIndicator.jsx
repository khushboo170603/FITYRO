"use client";

import { useEffect, useRef } from "react";
import styles from "../styles/ScrollIndicator.module.css";
import gsap from "gsap";

export default function ScrollIndicator() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    gsap.to(el, { y: 12, repeat: -1, yoyo: true, duration: 1.2, ease: "sine.inOut" });
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.mouse}>
        <div className={styles.wheel} ref={ref} />
      </div>
    </div>
  );
}
