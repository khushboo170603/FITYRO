"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const submit = async (e) => {
  e.preventDefault();
  setError("");

  if (!fullName || !email || !password || !confirm) {
    setError("Please fill all fields.");
    return;
  }

  if (password !== confirm) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    // Registration successful → redirect to login
    router.push("/login");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.pageWrap}>
      
      {/* Background Blobs */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>

      {/* Centered Card */}
      <div className={styles.card}>

        <h2 className={styles.title}>Welcome to Fityro</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={submit} className={styles.form}>

          
            <input type="text" placeholder="John Doe"
              value={fullName} onChange={(e)=>setFullName(e.target.value)}
              className={styles.input} />
          

          
            <input type="email" placeholder="you@email.com"
              value={email} onChange={(e)=>setEmail(e.target.value)}
              className={styles.input} />
          

         <div className={styles.inputWrap}>
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={styles.input}
    placeholder="Enter password"
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className={styles.eyeBtn}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>      
          
      <div className={styles.inputWrap}>
  <input
    type={showConfirm ? "text" : "password"}
    value={confirm}
    onChange={(e) => setConfirm(e.target.value)}
    className={styles.input}
    placeholder="Enter password"
    required
  />

  <button
    type="button"
    onClick={() => setShowConfirm(!showConfirm)}
    className={styles.eyeBtn}
  >
    {showConfirm ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
          

          <button className={styles.primaryBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className={styles.bottomText}>
          Already have an account?
          <button className={styles.linkBtn} onClick={() => router.push("/login")}>
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
