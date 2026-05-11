"use client";

import styles from "./users.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/admin/users"
      );

      setUsers(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this user permanently?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `http://127.0.0.1:8000/admin/users/${id}`
    );

    setUsers(
      users.filter((u) => u.id !== id)
    );

    alert("User deleted successfully");

  } catch (err) {
    console.error(err);
    alert("Failed to delete user");
  }
};

  const viewProfile = async (id) => {

  try {

    const res = await axios.get(
      `http://127.0.0.1:8000/admin/users/${id}`
    );

    setSelectedUser(res.data);
    setShowModal(true);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className={styles.container}>

      <div className={styles.topBar}>
        <h1>Users Management</h1>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.table}>

        <div className={styles.tableHeader}>
          <p>User</p>
          <p>Status</p>
          <p>Try-ons</p>
          <p>Actions</p>
        </div>

        {filteredUsers.map((user, index) => (
          <div className={styles.row} key={index}>

  <p>{user.name}</p>

  <span
    className={
      user.status === "Active"
        ? styles.active
        : styles.inactive
    }
  >
    {user.status}
  </span>

  <p>{user.tryons}</p>

  <div className={styles.actionButtons}>

    <button
      className={styles.viewBtn}
      onClick={() => viewProfile(user.id)}
    >
      View
    </button>

    <button
      className={styles.deleteBtn}
      onClick={() => deleteUser(user.id)}
    >
      Delete
    </button>

  </div>

</div>
        ))}

      </div>
      {showModal && selectedUser && (
        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h2>User Profile</h2>

            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>

            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>

            <p>
              <strong>Joined:</strong>{" "}
              {new Date(
                selectedUser.created_at
              ).toLocaleDateString()}
            </p>

            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}