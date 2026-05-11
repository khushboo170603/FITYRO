"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/* Social Button */
function SocialButton({ children, onClick, className }) {
  return (
    <button className={`${styles.socialBtn} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "1006305779244-ipt113l6o4ure7mvjmv2qr1righligdj.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.access_token);

      const baseName = email.split("@")[0];
      const formattedName =
        baseName.charAt(0).toUpperCase() + baseName.slice(1);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          profilePic: null,
        })
      );

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      if (payload.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: response.credential,
        }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.access_token);

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      localStorage.setItem(
        "user",
        JSON.stringify({
          name:
            payload.name ||
            payload.email?.split("@")[0] ||
            "User",
          email: payload.email || "",
          profilePic: payload.picture || null,
        })
      );

      if (payload.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }

    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  const triggerGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.oauth2
        .initTokenClient({
          client_id: "1006305779244-ipt113l6o4ure7mvjmv2qr1righligdj.apps.googleusercontent.com",
          scope: "email profile",
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              try {
                const res = await fetch("http://127.0.0.1:8000/google-login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    access_token: tokenResponse.access_token,
                  }),
                });

                const data = await res.json();

                localStorage.setItem("token", data.access_token);

                const payload = JSON.parse(atob(data.access_token.split(".")[1]));

                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    name:
                      payload.name ||
                      payload.email?.split("@")[0] ||
                      "User",
                    email: payload.email || "",
                    profilePic: payload.picture || null,
                  })
                );

                if (payload.role === "admin") {
                  router.push("/dashboard");
                } else {
                  router.push("/home");
                }

              } catch (err) {
                console.error(err);
                setError("Google login failed");
              }
            }
          },
        })
        .requestAccessToken();
    } else {
      setError("Google SDK not loaded");
    }
  };

  return (
    <div className={styles.pageWrap}>

      <aside className={styles.leftPanel}>
        <img src="/login.png" alt="decorative" className={styles.sideImage} />
      </aside>

      <main className={styles.rightPanel}>
        
        {/* 🔥 LOGO */}
        <div className={styles.logoWrapper}>
          <img src="/logo1.png" alt="Fityro Logo" className={styles.logo} />
        </div>

        <div className={styles.card}>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={submit} className={styles.form}>
            <div className={styles.roleToggle}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "user" ? styles.active : ""}`}
                onClick={() => setRole("user")}
              >
                User
              </button>

              <button
                type="button"
                className={`${styles.roleBtn} ${role === "admin" ? styles.active : ""}`}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>

              <div
                className={styles.slider}
                style={{ left: role === "admin" ? "50%" : "4px" }}
              />
            </div>

         
            <div className={styles.inputWrap}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email or username"
                required
              />
            </div>

            <div className={styles.inputWrap} style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="•••••••"
                required
                style={{ paddingRight: "40px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "22px",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className={styles.rowSmall}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> Remember me
              </label>

              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => router.push("/forgot")}
              >
                Forgot?
              </button>
            </div>

            
            <button className={styles.primaryBtn} type="submit" disabled={loading}>
              {loading ? "Signing in..." : `Sign in `}
            </button>
          </form>

          <div className={styles.orRow}>
            <span className={styles.line} />
            <span className={styles.orText}>or</span>
            <span className={styles.line} />
          </div>

          <div className={styles.socialRow}>
            <SocialButton onClick={triggerGoogleLogin} className={styles.googleBtn}>
              
              {/* Google Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M21.6 12.232c0-.68-.06-1.336-.17-1.964H12v3.724h5.16c-.224 1.2-.9 2.218-1.92 2.904v2.412h3.096c1.812-1.666 2.88-4.14 2.88-7.076z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.43 0 4.472-.804 5.96-2.186l-3.096-2.412c-.86.576-1.98.918-2.864.918-2.196 0-4.06-1.48-4.726-3.464H3.96v2.176C5.44 19.796 8.56 22 12 22z"
                  fill="#34A853"
                />
                <path
                  d="M7.274 13.256a5.18 5.18 0 010-3.512V7.568H3.96a9.6 9.6 0 000 8.864l3.314-3.176z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 6.48c1.32 0 2.5.45 3.432 1.33l2.568-2.568C16.476 3.732 14.436 3 12 3 8.56 3 5.44 5.204 3.96 7.568L7.274 10.74C7.94 8.756 9.804 6.48 12 6.48z"
                  fill="#EA4335"
                />
              </svg>

              <span>Continue with Google</span>
            </SocialButton>
          </div>
                   
          <div className={styles.register}>
            <span>Don’t have an account?</span>
            <button
              className={styles.linkBtn}
              onClick={() => router.push("/register")}
            >
              Create account
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}