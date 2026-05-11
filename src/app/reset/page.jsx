"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.card}>
        <h2>Set new password</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={submit}>
          <input
            className={styles.input}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className={styles.primaryBtn}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
