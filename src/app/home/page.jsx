"use client";

import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ScrollVideoSection from "../../components/ScrollVideoSection";
import Footer from "../../components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../../styles/Home.module.css";
import Lenis from "@studio-freight/lenis";
import ProtectedRoute from "../../components/ProtectedRoute";
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {

  useEffect(() => {
    // Refresh GSAP triggers
    const lenis = new Lenis({
    duration: 1.1,
    smooth: true,
  });

  // ⭐ Make Lenis globally available
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value) : window.scrollY;
    },
  });

  
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.contentGrow}>

        {/* For navbar "Home" */}
        <div id="top"></div>

        {/* HERO */}
        <Hero />

        {/* VIDEO SECTIONS — THE WORKING VERSION */}
        <ScrollVideoSection
          id="vision"
          title="The Vision"
          description="Reimagining the way you try clothes online - blending precision, design, and intuitive motion to create a new era of virtual fashion."
          videoSrc="/h1.mp4"
        />

        <ScrollVideoSection
          id="experience"
          title="The Experience"
          description="See yourself in every style with lifelike previews that move, flow, and fit naturally. Designed for real-time exploration, effortless browsing, and immersive virtual trials."
          videoSrc="/h8.mp4"
          reverse
        />

        <ScrollVideoSection
          id="smart-fitting"
          title="Smart Fitting"
          description="Powered by AI, Fityro understands your body profile and recommends the perfect size - ensuring accuracy, comfort, and confidence in every fit."
          videoSrc="/h2.mp4"
        />

        
        </div>

        <Footer />

      </main>
    </>
  );
}
