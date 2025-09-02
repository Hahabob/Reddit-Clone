import express from "express";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { User } from "../models/User";

const router = express.Router();

// Get comments for a post
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ postId })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new comment
router.post("/", async (req, res) => {
  try {
    const { postId, authorId, content, parentId } = req.body;

    // Validate required fields
    if (!postId || !authorId || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    const comment = new Comment({
      postId,
      authorId,
      content,
      parentId: parentId || null,
      votes: 0,
    });

    await comment.save();
    await comment.populate("authorId", "username avatarUrl");

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get nested replies for a comment
router.get("/:id/replies", async (req, res) => {
  try {
    const replies = await Comment.find({ parentId: req.params.id })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: replies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch replies",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update comment
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    ).populate("authorId", "username avatarUrl");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Also delete all replies to this comment
    await Comment.deleteMany({ parentId: req.params.id });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Upvote comment
router.post("/:id/upvote", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    ).populate("authorId", "username avatarUrl");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upvote comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Downvote comment
router.post("/:id/downvote", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: -1 } },
      { new: true }
    ).populate("authorId", "username avatarUrl");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to downvote comment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
