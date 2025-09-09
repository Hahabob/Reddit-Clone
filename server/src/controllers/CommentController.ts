import { Request, Response } from "express";
import PostModel from "../models/Post"; // long schema model
import { getAuth } from "@clerk/express";

const CommentController = {
  //create comment on post
  async create(req: Request, res: Response) {},
  //create nested comment (comment of a comment)
  async createReply(req: Request, res: Response) {},
  //get comments for post including nested //todo  implement sorting
  async getCommentsForPost(req: Request, res: Response) {},
  //update comment only body.
  async edit(req: Request, res: Response) {},
  //soft delete . swaps body with [removed]
  async deleteComment(req: Request, res: Response) {},
  //todo implement remove comment (same as remove post)
  async removeComment(req: Request, res: Response) {},
};

export default CommentController;
