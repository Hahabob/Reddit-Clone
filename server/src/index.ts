import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle new post creation
  socket.on("createPost", (postData) => {
    // Here you would save the post to your database
    console.log("New post created:", postData);

    // Broadcast the new post to all connected clients
    io.emit("newPost", postData);
  });

  // Handle post updates (votes, comments, etc.)
  socket.on("updatePost", (postData) => {
    console.log("Post updated:", postData);

    // Broadcast the updated post to all connected clients
    io.emit("postUpdate", postData);
  });

  // Handle new comment
  socket.on("createComment", (commentData) => {
    console.log("New comment created:", commentData);

    // Broadcast the new comment to all connected clients
    io.emit("newComment", commentData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "Reddit Clone API Server" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});
