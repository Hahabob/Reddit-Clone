import { Request, Response } from "express";
import UserModel from "../models/User";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";
import VoteModel from "../models/Vote";
import { getAuth } from "@clerk/express";
import { sortHot, sortNew, sortTop } from "../utils/sortUtils";

const UserController = {
  async get(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        return res
          .status(404)
          .json({ sucess: false, message: "User not found" });
      }
      res.json({
        data: user,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const Users = (await UserModel.find({})) || [];
      res.json({
        data: Users,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  //? consider changing the username editing and moderator to not be changable by the user
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      // Allow fallback to body param for development/testing
      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only allow editing own profile
      if (user._id.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // List all editable fields
      const {
        username,
        displayName,
        about,
        socialLinks,
        isMature,
        isModerator,
        avatarUrl,
        bannerUrl,
        gender,
      } = req.body;

      // Only update fields if provided
      if (username !== undefined) user.username = username;
      if (displayName !== undefined) user.displayName = displayName;
      if (about !== undefined) user.about = about;
      if (socialLinks !== undefined) user.socialLinks = socialLinks;
      if (isMature !== undefined) user.isMature = isMature;
      if (isModerator !== undefined) user.isModerator = isModerator;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
      if (bannerUrl !== undefined) user.bannerUrl = bannerUrl;
      if (gender !== undefined) user.gender = gender;

      await user.save();

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  async getOverview(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      const posts = await PostModel.find({ authorId: userId }).lean();
      const comments = await CommentModel.find({ authorId: userId }).lean();

      const postIds = posts.map((p) => p._id);
      const commentIds = comments.map((c) => c._id);

      // Aggregate votes for posts
      const postVotes = await VoteModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        {
          $group: {
            _id: "$postId",
            upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]);

      // Aggregate votes for comments
      const commentVotes = await VoteModel.aggregate([
        { $match: { commentId: { $in: commentIds } } },
        {
          $group: {
            _id: "$commentId",
            upvotes: { $sum: { $cond: [{ $eq: ["$value", 1] }, 1, 0] } },
            downvotes: { $sum: { $cond: [{ $eq: ["$value", -1] }, 1, 0] } },
          },
        },
      ]);

      // Create vote maps for quick lookup
      const postVoteMap = new Map(
        postVotes.map((v) => [
          String(v._id),
          { upvotes: v.upvotes, downvotes: v.downvotes },
        ])
      );

      const commentVoteMap = new Map(
        commentVotes.map((v) => [
          String(v._id),
          { upvotes: v.upvotes, downvotes: v.downvotes },
        ])
      );

      const normalizedPosts = posts.map((p) => {
        const { upvotes = 0, downvotes = 0 } =
          postVoteMap.get(String(p._id)) || {};
        return {
          type: "post",
          id: p._id,
          content: p.content,
          createdAt: p.createdAt,
          upvotes,
          downvotes,
        };
      });

      const normalizedComments = comments.map((c) => {
        const { upvotes = 0, downvotes = 0 } =
          commentVoteMap.get(String(c._id)) || {};
        return {
          type: "comment",
          id: c._id,
          content: c.content,
          createdAt: c.createdAt,
          upvotes,
          downvotes,
        };
      });

      const overview = [...normalizedPosts, ...normalizedComments].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      let sortedOverview;
      switch (req.query.sort) {
        case "hot":
          sortedOverview = sortHot(overview);
          break;
        case "new":
          sortedOverview = sortNew(overview);
          break;
        case "top":
          sortedOverview = sortTop(overview, req.query.t as string);
          break;
        default:
          sortedOverview = sortNew(overview); // fallback
      }
      res.json({ success: true, data: sortedOverview });
    } catch (error) {
      console.error("Error fetching overview:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching overview",
      });
    }
  },
};

export default UserController;
