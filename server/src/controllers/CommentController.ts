import { Request, Response } from "express";
import PostModel from "../models/Post"; // long schema model
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
  async create(req: Request, res: Response) {},
  //create nested comment (comment of a comment)
  async createReply(req: Request, res: Response) {},
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
  async edit(req: Request, res: Response) {},
  //soft delete . swaps body with [removed]
  async deleteComment(req: Request, res: Response) {},
  //todo implement remove comment (same as remove post)
  async removeComment(req: Request, res: Response) {},
};

export default CommentController;
