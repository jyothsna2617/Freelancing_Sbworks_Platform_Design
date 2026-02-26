import { useEffect, useState, useRef } from "react";
import socket from "./socket";
import api from "../Api/axios";
import { useGeneral } from "../context/GeneralContext";
import "./chat.css";

const ChatBox = ({ clientId, freelancerId }) => {
  const { user } = useGeneral();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  const myId = user?._id || user?.id;

  /* ---------- AUTO SCROLL ---------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- FETCH OLD MESSAGES ---------- */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${clientId}/${freelancerId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    if (clientId && freelancerId) {
      fetchMessages();
    }
  }, [clientId, freelancerId]);

  /* ---------- JOIN ROOM + LISTEN ---------- */
  useEffect(() => {
    if (!clientId || !freelancerId) return;

    console.log("Joining room:", clientId, freelancerId);

    // ⭐ MUST MATCH BACKEND FORMAT
    socket.emit("joinRoom", {
      clientId,
      freelancerId
    });

    socket.on("receiveMessage", (msg) => {
      console.log("RECEIVED MESSAGE:", msg);

      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [clientId, freelancerId]);

  /* ---------- AUTO SCROLL WHEN NEW MESSAGE ---------- */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ---------- SEND MESSAGE ---------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    const messageData = {
      clientId,
      freelancerId,
      senderId: myId,
      message: text,
    };

    console.log("SENDING MESSAGE:", messageData);

    socket.emit("sendMessage", messageData);

    setText("");
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, index) => {
          const sender =
            typeof m.senderId === "object"
              ? m.senderId._id
              : m.senderId;

          const isMe = sender === myId;

          return (
            <div
              key={m._id || index}
              className={`message ${isMe ? "sent" : "received"}`}
            >
              <div className="sender-name">
                {m.senderId?.name || "User"}
              </div>
              <div>{m.message}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;