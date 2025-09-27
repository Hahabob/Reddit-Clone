import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import SubredditModel, { CommunityTopic } from "../models/Subreddit";
import PostModel, { EnrichedPost } from "../models/Post"; // long schema model
import UserModel from "../models/User";
import {
  sortHot,
  sortNew,
  sortTop,
  sortControversial,
  sortRising,
} from "../utils/sortUtils";
import VoteModel from "../models/Vote";
import mongoose from "mongoose";

const SubredditController = {
  async get(req: Request, res: Response) {
    try {
      const subreddit = await SubredditModel.findById(req.params.subredditId);

      if (!subreddit) {
        return res
          .status(404)
          .json({ sucess: false, message: "Subreddit not found" });
      }
      res.json({
        data: subreddit,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const { topic } = req.query;

      const match: any = {};
      if (
        topic &&
        Object.values(CommunityTopic).includes(topic as CommunityTopic)
      ) {
        match.topic = topic;
      }

      const subreddits = await SubredditModel.aggregate([
        { $match: match },
        { $addFields: { membersCount: { $size: "$members" } } },
        { $sort: { membersCount: -1 } },
      ]);

      res.json({ data: subreddits, success: true });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async getPopular(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const subreddits = await SubredditModel.aggregate([
        { $addFields: { memberCount: { $size: "$members" } } },
        { $sort: { memberCount: -1 } },
        { $limit: limit },
      ]);

      res.json(subreddits);
    } catch (error) {
      console.error("Error getting popular subreddits:", error);
      res
        .status(500)
        .json({ message: "Server error getting popular subreddits" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const {
        name,
        description,
        iconUrl,
        bannerUrl,
        isNSFW,
        isPrivate,
        topics,
      } = req.body;

      if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newSubreddit = await SubredditModel.create({
        name,
        description,
        iconUrl: iconUrl ?? "",
        bannerUrl: bannerUrl ?? "",
        isNSFW: isNSFW ?? false,
        isPrivate: isPrivate ?? false,
        members: [userId],
        moderators: [userId],
        topics,
        createdAt: new Date(),
      });
      return res.status(201).json(newSubreddit);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  //? maybe implement the widgets and all the other editable stuff communities have later.
  //currently edits only the description
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }
      if (!subreddit.moderators.toString().includes(userId)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { description, iconUrl, bannerUrl } = req.body;
      subreddit.description = description ?? subreddit.description;
      subreddit.iconUrl = iconUrl ?? subreddit.iconUrl;
      subreddit.bannerUrl = bannerUrl ?? subreddit.bannerUrl;
      await subreddit.save();
      res.json({ success: true, data: subreddit });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  async join(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!subreddit.members.includes(user._id)) {
        subreddit.members.push(user._id);
      }

      await subreddit.save();
      res.json({
        data: subreddit.members,
        sucess: true,
      });
    } catch (error) {
      console.error("Error joining subreddit:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  async leave(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!subreddit.members.includes(user._id)) {
        subreddit.members = subreddit.members.filter(
          (memberId) => memberId.toString() !== user._id.toString()
        );
      }

      await subreddit.save();
    } catch (error) {
      console.error("Error leaving subreddit:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  async getPosts(req: Request, res: Response) {
    try {
      const Posts =
        (await PostModel.find({ subredditId: req.params.subredditId })) || [];
      const postIds = Posts.map((p) => p._id);

      // Aggregate votes
      const votes = await VoteModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        {
          $group: {
            _id: "$postId",
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
      const enrichedPosts: EnrichedPost[] = Posts.map((p) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(p._id)) || {};
        return {
          ...p,
          upvotes,
          downvotes,
        };
      });

      let sortedPosts;
      switch (req.query.sort) {
        case "hot":
          sortedPosts = sortHot(enrichedPosts);
          break;
        case "new":
          sortedPosts = sortNew(enrichedPosts);
          break;
        case "top":
          sortedPosts = sortTop(enrichedPosts, req.query.t as string);
          break;
        case "rising":
          sortedPosts = sortRising(enrichedPosts);
          break;
        case "controversial":
          sortedPosts = sortControversial(enrichedPosts);
          break;
        default:
          sortedPosts = sortHot(enrichedPosts); // fallback
      }
      res.json({
        data: sortedPosts,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async getSubredditsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid userId" });
      }

      const subreddits = await SubredditModel.find({
        members: new mongoose.Types.ObjectId(userId),
      }).select("name iconUrl");

      if (!subreddits || subreddits.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User is not a member of any subreddit",
        });
      }

      return res.json({ success: true, data: subreddits });
    } catch (error) {
      console.error("Error fetching subreddits by user:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching user subreddits",
      });
    }
  },
  //todo implement mod promotion and demotion
};

export default SubredditController;
