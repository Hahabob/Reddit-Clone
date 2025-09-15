import experss from "express";
import SubredditController from "../controllers/SubredditController";

const router = experss.Router();

//List all communities
router.get("/", SubredditController.getAll);
//Get single community
router.get("/:subredditId", SubredditController.get);
//Create community
router.post("/", SubredditController.create);
//Update community, currently edits the description only
router.patch("/:subredditId", SubredditController.edit);
//Add user to community
router.post("/:subredditId/join", SubredditController.join);
//Remove user from community
router.post("/:subredditId/leave", SubredditController.leave);
//Get community posts
router.get("/:subredditId/posts", SubredditController.getPosts);
//Add/remove moderators
// TODO: Implement moderator management
// router.post("/:subredditId/mods", SubredditController.manageMods);

export default router;
