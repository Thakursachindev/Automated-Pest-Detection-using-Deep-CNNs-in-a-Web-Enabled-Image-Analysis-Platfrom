// /client/src/components/FloatingChatbot.js
import React, { useState } from "react";
import axios from "axios";
import { X, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FloatingChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const isDark = document.body.classList.contains("dark");

  const sendMessage = async () => {
    if (!userMsg.trim()) return;
    const newMessages = [...messages, { from: "user", text: userMsg }];
    setMessages(newMessages);
    setUserMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMsg,
      });
      const botReply = res.data.reply;
      setMessages([...newMessages, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error(t("Bot is not responding."));
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "var(--accent)",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
      >
        {open ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.div>

      {/* Animated Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: "90px",
              right: "20px",
              width: "320px",
              height: "420px",
              background: isDark ? "var(--card-bg)" : "#fff",
              color: isDark ? "#fff" : "#000",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              padding: "1rem",
              zIndex: 998,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>🤖 {t("Chatbot")}</h4>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "1rem",
                border: "1px solid var(--border)",
                padding: "0.5rem",
                borderRadius: "6px",
                background: isDark ? "#2c2c2c" : "#f9f9f9",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.from === "user" ? "right" : "left",
                    margin: "0.3rem 0",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "16px",
                      backgroundColor:
                        msg.from === "user"
                          ? isDark
                            ? "#66bb6a"
                            : "#c5e1a5"
                          : isDark
                          ? "#444"
                          : "#eeeeee",
                      color: isDark ? "#fff" : "#000",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </span>
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    fontStyle: "italic",
                    color: "#aaa",
                    textAlign: "left",
                    marginTop: "0.3rem",
                  }}
                >
                  {t("Typing...")}
                </div>
              )}
            </div>

            <div style={{ display: "flex" }}>
              <input
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                onKeyDown={handleEnter}
                placeholder={t("Ask a question...")}
                style={{
                  flex: 1,
                  padding: "0.4rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  marginRight: "0.5rem",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("Send")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
