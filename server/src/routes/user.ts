import express from "express";
import UserController from "../controllers/UserController";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";
import SubredditController from "../controllers/SubredditController";

const router = express.Router();
//Get current user profile
router.get("/me", UserController.getCurrentUser);
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
//get subreddits by user in order to list them in post creation screen
router.get("/:userId/subreddits", SubredditController.getSubredditsByUser);

export default router;
