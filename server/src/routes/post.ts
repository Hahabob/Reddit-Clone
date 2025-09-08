import express from "express";
import PostController from "../controllers/PostController";

const router = express.Router();
//List all posts; supports query params: feed=home, communityId=<id>, `sort=new
router.get("/", PostController.getAll);
//Get single post with comments
router.get("/:id", PostController.get);
//Create new post
router.post("/", PostController.create);
//Edit post only content same as reddit
router.patch("/:id", PostController.edit);
//Delete post only for development, in reddit deleting a post is adding a delete flag and hiding it from the feed
router.delete("/:id", PostController.delete);
//Tag post as nsfw
router.patch("/:id/nsfw", PostController.tagNsfwPost);
//Tag post as spoiler
router.patch("/:id/spoiler", PostController.tagSpoilerPost);
//Pin post
// router.patch("/:id/pin", PostController.pinPost);
//Archive post
// router.patch("/:id/archive", PostController.archivePost);
export default router;
