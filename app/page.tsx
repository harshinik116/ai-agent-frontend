"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!message) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    try {
      const res = await fetch("https://ai-agent-backend-q97u.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          history: newChat,
        }),
      });

      const data = await res.json();

      setChat([
        ...newChat,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

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
    </div>
  );
}