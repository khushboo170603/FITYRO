"use client";

import styles from "../styles/Hero.module.css";
import { useRouter } from "next/navigation";

const videos = [
  "/h1.mp4",
  "/h3.mp4",
  "/h5.mp4",
  "/h8.mp4",
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className={styles.hero}>
      
      {/* LEFT */}
      <div className={styles.left}>
        <h1>Try. Fit. Experience.</h1>

        <p>Your Virtual Trial Room, Reinvented.</p>

        <button
          onClick={() => router.push("/tryon")}
          className={styles.tryOnBtn}
        >
          Try-On
        </button>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.stageGlow}></div>

        <div className={styles.carousel}>
          {videos.map((video, index) => (
            <div
              key={index}
              className={`${styles.videoCard} ${styles[`card${index + 1}`]}`}
            >
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                className={styles.video}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}