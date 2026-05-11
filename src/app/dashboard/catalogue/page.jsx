"use client";

import { useState } from "react";
import styles from "./catalogue.module.css";
import axios from "axios";
import { useEffect } from "react";

export default function CataloguePage() {
const [clothes, setClothes] = useState([]);
const [search, setSearch] = useState("");
const [showModal, setShowModal] = useState(false);
const [sizes, setSizes] = useState([]);
const [name, setName] = useState("");
const [itemCategory, setItemCategory] = useState("");
const [image, setImage] = useState(null);
const [editItem, setEditItem] = useState(null);
const [preview, setPreview] = useState(null);
const [category, setCategory] = useState("All");

  useEffect(() => {
  fetchClothes();
}, []);

const fetchClothes = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/catalogue"
    );

    setClothes(res.data);

  } catch (err) {
    console.error(err);
  }
};

const deleteItem = async (id) => {

  try {

    await axios.delete(
      `http://127.0.0.1:8000/catalogue/${id}`
    );

    setClothes(
      clothes.filter((item) => item.id !== id)
    );

  } catch (err) {
    console.error(err);
  }
};

const addItem = async () => {

  try {

    if (!image) {
      alert("Select image first");
      return;
    }

    const formData = new FormData();
    const uniqueSizes = [...new Set(sizes)];
    formData.append("name", name);
    formData.append("category", itemCategory);
    formData.append(
  "sizes",
  JSON.stringify(uniqueSizes)
);
    formData.append("image", image);

    console.log(name);
    console.log(itemCategory);
    console.log(image);

    const res = await axios.post(
      "http://127.0.0.1:8000/catalogue",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("SAVED:", res.data);

    setClothes([...clothes, res.data]);

    setShowModal(false);
    setName("");
    setItemCategory("");
    setSizes([]);
    setImage(null);
    setPreview(null);
    setEditItem(null);

  } catch (err) {
    console.error(err);
  }
};

const filtered = clothes.filter((item) => {

  const matchesCategory =
  category === "All" ||

  item.category?.toLowerCase() ===
  category.toLowerCase();

  const matchesSearch =
    item.name
      .toLowerCase()
      .includes(search.toLowerCase());

  return matchesCategory && matchesSearch;
});

const updateItem = async () => {

  try {

    const formData = new FormData();
    const uniqueSizes = [...new Set(sizes)];
    formData.append("name", name);
    formData.append("category", itemCategory);
    formData.append(
  "sizes",
  JSON.stringify(uniqueSizes)
);

    if (image) {
      formData.append("image", image);
    }

    const res = await axios.put(
      `http://127.0.0.1:8000/catalogue/${editItem.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setClothes(
      clothes.map((item) =>
        item.id === editItem.id ? res.data : item
      )
    );

    setShowModal(false);
    setName("");
    setItemCategory("");
    setSizes([]);
    setImage(null);
    setPreview(null);
    setEditItem(null);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.topBar}>

        <input
  type="text"
  placeholder="Search clothes..."
  className={styles.search}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

        <select
          className={styles.select}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Top</option>
          <option>Outerwear</option>
          <option>Bottom</option>
          <option>Dress</option>
        </select>

        <button
  className={styles.addBtn}

  onClick={() => {

    // ✅ clear old edit state
    setEditItem(null);

    // ✅ clear form
    setName("");
    setItemCategory("Top");
    setSizes([]);
    setImage(null);
    setPreview(null);

    // ✅ open modal
    setShowModal(true);

  }}
>
  + Add Item
</button>

      </div>

      {/* Cards */}
      <div className={styles.grid}>

        {filtered.map((item) => (
          <div className={styles.card} key={item.id}>

            <img
              src={item.image_url}
              alt={item.name}
              className={styles.image}
            />

            <h3>{item.name}</h3>

            <p>{item.category}</p>

            <button
  className={styles.editBtn}
  onClick={() => {

    setEditItem(item);

setName(item.name);
setItemCategory(item.category);

setSizes(
  Array.isArray(item.sizes)
    ? item.sizes
    : []
);

setPreview(item.image_url);

setShowModal(true);
  }}
>
  Edit
</button>

            <button
  className={styles.deleteBtn}
  onClick={() => deleteItem(item.id)}
>
  Delete
</button>

          </div>
        ))}
        {showModal && (

  <div className={styles.modalOverlay}>

    <div className={styles.modal}>

      <h2>
  {editItem ? "Edit Item" : "Add New Item"}
</h2>

      <input
        type="text"
        placeholder="Cloth name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        value={itemCategory}
        onChange={(e) => setItemCategory(e.target.value)}
      >
        <option>Top</option>
        <option>Dress</option>
        <option>Bottom</option>
        <option>Outerwear</option>
      </select>

      <div className={styles.sizeBox}>

        <p>Select Sizes</p>

        {["S", "M", "L", "XL"].map((size) => (

          <label key={size} className={styles.sizeOption}>

            <input
  type="checkbox"
  value={size}

  checked={sizes.includes(size)}

  onChange={(e) => {

    if (e.target.checked) {

      setSizes([
  ...new Set([...sizes, size])
]);

    } else {

      setSizes(
        sizes.filter((s) => s !== size)
      );
    }

  }}
/>

            {size}

          </label>

        ))}
      </div>


  

      <input
        type="file"
        onChange={(e) => {

  const file = e.target.files[0];

  setImage(file);

  if (file) {
    setPreview(URL.createObjectURL(file));
  }
}}
      />

      {preview && (
  <div className={styles.previewBox}>
    <img
      src={preview}
      className={styles.preview}
    />
  </div>
)}

      <div className={styles.modalActions}>

        <button
          className={styles.cancelBtn}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className={styles.saveBtn}
          onClick={() => {

  if (editItem) {
    updateItem();
  } else {
    addItem();
  }
}}
        >
          {editItem ? "Update Item" : "Save Item"}
        </button>

      </div>

    </div>

  </div>
)}
      </div>
    </div>
  );
}