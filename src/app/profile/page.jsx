"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import styles from "../../styles/Profile.module.css";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hip: "",
  });

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [view, setView] = useState("form");
  const [savedData, setSavedData] = useState(null);

  const router = useRouter();

  // 🔥 Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // 🔥 Fill form with saved data
        if (data?.profile?.measurements) {
          const m = data.profile.measurements;
          setSavedData(m); // ✅ store for display
          setForm({
            height: m.height || "",
            weight: m.weight || "",
            chest: m.chest || "",
            waist: m.waist || "",
            hip: m.hip || "",
          });
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit profile (JWT-based)
  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const payload = {
      height: Number(form.height),
      weight: Number(form.weight),
      chest: Number(form.chest),
      waist: Number(form.waist),
      hip: Number(form.hip),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);
      // 🔥 Guard check
      if (!data.recommended_size) {
        alert("Size prediction failed");
        return;
      }

      setResult(data.recommended_size);
      setConfidence(data.confidence);
      setShowPopup(true);

      setSavedData({
        height: form.height,
        weight: form.weight,
        chest: form.chest,
        waist: form.waist,
        hip: form.hip,
      });

      setView("saved");
    } catch (err) {
      console.error(err);
    }
  };
  function SavedMeasurements({ data }) {
    if (!data) return <p>No saved measurements</p>;

    return (
      <div>
        <h3>Saved Measurements</h3>
        <p>Height: {data.height}</p>
        <p>Weight: {data.weight}</p>
        <p>Chest: {data.chest}</p>
        <p>Waist: {data.waist}</p>
        <p>Hip: {data.hip}</p>
      </div>
    );
  }
  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>My Measurements</h1>

          {/* ✅ VIEW TOGGLE BUTTONS */}
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleBtn} ${
                view === "form" ? styles.active : ""
              }`}
              onClick={() => setView("form")}
            >
              Edit
            </button>

            <button
              className={`${styles.toggleBtn} ${
                view === "saved" ? styles.active : ""
              }`}
              onClick={() => setView("saved")}
            >
              Saved
            </button>
          </div>

          {/* ✅ SHOW SAVED DATA */}
          {view === "saved" && <SavedMeasurements data={savedData} />}

          {/* ✅ SHOW FORM */}
          {view !== "saved" && (
            <form onSubmit={submit} className={styles.form}>
              <label>Height (cm)</label>
              <input
                name="height"
                value={form.height}
                placeholder="e.g. 165"
                onChange={handleChange}
              />

              <label>Weight (kg)</label>
              <input
                name="weight"
                value={form.weight}
                placeholder="e.g. 60"
                onChange={handleChange}
              />

              <label>Chest (cm)</label>
              <input
                name="chest"
                value={form.chest}
                placeholder="e.g. 90"
                onChange={handleChange}
              />

              <label>Waist (cm)</label>
              <input
                name="waist"
                value={form.waist}
                placeholder="e.g. 75"
                onChange={handleChange}
              />

              <label>Hip (cm)</label>
              <input
                name="hip"
                value={form.hip}
                placeholder="e.g. 95"
                onChange={handleChange}
              />

              <button type="submit">Save Profile</button>
            </form>
          )}
          {showPopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupCard}>
                <h2>👕 Your Perfect Fit</h2>
                <p>
                  Recommended Size: <strong>{result}</strong>
                </p>
                <p>Confidence: {confidence}%</p>

                <button
                  onClick={() => {
                    setShowPopup(false);
                    router.push("/home");
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
