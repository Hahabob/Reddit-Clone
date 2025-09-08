import { Request, Response } from "express";
import PostModel from "../models/Post"; // long schema model
import { getAuth } from "@clerk/express";

const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, communityId } = req.body;

      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      if (!title || !content?.type || !content?.value || !communityId) {
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
        authorId: userId,
        communityId,
        comments: [],
        createdAt: new Date(),
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  //todo implement sorting
  async getAll(req: Request, res: Response) {
    try {
      const Posts = (await PostModel.find({})) || "no posts yet";
      res.json({
        data: Posts,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostModel.findById(id);
      if (!post) {
        res.status(400).json({ success: false, message: "post not found" });
        return;
      }
      res.json({
        data: post,
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
      const { id } = req.params;
      const post = await PostModel.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (post.authorId.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
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
      const { id } = req.params;
      const deletedPost = await PostModel.findByIdAndDelete(id);
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
      const { id } = req.params;
      const post = await PostModel.findById(id);
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
      const { id } = req.params;
      const post = await PostModel.findById(id);
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
  //todo implement delete post function(user only , changes content and title to [removed] comments stay the same but is removed from feed )
  async deletePost(req: Request, res: Response) {},
};

export default PostController;
