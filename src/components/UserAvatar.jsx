"use client";

export default function UserAvatar({ user }) {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div style={{ position: "relative" }}>
      
      {/* Avatar */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#2c2c2c",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
          transition: "all 0.3s ease"
        }}
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initial
        )}
      </div>

      {/* 🟢 Online Dot */}
      <div
        style={{
          position: "absolute",
          bottom: "2px",
          right: "2px",
          width: "10px",
          height: "10px",
          background: "#22c55e",
          borderRadius: "50%",
          border: "2px solid #111"
        }}
      />
    </div>
  );
}

