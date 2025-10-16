import { Request, Response } from "express";
import PostModel, { EnrichedPost } from "../models/Post"; // long schema model
import SubredditModel, { CommunityTopic } from "../models/Subreddit"; // long schema model
import UserModel from "../models/User";
import { getAuth } from "@clerk/express";
import VoteModel from "../models/Vote";
import {
  sortHot,
  sortNew,
  sortTop,
  sortControversial,
  sortRising,
} from "../utils/sortUtils";
import mongoose from "mongoose";

const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, subredditId } = req.body;

      let { userId: clerkUserId } = getAuth(req) || {};

      if (!clerkUserId) {
        clerkUserId = req.body.userId;
      }
      if (!clerkUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Find the user in our database to get their MongoDB ObjectId
      const user = await UserModel.findOne({ clerkId: clerkUserId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const subreddit = await SubredditModel.findById(subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }

      // Check if user is a member using their MongoDB ObjectId
      const isMember = subreddit.members
        .map((member) => member.toString())
        .includes(user._id.toString());

      // For now, allow posting to any public subreddit to help new users
      // In a full Reddit implementation, you'd want to enforce membership
      if (!isMember && subreddit.isPrivate) {
        return res
          .status(403)
          .json({ message: "User is not a member of this private subreddit" });
      }

      // If user is not a member of a public subreddit, auto-join them
      if (!isMember && !subreddit.isPrivate) {
        subreddit.members.push(user._id);
        await subreddit.save();
      }

      if (!title || !content?.type || !content?.value || !subredditId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      // Validate allowed content types
      const allowedTypes = ["text", "image", "video", "link"];
      if (!allowedTypes.includes(content.type)) {
        return res
          .status(400)
          .json({ message: `Invalid content type: ${content.type}` });
      }

      // Map content based on type
      let contentData: any = { type: content.type };

      switch (content.type) {
        case "text":
          contentData.text = content.value;
          break;
        case "image":
          contentData.url = content.value;
          break;
        case "video":
          contentData.url = content.value;
          break;
        case "link":
          contentData.url = content.value;
          break;
        default:
          contentData.text = content.value;
      }

      const newPost = await PostModel.create({
        title,
        content: contentData,
        topics: subreddit.topics,
        authorId: user._id,
        subredditId,
        createdAt: new Date(),
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const Posts =
        (await PostModel.find({}).populate("subredditId", "name")) ||
        "no posts yet";
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

      // Get current user's votes if authenticated
      let userVotesMap = new Map<string, 1 | -1>();
      const auth = getAuth(req);
      if (auth?.userId) {
        const user = await UserModel.findOne({ clerkId: auth.userId });
        if (user) {
          const userVotes = await VoteModel.find({
            userId: user._id,
            postId: { $in: postIds },
          });
          userVotes.forEach((vote) => {
            if (vote.postId) {
              userVotesMap.set(vote.postId.toString(), vote.value);
            }
          });
        }
      }

      // Attach to posts and convert to plain objects
      const enrichedPosts: EnrichedPost[] = Posts.map((p) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(p._id)) || {};
        const userVote = (userVotesMap.get(String(p._id)) || 0) as 1 | -1 | 0;
        return {
          ...p.toObject(), // Convert Mongoose document to plain object
          upvotes,
          downvotes,
          userVote,
        };
      });

      let sortedPosts;
      const { topic, sort, t, feed } = req.query;

      // Handle feed parameter (used by usePostsFeed hook)
      if (feed) {
        switch (feed) {
          case "home":
          case "popular":
            sortedPosts = sortHot(enrichedPosts);
            break;
          case "new":
            sortedPosts = sortNew(enrichedPosts);
            break;
          default:
            sortedPosts = sortHot(enrichedPosts);
        }
      }
      // Enforce either filtering by topic or sorting by sort type
      else if (
        topic &&
        Object.values(CommunityTopic).includes(topic as CommunityTopic)
      ) {
        sortedPosts = enrichedPosts.filter((p) =>
          p.topics?.includes(topic as CommunityTopic)
        );
      } else {
        switch (sort) {
          case "hot":
            sortedPosts = sortHot(enrichedPosts);
            break;
          case "new":
            sortedPosts = sortNew(enrichedPosts);
            break;
          case "top":
            sortedPosts = sortTop(enrichedPosts, t as string);
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
  async get(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await PostModel.findById(postId).populate(
        "subredditId",
        "name"
      );

      if (!post) {
        res.status(400).json({ success: false, message: "post not found" });
        return;
      }
      const votes = await VoteModel.aggregate([
        { $match: { postId: new mongoose.Types.ObjectId(postId) } },
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

      const { upvotes = 0, downvotes = 0 } =
        voteMap.get(String(post._id)) || {};

      // Get current user's vote if authenticated
      let userVote: 1 | -1 | 0 = 0;
      const auth = getAuth(req);
      if (auth?.userId) {
        const user = await UserModel.findOne({ clerkId: auth.userId });
        if (user) {
          const existingVote = await VoteModel.findOne({
            userId: user._id,
            postId: post._id,
          });
          userVote = existingVote ? existingVote.value : 0;
        }
      }

      const enrichedPost: EnrichedPost = {
        ...post.toObject(),
        upvotes,
        downvotes,
        userVote,
      };
      res.json({
        data: enrichedPost,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { postId } = req.params;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (post.isDeleted || post.isRemoved) {
        return res.status(403).json({ message: "Cannot edit this post" });
      }

      const { content } = req.body;
      post.content = content ?? post.content;
      await post.save();
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  //development only .
  async delete(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const deletedPost = await PostModel.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res
          .status(404)
          .json({ success: false, message: "post not found" });
      }

      res.status(201).json({
        success: true,
        message: "post deleted successfully",
        data: deletedPost,
      });
    } catch (error) {
      console.error("cant delete", error);
      res.status(500).json({ message: "server error during delete" });
    }
  },
  async tagNsfwPost(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { postId } = req.params;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { isNSFW } = req.body;
      post.isNSFW = isNSFW ?? post.isNSFW;
      await post.save();
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("cant tag nsfw", error);
      res.status(500).json({ message: "server error during tag nsfw" });
    }
  },
  async tagSpoilerPost(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};
      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { postId } = req.params;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { isSpoiler } = req.body;
      post.isSpoiler = isSpoiler ?? post.isSpoiler;
      await post.save();
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("cant tag spoiler", error);
      res.status(500).json({ message: "server error during tag spoiler" });
    }
  },
  //todo implement pin post function (only moderators can pin post) need to update user model to add isModerator field
  async pinPost(req: Request, res: Response) {},
  //todo implement remove post function(moderators only , changes content to [removed]( change happens frontend only ) post still visible to mods but removed from feed )
  async removePost(req: Request, res: Response) {},
  //todo implement delete post function(user only , changes content and title to [deleted] comments stay the same but is removed from feed )
  async deletePost(req: Request, res: Response) {},
  async getPostsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      const userPosts = await PostModel.find({ authorId: userId })
        .populate("subredditId", "name")
        .sort({
          createdAt: -1,
        });
      const userPostIds = userPosts.map((p) => p._id);

      // Aggregate votes
      const votes = await VoteModel.aggregate([
        { $match: { postId: { $in: userPostIds } } },
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

      // Get current user's votes if authenticated
      let userVotesMap = new Map<string, 1 | -1>();
      const auth = getAuth(req);
      if (auth?.userId) {
        const user = await UserModel.findOne({ clerkId: auth.userId });
        if (user) {
          const userVotes = await VoteModel.find({
            userId: user._id,
            postId: { $in: userPostIds },
          });
          userVotes.forEach((vote) => {
            if (vote.postId) {
              userVotesMap.set(vote.postId.toString(), vote.value);
            }
          });
        }
      }

      // Attach to posts
      const enrichedPosts: EnrichedPost[] = userPosts.map((p) => {
        const { upvotes = 0, downvotes = 0 } = voteMap.get(String(p._id)) || {};
        const userVote = (userVotesMap.get(String(p._id)) || 0) as 1 | -1 | 0;
        return {
          ...p.toObject(), // Convert Mongoose document to plain object
          upvotes,
          downvotes,
          userVote,
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
        default:
          sortedPosts = sortHot(enrichedPosts); // fallback
      }
      res.json({
        data: sortedPosts,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching user posts",
      });
    }
  },
};

export default PostController;
