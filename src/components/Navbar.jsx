
"use client";

import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import UserAvatar from "./UserAvatar";
import UserDropdown from "./UserDropdown";
import { ChevronDown } from "lucide-react";
export default function Navbar() {
  const router = useRouter();
  const dropdownRef = useRef();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // ✅ CLICK OUTSIDE TO CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 🔥 AUTH STATE SYNC (MAIN FIX)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      

      
      setIsLoggedIn(!!token);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // run once
    checkAuth();

    // 🔥 run again when returning to tab / after login redirect
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // force refresh
  };

  // ✅ SMOOTH SCROLL
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

  // ✅ DROPDOWN ITEM STYLE
  const menuItemStyle = {
    width: "100%",
    padding: "12px 16px",
    textAlign: "left",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    transition: "background 0.2s"
  };

  

  const initial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <nav className={styles.nav}>
      {/* --- Logo --- */}
      <div className={styles.logo} onClick={() => goTo("#top")}>
        <div className={styles.logoWrapper}>
          <Image
            src="/logo2.png"
            alt="logo"
            fill
            className={styles.logoImg}
            priority
          />
        </div>
      </div>

      {/* --- Nav Links --- */}
      <div className={styles.links}>
        <button onClick={() => goTo("#top")} className={styles.link}>
          Home
        </button>

        <button onClick={() => goTo("#experience")} className={styles.link}>
          Experience
        </button>

        <button onClick={() => goTo("#smart-fitting")} className={styles.link}>
          Features
        </button>

        
        <button
          onClick={() => router.push("/products")}
          className={styles.link}
        >
          Catalogue
        </button>

        {isLoggedIn && (
          <button
            onClick={() => router.push("/history")}
            className={styles.link}
          >
            Try-On History
          </button>
        )}
      </div>

      {/* --- Auth Section --- */}
    <div className={styles.actions}>
      {!isLoggedIn ? (
        <button
          onClick={() => router.push("/login")}
          className={styles.authBtn}
        >
          Login
        </button>
      ) : (
        <div style={{ position: "relative" }} ref={dropdownRef}>
          
          {/* Avatar */}
          <div
            className={styles.avatarWrapper}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className={styles.avatarCircle}>
              {initial}
            </div>

            <ChevronDown
              size={16}
              className={`${styles.arrow} ${
                showDropdown ? styles.rotate : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && <UserDropdown />}
          
        </div>
      )}
    </div>
                
              
    </nav>
  );
}
