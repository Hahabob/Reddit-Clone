import express from "express";

const router = express.Router();
//Get user profile
router.get("/users/:id");
//List users
router.get("/users");
//Update user info
router.put("/users/:id");
//Delete user (admin only)
router.delete("/users/:id");
