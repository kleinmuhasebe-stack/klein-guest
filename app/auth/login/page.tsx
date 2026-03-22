"use client";
import { useState, useEffect } from "react";

const USERS: Record<string, string> = { "salim": "123456" };

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("kg_auth") === "1") {
      window.location.replace("/dashboard");
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (USERS[username.toLowerCase()] === password) {
      localStorage.setItem("kg_auth", "1");
      localStorage.setItem("kg_user", username);
      window.location.replace("/dashboard");
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
    }
  }

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 380, padding: 40, background: "#111118", border: "1px solid #2a2a3a", borderRadius: 16 }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f8", letterSpacing: "-0.5px" }}>
            klein <span style={{ color: "#a29bfe" }}>guest</span>
          </h1>
          <p style={{ fontSize: 13, color: "#5a5a72", marginTop: 6 }}>Hesabınıza giriş yapın</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>KULLANICI ADI</label>
            <input style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f0f0f8", outline: "none", boxSizing: "border-box" }}
              type="text" placeholder="kullanıcı adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>ŞİFRE</label>
            <input style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f0f0f8", outline: "none", boxSizing: "border-box" }}
              type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 16, textAlign: "center" }}>{error}</div>}
          <button type="submit" style={{ width: "100%", background: "#6c5ce7", color: "#fff", border: "none", borderRadius: 8, padding: 11, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
