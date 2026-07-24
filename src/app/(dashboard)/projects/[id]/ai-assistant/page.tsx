"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Message = { role: string; content: string };

export default function AIAssistantPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/ai/chat/history?projectId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoadingHistory(false);
      });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id, message: userMessage }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
    }
  };

  if (loadingHistory) return <p style={{ color: "#888780", fontSize: "13px" }}>Loading...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "500px" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px", padding: "4px" }}>
        {messages.length === 0 && (
          <p style={{ fontSize: "13px", color: "#888780" }}>
            Ask me anything about this project — architecture, decisions, setup, whatever you've documented.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                background: msg.role === "user" ? "#D85A30" : "#FAF7F0",
                color: msg.role === "user" ? "#fff" : "#2C2C2A",
                border: msg.role === "user" ? "none" : "0.5px solid #E4DFD2",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p style={{ fontSize: "12px", color: "#888780" }}>Thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about this project..."
          style={{ flex: 1, padding: "10px 12px", border: "1px solid #E4DFD2", borderRadius: "8px", fontSize: "13px" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: "10px 18px", background: "#D85A30", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}