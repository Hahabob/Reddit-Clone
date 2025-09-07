import { Request, Response } from "express";
import PostModel from "../models/Post"; // long schema model
// import { getAuth } from "@clerk/express";

const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, communityId } = req.body;

      // todo implement clerk here
      // let { userId } = getAuth(req) || {};

      // if(!userId){
      //   userId = req.body.userId
      // }

      let { userId } = req.body;
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
  async getAll(req: Request, res: Response) {
    try {
      //todo implement sorting
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
  async edit(req: Request, res: Response) {},
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
};

export default PostController;
