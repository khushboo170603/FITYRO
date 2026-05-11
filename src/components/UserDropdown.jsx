"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../styles/Navbar.module.css";

export default function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    // fallback fix
    const fixedUser = {
      ...storedUser,
      name:
        storedUser.name && storedUser.name !== "User"
          ? storedUser.name
          : storedUser.email?.split("@")[0] || "User",
    };

    setUser(fixedUser);
  }
}, []);

  if (!user) return null;

  const initial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className={styles.dropdown}>

      {/* USER INFO */}
      <div className={styles.userInfo}>
        {user.profilePic ? (
          <img src={user.profilePic} className={styles.avatarImg} />
        ) : (
          <div className={styles.avatar}>{initial}</div>
        )}

        <div>
          <p className={styles.name}>{user.name}</p>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>

      <div className={styles.divider} />
      
      <button
        onClick={() => router.push("/self")}
        className={styles.item}
      >
        👤 Profile
      </button>

      {/* ✅ NEW: Measurements */}
      <button
        onClick={() => router.push("/profile")}
        className={styles.item}
      >
        📏 Measurements
      </button>

      {/* LOGOUT */}
      <button onClick={handleLogout} className={styles.logout}>
        Logout
      </button>
    </div>
  );
}