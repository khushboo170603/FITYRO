"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.replace("/login"); // use replace instead of push
    }
  }, []);

  // ⛔ IMPORTANT: don't render anything until check is done
  if (isAuthenticated === null) return null;

  return children;
}
