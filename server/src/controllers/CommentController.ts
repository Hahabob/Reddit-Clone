import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { IComment } from "../models/Comment";
import CommentModel from "../models/Comment";

interface CommentTreeNode extends IComment {
  replies: CommentTreeNode[];
}

const buildCommentTree = (
  comments: IComment[],
  parentId: string | null = null
): CommentTreeNode[] => {
  return comments
    .filter((c) => String(c.parentId) === String(parentId))
    .map((c) => ({
      ...c.toObject(),
      replies: buildCommentTree(comments, c._id.toString()),
    }));
};

const CommentController = {
  //create comment on post
  async create(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { postId } = req.params;
      if (!postId) {
        return res
          .status(400)
          .json({ success: false, message: "post not found" });
      }
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Missing content" });
      }

      const newComment = await CommentModel.create({
        postId: postId,
        authorId: userId,
        content,
        createdAt: new Date(),
      });
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  //create nested comment (comment of a comment)
  async createReply(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const parentComment = await CommentModel.findById(req.params.commentId);
      if (!parentComment)
        return res.status(404).json({ message: "Comment not found" });

      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Missing content" });
      }

      const newReply = await CommentModel.create({
        postId: parentComment.postId,
        authorId: userId,
        content,
        parentId: parentComment._id,
        createdAt: new Date(),
      });
      return res.status(201).json(newReply);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  //get comments for post including nested //todo  implement sorting
  async getCommentsForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      // Fetch all comments for this post
      const comments = await CommentModel.find({ postId }).sort({
        createdAt: 1,
      });

      // Build tree
      const tree = buildCommentTree(comments, null);

      return res.status(200).json(tree);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching comments" });
    }
  },
  //update comment only body.
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (comment.isDeleted || comment.isRemoved) {
        return res.status(403).json({ message: "Cannot edit this comment" });
      }
      const { content } = req.body;
      comment.content = content ?? comment.content;
      await comment.save();
      res.json({ success: true, data: comment });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  //soft delete . swaps body with [removed]
  async deleteComment(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Only the author can delete their comment
      if (comment.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Block if already deleted or removed
      if (comment.isDeleted || comment.isRemoved) {
        return res.status(403).json({ message: "Cannot delete this comment" });
      }

      // Soft delete
      comment.isDeleted = true;
      comment.content = "[deleted]";
      await comment.save();

      res.json({ success: true, data: comment });
    } catch (error) {
      console.error("cannot delete comment", error);
      res.status(500).json({ message: "Server error during delete" });
    }
  },
  //todo implement remove comment (same as remove post)
  async removeComment(req: Request, res: Response) {},
  async getCommentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      const userComments = await CommentModel.find({ authorId: userId }).sort({
        createdAt: -1,
      });
      res.json({ success: true, data: userComments });
    } catch (error) {
      console.error("Error fetching comments by user:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching user comments",
      });
    }
  },
};

export default CommentController;
