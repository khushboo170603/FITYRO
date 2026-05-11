"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Tryon.module.css";
import { useRouter } from "next/navigation";
export default function TryOnPage() {
  const [personImg, setPersonImg] = useState(null);
  const [clothImg, setClothImg] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState("");
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("top");
  const [profile, setProfile] = useState(null);
  const [size, setSize] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const [cameraActive, setCameraActive] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("selectedProduct");

    if (stored) {
      const parsedProduct = JSON.parse(stored);

      setProduct(parsedProduct);
      localStorage.removeItem("selectedProduct");
      // 🔥 STEP 6: clear uploaded cloth if product is loaded
      setClothImg(null);
    }
  }, []);
  // -----------------------------------
  // Upload handlers
  // -----------------------------------
  const handlePersonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonImg(file);
      setCameraActive(false);
    }
  };

  const handleClothUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClothImg(file);
      // 🔥 IMPORTANT: override catalogue selection
      setProduct(null);
    }
  };

  
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      
      const data = await res.json();

      if (res.ok && data.recommended_size) {
        setRecommendedSize(data.recommended_size);
        setSize(data.recommended_size);
      }
    } catch (err) {
      console.log("No profile found yet");
    }
  };

  fetchProfile();
}, []);

const downloadImage = () => {
  if (!resultImg) return;

  const filename = resultImg.split("/").pop();

  const link = document.createElement("a");

  link.href = `http://127.0.0.1:8000/download/${filename}`;

  link.setAttribute("download", filename);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};  
  const runTryOn = async () => {
  console.log("🚀 TRYON CLICKED");
    if (!personImg) {
      alert("Upload your photo first.");
      return;
    }

     // ❗ Ensure at least one cloth source
    if (!product && !clothImg) {
      alert("Please select a product or upload a clothing item.");
      return;
    }

    setLoading(true);
    setResultImg(null);

    try {
      const formData = new FormData();

      formData.append("person", personImg);
      // 🔥 ADD THIS BLOCK HERE
      let mappedCategory = "Upper-body";

      if (category === "top") {
        mappedCategory = "Upper-body";
      }

      if (category === "bottom") {
        mappedCategory = "Lower-body";
      }

      if (category === "outerwear") {
        mappedCategory = "Upper-body";
      }

      if (category === "dress") {
        mappedCategory = "Dresses";
      }

      formData.append("category", mappedCategory);



      console.log("📤 ABOUT TO SEND REQUEST");

      formData.append("size", recommendedSize);

      let url = "http://127.0.0.1:8000/tryon";

      // ✅ CASE 1: product selected
      if (product) {
        formData.append("product_id", product._id);
      }

      // ✅ CASE 2: uploaded cloth overrides
      if (clothImg) {
        formData.append("cloth", clothImg);
      } else if (product) {
        formData.append("cloth_url", product.image_url);
      }
      console.log("🚀 SENDING REQUEST TO /tryon");
      const token = localStorage.getItem("token");

      // 👇 ADD THIS LINE
      console.log("TOKEN:", token);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("✅ REQUEST SENT");
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        alert(text);
        throw new Error("Backend error");
      }

      const data = await res.json();

      const imageUrl =
        `http://127.0.0.1:8000${data.result_image}`;

      setResultImg(imageUrl);

      // ✅ ADD THIS BLOCK HERE
      await fetch("http://127.0.0.1:8000/save-tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product?._id || null,
          size: recommendedSize,
          result_image: imageUrl
        }),
      });

    } catch (error) {
      console.error(error);
      alert("Try-on failed.");
    }

    setLoading(false);
  };

  // -----------------------------------
  // SAMPLE CLOTHS (Optional)
  // -----------------------------------
  
  if (!authorized) return null;
  return (
  <>
    <div className={styles.pageWrap}>

      {/* LEFT SIDE */}
      <div className={styles.leftCard}>
        <h2 className={styles.title}>Try-On Studio</h2>
        <p className={styles.subtitle}>
          Upload your photo and try an outfit from catalogue or your own.
        </p>
        {product && (
          <div className={styles.productCard}>
            <p className={styles.label}>Selected Outfit</p>
            <img src={product.image_url} className={styles.previewImg} />
            <h4>{product.name}</h4>
          </div>
        )}
        {recommendedSize && (
          <div className={styles.sizeBadge}>
            Recommended Size: <strong>{recommendedSize}</strong>
        </div>
      )}

        
        {/* Person upload */}
        <div className={styles.uploadBlock}>
          <label className={styles.label}>Upload Your Photo</label>
          <input type="file" accept="image/*" onChange={handlePersonUpload} />
          {personImg && <img src={URL.createObjectURL(personImg)} className={styles.previewImg} />}
        </div>

        <div className={styles.categoryWrap}>
  <label className={styles.label}>Select Category</label>

  <div className={styles.categoryRow}>
    {["top", "bottom", "outerwear", "dress"].map((item) => (
      <button
        key={item}
        type="button"
        className={`${styles.categoryBtn} ${
          category === item ? styles.activeCategory : ""
        }`}
        onClick={() => setCategory(item)}
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </button>
    ))}
  </div>
</div>
        {/* Cloth upload */}
        <div className={styles.uploadBlock}>
          <label className={styles.label}>Upload Clothing Item</label>
          <input type="file" accept="image/*" onChange={handleClothUpload} />
          {clothImg && <img src={URL.createObjectURL(clothImg)} className={styles.previewImg} />}
        </div>

        {/* Try On button */}
        <button className={styles.tryBtn} onClick={runTryOn} disabled={loading}>
          {loading ? "Processing..." : "Try On"}
        </button>

        
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightCard}>
        <h2 className={styles.titleRight}>Your Try-On Result</h2>

        {loading && (
          <div className={styles.loaderWrap}>
            <div className={styles.loader}></div>
            <p>Generating preview...</p>
          </div>
        )}

        {!loading && resultImg && (
          <div className={styles.resultBox}>
            <img src={resultImg} className={styles.resultImg} />
            <button
              className={styles.downloadBtn}
              onClick={downloadImage}
            >
              Download Result
            </button>
          </div>
        )}

        {!loading && !resultImg && (
          <div className={styles.emptyState}>
            <p>Your virtual try-on preview will appear here.</p>
          </div>
        )}
      </div>
    </div>
  </>
  );
}
