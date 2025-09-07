import express from "express";
import PostController from "../controllers/PostController";

const router = express.Router();
//List all posts; supports query params: feed=home, communityId=<id>, `sort=new
router.get("/", PostController.getAll);
//Get single post with comments
router.get("/:id", PostController.get);
//Create new post
router.post("/", PostController.create);
//Edit post
// router.patch("/:id"); //todo implement
//Delete post
router.delete("/:id", PostController.delete);
//Upvote post
// router.post("/:id/upvote");
//Downvote post
// router.post("/:id/downvote");

export default router;
