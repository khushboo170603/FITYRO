"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "../../styles/Intro.module.css";

export default function IntroPage() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showEnter, setShowEnter] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // LETTER BUILDING
    const text = "Fityro";
    const titleEl = titleRef.current;

    titleEl.innerHTML = "";
    text.split("").forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = styles.char;
      titleEl.appendChild(span);
    });

    // ANIMATION
    const tl = gsap.timeline();

    tl.fromTo(
      `.${styles.char}`,
      { opacity: 0, y: 40, rotateX: -30 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    );

    tl.call(() => setShowEnter(true));
  }, []);

  // AUTO COLOR ADJUSTMENT (same as before)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const checkColor = () => {
      if (!video || video.readyState < 2) return;

      const w = (canvas.width = 64);
      const h = (canvas.height = 64);

      ctx.drawImage(video, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h).data;

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < frame.length; i += 4) {
        r += frame[i];
        g += frame[i + 1];
        b += frame[i + 2];
      }

      const total = frame.length / 4;
      r /= total;
      g /= total;
      b /= total;

      const brightness = r * 0.299 + g * 0.587 + b * 0.114;

      let color = "#ffffff";
      let shadow = "0 0 25px rgba(0,0,0,0.7)";

      if (brightness > 150) {
        color = "#000000";
        shadow = "0 0 20px rgba(255,255,255,0.6)";
      } else if (brightness < 90) {
        color = "#ffffff";
        shadow = "0 0 30px rgba(0,0,0,0.8)";
      } else {
        color = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
      }

      gsap.to(titleRef.current, {
        color,
        textShadow: shadow,
        duration: 0.4,
      });

      gsap.to(subtitleRef.current, {
        color,
        duration: 0.4,
      });
    };

    const interval = setInterval(checkColor, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.introcontainer}>
      {/* Background video */}
      <video
        ref={videoRef}
        className={styles.video}
        src="/intro.mp4"   // REPLACE with your video
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.overlay}></div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Center content */}
      <div className={styles.center}>
        <h1 ref={titleRef} className={styles.title}></h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          Future In Trying Your Regular Outfits
        </p>

        {/* ONLY ONE BUTTON NOW */}
        {showEnter && (
          <div className={styles.buttons}>
            <button
              className={styles.enterBtn}
              onClick={() => router.push("/home")}
            >
              Enter the Verse
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
