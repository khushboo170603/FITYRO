"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../styles/ScrollVideo.module.css";
import { useState } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoSection({ id, title, description, videoSrc, reverse }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  
  useEffect(() => {
  const section = sectionRef.current;

  // 🔥 Text stagger (premium feel)
  gsap.fromTo(
    textRef.current.children,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      }
    }
  );

  // 🔥 Video fade + scale
  gsap.fromTo(
    videoRef.current,
    { opacity: 0, scale: 1.15, rotate: -2 },
    {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
      }
    }
  );

  // 🔥 PARALLAX (this is the magic ✨)
  gsap.to(videoRef.current, {
    y: -80,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    }
  });

}, []);

  return (
    <section id={id} ref={sectionRef} className={styles.section}>
      <div className={`${styles.container} ${reverse ? styles.reverse : ""}`}>

    <div className={styles.left} ref={textRef}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>

    <div className={styles.right}>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>

  </div>

</section>
  );
}
