import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { EnrichedComment, IComment } from "../models/Comment";
import CommentModel from "../models/Comment";
import VoteModel from "../models/Vote";
import UserModel from "../models/User";
import {
  sortHot,
  sortNew,
  sortTop,
  sortControversial,
  sortRising,
} from "../utils/sortUtils";

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

      // Convert Clerk ID to MongoDB User ID
      const user = await UserModel.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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

      console.log("Creating comment with:", {
        postId,
        authorId: user._id,
        content,
        clerkId: userId,
      });

      const newComment = await CommentModel.create({
        postId: postId,
        authorId: user._id, // Use MongoDB User ID, not Clerk ID
        content,
        createdAt: new Date(),
      });
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Comment creation error:", error);
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

      // Convert Clerk ID to MongoDB User ID
      const user = await UserModel.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
        authorId: user._id, // Use MongoDB User ID, not Clerk ID
        content,
        parentId: parentComment._id,
        createdAt: new Date(),
      });
      return res.status(201).json(newReply);
    } catch (error) {
      console.error("Reply creation error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  //get comments for post including nested
  async getCommentsForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res
          .status(400)
          .json({ success: false, message: "Post ID is required" });
      }

      // Fetch all comments for this post
      const comments = await CommentModel.find({ postId })
        .sort({ createdAt: 1 })
        .lean();
      const commentIds = comments.map((c) => c._id);

      // Aggregate votes
      const votes = await VoteModel.aggregate([
        { $match: { commentId: { $in: commentIds } } },
        {
          $group: {
            _id: "$commentId",
            upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]);

      // Map votes for quick lookup
      const voteMap = new Map(
        votes.map((v) => [
          String(v._id),
          { upvotes: v.upvotes, downvotes: v.downvotes },
        ])
      );

      // Get current user's votes if authenticated
      let userVotesMap = new Map<string, 1 | -1>();
      const auth = getAuth(req);
      if (auth?.userId) {
        const user = await UserModel.findOne({ clerkId: auth.userId });
        if (user) {
          const userVotes = await VoteModel.find({
            userId: user._id,
            commentId: { $in: commentIds },
          });
          userVotes.forEach((vote) => {
            if (vote.commentId) {
              userVotesMap.set(vote.commentId.toString(), vote.value);
            }
          });
        }
      }

      // Attach votes and initialize replies array
      const enrichedComments: EnrichedComment[] = comments.map((c) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(c._id)) || {};
        const userVote = (userVotesMap.get(String(c._id)) || 0) as 1 | -1 | 0;
        return {
          ...c,
          upvotes,
          downvotes,
          userVote,
          replies: [],
        };
      });

      // Build non-recursive tree
      const commentMap = new Map<string, EnrichedComment>();
      const roots: EnrichedComment[] = [];

      enrichedComments.forEach((c) => commentMap.set(String(c._id), c));
      enrichedComments.forEach((c) => {
        if (c.parentId) {
          const parent = commentMap.get(String(c.parentId));
          if (parent) parent.replies.push(c);
        } else {
          roots.push(c);
        }
      });

      // Apply all sorts sequentially (or just fallback for now)
      let sortedComments;
      switch (req.query.sort) {
        case "hot":
          sortedComments = sortHot([...roots]);
          break;
        case "new":
          sortedComments = sortNew([...roots]);
          break;
        case "top":
          sortedComments = sortTop([...roots], req.query.t as string);
          break;
        case "rising":
          sortedComments = sortRising([...roots]);
          break;
        case "controversial":
          sortedComments = sortControversial([...roots]);
          break;
        default:
          sortedComments = sortHot([...roots]); // fallback sorting
      }

      res.json({
        success: true,
        data: sortedComments,
      });
    } catch (err) {
      console.error("Error fetching comments for post:", err);
      res
        .status(500)
        .json({ success: false, message: "Server error fetching comments" });
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

      // Convert Clerk ID to MongoDB User ID
      const user = await UserModel.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.authorId.toString() !== user._id.toString()) {
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

      // Convert Clerk ID to MongoDB User ID
      const user = await UserModel.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Only the author can delete their comment
      if (comment.authorId.toString() !== user._id.toString()) {
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
        { $match: { commentId: { $in: userCommentIds } } },
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
