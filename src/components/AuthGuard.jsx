"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user?.email) {
      router.replace("/login");
    } else {
      setAllowed(true);
    }
  }, []);

  if (!allowed) return null;

  return children;
}