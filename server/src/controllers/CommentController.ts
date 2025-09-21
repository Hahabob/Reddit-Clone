import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { EnrichedComment, IComment } from "../models/Comment";
import CommentModel from "../models/Comment";
import VoteModel from "../models/Vote";
import {
  sortHot,
  sortNew,
  sortTop,
  sortControversial,
  sortRising,
} from "../utils/sortUtils";

interface CommentTreeNode extends EnrichedComment {
  replies: CommentTreeNode[];
}
//! build tree function not working
const buildCommentTree = (
  comments: EnrichedComment[],
  parentId: string | null = null,
  sortFn?: (arr: EnrichedComment[]) => EnrichedComment[]
): CommentTreeNode[] => {
  // Find direct children of the current parent
  let children = comments.filter(
    (c) =>
      (c.parentId ? String(c.parentId) : null) ===
      (parentId !== null ? String(parentId) : null)
  );

  // At root level → apply custom sort
  if (parentId === null && sortFn) {
    children = sortFn(children);
  } else {
    // At reply level → sort by createdAt ascending
    children = children.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  // Build the recursive tree
  return children.map((c) => ({
    ...c,
    replies: buildCommentTree(comments, c._id.toString(), sortFn),
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
  //get comments for post including nested
  async getCommentsForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      // Fetch all comments for this post
      const comments = await CommentModel.find({ postId }).sort({
        createdAt: 1,
      });
      const commentIds = comments.map((c) => c._id);

      // Aggregate votes
      const votes = await VoteModel.aggregate([
        { $match: { postId: { $in: commentIds } } },
        {
          $group: {
            _id: "$commentId",
            upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]);

      // Map for quick lookup
      const voteMap = new Map(
        votes.map((v) => [
          String(v._id),
          { upvotes: v.upvotes, downvotes: v.downvotes },
        ])
      );

      // Attach to comments
      const enrichedComments: EnrichedComment[] = comments.map((c) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(c._id)) || {};
        return {
          ...c,
          upvotes,
          downvotes,
        };
      });

      let sortFn: (arr: EnrichedComment[]) => EnrichedComment[];

      switch (req.query.sort) {
        case "hot":
          sortFn = sortHot;
        case "new":
          sortFn = sortNew;
          break;
        case "top":
          sortFn = (arr) => sortTop(arr, req.query.t as string);
          break;
        case "rising":
          sortFn = sortRising;
          break;
        case "controversial":
          sortFn = sortControversial;
          break;
        default:
          sortFn = sortHot; // fallback
      }

      const tree = buildCommentTree(enrichedComments, null, sortFn);

      res.json({
        data: tree,
        success: true,
      });
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
      const userCommentIds = userComments.map((p) => p._id);

      // Aggregate votes
      const votes = await VoteModel.aggregate([
        { $match: { postId: { $in: userCommentIds } } },
        {
          $group: {
            _id: "$commentId",
            upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]);

      // Map for quick lookup
      const voteMap = new Map(
        votes.map((v) => [
          String(v._id),
          { upvotes: v.upvotes, downvotes: v.downvotes },
        ])
      );

      // Attach to posts
      const enrichedComments: EnrichedComment[] = userComments.map((c) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(c._id)) || {};
        return {
          ...c,
          upvotes,
          downvotes,
        };
      });

      let sortedComments;
      switch (req.query.sort) {
        case "hot":
          sortedComments = sortHot(enrichedComments);
          break;
        case "new":
          sortedComments = sortNew(enrichedComments);
          break;
        case "top":
          sortedComments = sortTop(enrichedComments, req.query.t as string);
          break;
        default:
          sortedComments = sortHot(enrichedComments); // fallback
      }
      res.json({
        data: sortedComments,
        success: true,
      });
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
