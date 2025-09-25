import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import redditRoutes from "./routes/reddit";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";
import userRoutes from "./routes/user";
import subredditRoutes from "./routes/subreddit";
import uploadRoutes from "./routes/upload";
import searchRoutes from "./routes/search";
import clerkWebhookRoutes from "./routes/clerkWebhook";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("No uri provided");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to DB");
  } catch (error) {
    throw new Error("We've got an issue here");
  }
};

connectDB();

app.use(cors());
app.use(express.json());

// Webhook routes MUST be before clerkMiddleware to remain public
app.use("/webhooks", clerkWebhookRoutes);

// Now apply Clerk middleware to protect other routes
app.use(clerkMiddleware());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("createPost", (postData) => {
    console.log("New post created:", postData);
    io.emit("newPost", postData);
  });

  socket.on("updatePost", (postData) => {
    console.log("Post updated:", postData);
    io.emit("postUpdate", postData);
  });

  socket.on("createComment", (commentData) => {
    console.log("New comment created:", commentData);
    io.emit("newComment", commentData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api/reddit", redditRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/subreddits", subredditRoutes);
app.use("/search", searchRoutes);
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Reddit Clone API Server" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});
