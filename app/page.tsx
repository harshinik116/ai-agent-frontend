"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const CORRECT_PASSWORD = "family2026";

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password ❌");
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    const res = await fetch(
      "https://ai-agent-backend-q97u.onrender.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          history: newChat,
        }),
      }
    );

    const data = await res.json();

    setChat([
      ...newChat,
      { role: "assistant", content: data.reply },
    ]);
  };

  // ✅ IMAGE UPLOAD HANDLER (INSIDE COMPONENT)
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "https://ai-agent-backend-q97u.onrender.com/analyze-image",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
  };

  // 🔐 LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ padding: 50 }}>
        <h2>Enter Password 🔐</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Submit</button>
      </div>
    );
  }

  // 🤖 CHAT UI
  return (
    <div style={{ padding: 20 }}>
      <h1>Harshini AI 🤖</h1>

      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />

      <button onClick={sendMessage}>Send</button>

      {/* ✅ IMAGE UPLOAD */}
      <div style={{ marginTop: 20 }}>
        <input type="file" onChange={handleImageUpload} />
      </div>
    </div>
  );
}