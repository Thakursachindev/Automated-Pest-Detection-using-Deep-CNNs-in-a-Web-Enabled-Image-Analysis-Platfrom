// /client/src/components/Chatbot.js
import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const Chatbot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [userMsg, setUserMsg] = useState("");

  const sendMessage = async () => {
    if (!userMsg.trim()) return;

    const newMessages = [...messages, { from: "user", text: userMsg }];
    setMessages(newMessages);
    setUserMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMsg,
      });

      const botReply = res.data.reply;
      setMessages([...newMessages, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error(t("Bot is not responding."));
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const isDark = document.body.classList.contains("dark");

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        padding: "1rem",
        borderRadius: "10px",
        maxWidth: "400px",
        margin: "1rem auto",
        background: isDark ? "var(--card-bg)" : "#fafafa",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>🤖 {t("Chatbot")}</h3>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0.5rem",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          background: isDark ? "#2c2c2c" : "white",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              padding: "0.6rem 1rem",
              borderRadius: "20px",
              maxWidth: "80%",
              backgroundColor:
                msg.from === "user"
                  ? isDark
                    ? "#66bb6a"
                    : "#a5d6a7"
                  : isDark
                  ? "#444"
                  : "#eeeeee",
              color: isDark ? "#fff" : "#000",
            }}
          >
            <b>{msg.from === "user" ? t("You") : t("Chatbot")}:</b> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={userMsg}
          onChange={(e) => setUserMsg(e.target.value)}
          onKeyDown={handleEnter}
          placeholder={t("Ask a question...")}
          style={{
            padding: "0.5rem",
            flex: 1,
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {t("Send")}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
