import express from "express";
import UserController from "../controllers/UserController";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";

const router = express.Router();
//Get user profile
router.get("/:userId", UserController.get);
//List users
router.get("/", UserController.getAll);
//Update user info
router.patch("/:userId", UserController.edit);
//get user posts
router.get("/:userId/posts", PostController.getPostsByUser);
//get user comments
router.get("/:userId/comments", CommentController.getCommentsByUser);
//get overview (posts and comments combined)
router.get("/:userId/overview", UserController.getOverview);

export default router;
