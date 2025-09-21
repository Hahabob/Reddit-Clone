import { Request, Response } from "express";
import PostModel, { EnrichedPost } from "../models/Post"; // long schema model
import SubredditModel, { CommunityTopic } from "../models/Subreddit"; // long schema model
import { getAuth } from "@clerk/express";
import VoteModel from "../models/Vote";
import {
  sortHot,
  sortNew,
  sortTop,
  sortControversial,
  sortRising,
} from "../utils/sortUtils";

const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, subredditId } = req.body;

      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(subredditId);

      if (
        !subreddit?.members
          .map((member) => member.toString())
          .includes(userId.toString())
      ) {
        return res
          .status(403)
          .json({ message: "User is not a member of this subreddit" });
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

      const newPost = await PostModel.create({
        title,
        content: {
          type: content.type,
          value: content.value,
        },
        topics: subreddit.topics,
        authorId: userId,
        subredditId,
        createdAt: new Date(),
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  //todo implement get by topic
  //?either all in the same function or different functions
  async getAll(req: Request, res: Response) {
    try {
      const Posts = (await PostModel.find({})) || "no posts yet";
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
      const { topic, sort, t } = req.query;
      // Enforce either filtering by topic or sorting by sort type
      if (
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
      const post = await PostModel.findById(postId);

      if (!post) {
        res.status(400).json({ success: false, message: "post not found" });
        return;
      }
      const votes = await VoteModel.aggregate([
        { $match: { postId: postId } },
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
      const enrichedPost: EnrichedPost = {
        ...post.toObject(),
        upvotes,
        downvotes,
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
      const userPosts = await PostModel.find({ authorId: userId }).sort({
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

      // Attach to posts
      const enrichedPosts: EnrichedPost[] = userPosts.map((p) => {
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
