require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

/* ================== SERVER ================== */
const server = http.createServer(app);

/* ================== SOCKET.IO ================== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* ================== SOCKET EVENTS ================== */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  /* ---------- JOIN ROOM ---------- */
  socket.on("joinRoom", ({ clientId, freelancerId }) => {
    if (!clientId || !freelancerId) return;

    // ⭐ VERY IMPORTANT FIX
    const room = ["chat", clientId, freelancerId]
      .sort()
      .join("_");

    socket.join(room);

    console.log("📦 Joined room:", room);
  });

  /* ---------- SEND MESSAGE ---------- */
  socket.on("sendMessage", async (data) => {
    try {
      const room = ["chat", data.clientId, data.freelancerId]
        .sort()
        .join("_");

      const savedMessage = await Message.create({
        clientId: data.clientId,
        freelancerId: data.freelancerId,
        senderId: data.senderId,
        message: data.message
      });

      // Populate sender details
      const populatedMessage = await savedMessage.populate(
        "senderId",
        "name role"
      );

      console.log("📨 Sending message to room:", room);

      io.to(room).emit("receiveMessage", populatedMessage);

    } catch (err) {
      console.error("❌ Message error:", err);
    }
  });

  /* ---------- TYPING EVENT ---------- */
  socket.on("typing", ({ clientId, freelancerId, senderId, isTyping }) => {
    const room = ["chat", clientId, freelancerId]
      .sort()
      .join("_");

    socket.to(room).emit("typing", { senderId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================== ROUTES ================== */
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/projects", require("./routes/projectRoute"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================== DATABASE ================== */
connectDB();

/* ================== TEST ROUTE ================== */
app.get("/", (req, res) => {
  res.send("SB Works Backend is Running");
});

/* ================== START SERVER ================== */
server.listen(5000, () => {
  console.log("🚀 Server + Socket.IO running on port 5000");
});