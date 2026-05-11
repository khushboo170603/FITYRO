"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/History.module.css";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletedItem, setDeletedItem] = useState(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/tryon-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setHistory(data);
    }
  };

  const handleDelete = (item) => {
    setHistory((prev) => {
      return prev.filter((i) => i._id !== item._id);
    });

    setDeletedItem(item);

    const t = setTimeout(() => {
      deleteFromBackend(item._id);
      setDeletedItem(null);
    }, 5000);

    setTimer(t);
  };

  const deleteFromBackend = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/delete-tryon/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleUndo = () => {
    if (!deletedItem) return;

    // bring item back
    setHistory((prev) => [deletedItem, ...prev]);

    // cancel deletion
    clearTimeout(timer);

    setDeletedItem(null);
    setTimer(null);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Try-On History</h1>

      {history.length === 0 ? (
        <p>No try-ons yet. Go try some outfits 👗</p>
      ) : (
        <div className={styles.grid}>
          {history.map((item) => (
            <div key={item._id} className={styles.card}>
              
              <img
                src={`http://localhost:8000${item.result_image}`}
                onClick={() =>
                  setSelectedImage(
                    `http://localhost:8000${item.result_image}`
                  )
                }
              />

              <h3>
  {item.product_name ||
   item.product?.name ||
   "Outfit"}
</h3>

              <p className={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </p>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className={styles.modal}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} />
        </div>
      )}
      {deletedItem && (
        <div className={styles.undoToast}>
          Item deleted
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </div>
  );
}