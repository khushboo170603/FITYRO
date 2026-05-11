"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Self.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("profile");
  const [measurements, setMeasurements] = useState(null);
  const [photos, setPhotos] = useState([]);

  // ✅ ADD THIS HERE
  const normalizePhoto = (p) => ({
    id: p.id || p._id,
    src:
      p.src ||
      (p.image_url
        ? `http://127.0.0.1:8000${p.image_url}`
        : null),
    name: p.name || "Image",
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editNames, setEditNames] = useState({});

  // 🔹 Load user
  useEffect(() => {

  const fetchProfile = async () => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/get-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("PROFILE:", data);

      setUser(data);

      // optional: keep localStorage synced
      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();

}, []);

  useEffect(() => {
  const fetchMeasurements = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.profile?.measurements) {
        setMeasurements(data.profile.measurements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchMeasurements();
}, []);

  useEffect(() => {
  const fetchPhotos = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/get-photos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const rawPhotos = Array.isArray(data) ? data : data.photos || [];

      setPhotos(rawPhotos.map(normalizePhoto));
    } catch (err) {
      console.error(err);
    }
  };

  fetchPhotos();
}, []);

  // 🔹 Upload
  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const token = localStorage.getItem("token");

    for (let file of files) {
      // ✅ ADD THIS HERE
      if (photos.some(p => p.name === file.name)) {
        console.log("Duplicate skipped:", file.name);
        continue;
  }
      const reader = new FileReader();

      reader.onloadend = async () => {
        const newPhoto = {
          id: crypto.randomUUID(),
          src: reader.result,
          name: file.name,
        };

        try {
          await fetch("http://127.0.0.1:8000/save-photo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newPhoto),
          });

          // ✅ ADD ONLY ONCE
          setPhotos((prev) => [...prev, newPhoto]);

        } catch (err) {
          console.error(err);
        }
      };

        

      reader.readAsDataURL(file);
    }
  };

  // 🔹 Rename
  const updatePhotoName = async (id, name) => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://127.0.0.1:8000/update-photo-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name }),
      });

      // ✅ update UI
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, name } : p
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete
  const deletePhoto = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://127.0.0.1:8000/delete-photo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ update UI
      setPhotos((prev) => prev.filter((p) => p.id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordUpdate = async () => {
  setError("");
  setMessage("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://127.0.0.1:8000/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "Something went wrong");
      return;
    }

    setMessage("Password updated successfully ✅");

    // clear fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (err) {
    setError("Server error");
  }
};

  if (!user) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>

        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <p className={styles.heading}>PROFILE</p>

          <button
            className={`${styles.navItem} ${active === "profile" ? styles.active : ""}`}
            onClick={() => setActive("profile")}
          >
            👤 Profile Info
          </button>

          <button
            className={`${styles.navItem} ${active === "measurements" ? styles.active : ""}`}
            onClick={() => setActive("measurements")}
          >
            📏 Saved Measurements
          </button>

          <button
            className={`${styles.navItem} ${active === "photos" ? styles.active : ""}`}
            onClick={() => setActive("photos")}
          >
            🖼️ Saved Photos
          </button>

          <button
            className={`${styles.navItem} ${active === "security" ? styles.active : ""}`}
            onClick={() => setActive("security")}
          >
            🔐 Account Security
          </button>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          <div key={active} className={styles.contentInner}>

            {/* PROFILE */}
            {active === "profile" && (
              <>
                <div className={styles.header}>
                  <div className={styles.avatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className={styles.row}>
                  <label>Name</label>
                  <input value={user.name} readOnly />
                </div>

                <div className={styles.row}>
                  <label>Email</label>
                  <input value={user.email} readOnly />
                </div>
              </>
            )}

            {/* MEASUREMENTS */}
            {active === "measurements" && (
              <>
                <h2>Saved Measurements</h2>

                {measurements ? (
                  <div className={styles.measurementCard}>
                    <p><strong>Height:</strong> {measurements.height} cm</p>
                    <p><strong>Weight:</strong> {measurements.weight} kg</p>
                    <p><strong>Chest:</strong> {measurements.chest} cm</p>
                    <p><strong>Waist:</strong> {measurements.waist} cm</p>
                    <p><strong>Hip:</strong> {measurements.hip} cm</p>
                  </div>
                ) : (
                  <p>No measurements saved</p>
                )}
              </>
            )}

            
            {/* PHOTOS */}
            {active === "photos" && (
              <>
                {/* ✅ UPDATED HEADING */}
                <h2>Saved Photos </h2>

                {/* ✅ MULTIPLE UPLOAD */}
                <input type="file" multiple onChange={handleUpload} />

                {/* ✅ EMPTY STATE */}
                {photos.length === 0 && (
                  <p>No photos uploaded yet</p>
                )}

                <div className={styles.photoGrid}>
                  {Array.isArray(photos) && photos.map(p => (
                    <div key={p.id} className={styles.photoCard}>
                      <div className={styles.imageWrapper}>
                        <img
                          src={
                            p.src || 
                            p.url || 
                            p.image || 
                            (p.image_url ? `http://127.0.0.1:8000${p.image_url}` : "")
                          }
                          className={styles.photoImg}
                          onClick={() =>
                            setPreviewImg(
                              p.src || 
                              p.url || 
                              p.image || 
                              `http://127.0.0.1:8000${p.image_url}`
                            )
                          }
                        />
                      </div>

                      <input
                        className={styles.photoInput}
                        value={editNames[p.id] ?? p.name}
                        onChange={(e) =>
                          setEditNames((prev) => ({
                            ...prev,
                            [p.id]: e.target.value,
                          }))
                        }
                      />

                      {/* ✅ SAVE BUTTON BELOW INPUT */}
                      <button
                        className={styles.saveBtn}
                        onClick={() => {
                          const newName = editNames[p.id];
                          if (!newName) return;

                          updatePhotoName(p.id, newName);

                          setEditNames((prev) => {
                            const copy = { ...prev };
                            delete copy[p.id];
                            return copy;
                          });
                        }}
                      >
                        💾 Save
                      </button>

                      {/* ✅ DELETE BUTTON BELOW SAVE */}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deletePhoto(p.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SECURITY */}
            {active === "security" && (
              <>
                <h2>Account Security</h2>

                {/* CURRENT PASSWORD */}
                <div className={styles.row}>
                  <label>Current Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="•••••••"
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div className={styles.row}>
                  <label>New Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="•••••••"
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className={styles.row}>
                  <label>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="•••••••"
                    />
                    <span
                      className={styles.eyeIcon}
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                

                {/* ERROR MESSAGE */}
                {error && <p className={styles.error}>{error}</p>}

                {/* SUCCESS MESSAGE */}
                {message && <p className={styles.success}>{message}</p>}

                {/* UPDATE BUTTON */}
                <button onClick={handlePasswordUpdate} className={styles.saveBtn}>
                  Update Password
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {previewImg && (
        <div
          className={styles.modalOverlay}
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} className={styles.modalImg} />
        </div>
      )}
    </div>
  );
}