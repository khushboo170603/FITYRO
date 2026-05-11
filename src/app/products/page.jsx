"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleTryOn = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    router.push("/tryon");
  };
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get-products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Explore Styles</h1>
      <input
        type="text"
        placeholder="Search for outfits..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      <div className={styles.filterBar}>
        {["all", "top", "bottom", "dress", "outerwear"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={
              selectedCategory === cat ? styles.activeFilter : styles.filterBtn
            }
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>
      <p>{products.length} items found</p>
      <div className={styles.grid}>
        {products
          .filter(p => {
            const matchesCategory =
              selectedCategory === "all" || p.category === selectedCategory;

            const matchesSearch =
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
          })
          .map(product => (
          <div key={product._id} className={styles.card}>
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.category}</p>

            <div className={styles.sizes}>
              {product.sizes?.map(size => (
                <span key={size}>{size}</span>
              ))}
            </div>

            <button
              onClick={() => handleTryOn(product)}
            >
              Try On
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
