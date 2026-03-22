"use client";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    if (localStorage.getItem("kg_auth") === "1") {
      window.location.replace("/dashboard");
    } else {
      window.location.replace("/auth/login");
    }
  }, []);
  return null;
}
