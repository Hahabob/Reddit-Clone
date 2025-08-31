import experss from "express";

const router = experss.Router();

//List all communities
router.get("/subreddits");
//Get single community
router.get("/subreddits/:id");
//Search communities
router.get("/subreddits?search=<term>");
//Create community
router.post("/subreddits");
//Update community
router.put("/subreddits/:id");
//Delete community
router.delete("/subreddits/:id");
//Add user to community
router.post("/subreddits/:id/join");
//Remove user from community
router.post("/subreddits/:id/leave");
//Add/remove moderators
router.post("/subreddits/:id/mods");
