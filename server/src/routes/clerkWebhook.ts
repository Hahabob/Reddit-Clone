// routes/clerkWebhook.ts
import express from "express";
import UserModel from "../models/User";

const router = express.Router();

router.post("/clerk-webhook", async (req, res) => {
  try {
    const event = req.body;

    switch (event.type) {
      case "user.created": {
        const { id, username, image_url } = event.data;

        await UserModel.create({
          clerkId: id,
          username: username || `user_${id.slice(0, 6)}`,
          displayName: username || `user_${id.slice(0, 6)}`,
          about: "",
          socialLinks: [],
          isMature: false,
          isModerator: false,
          avatarUrl: image_url || "",
          bannerUrl: "",
          karma: {
            post: 0,
            comment: 0,
          },
          gender: "unspecified",
        });
        console.log(`User created in DB: ${id}`);
        break;
      }

      case "user.updated": {
        const { id, username, image_url } = event.data;

        await UserModel.findOneAndUpdate(
          { clerkId: id },
          {
            username: username || `user_${id.slice(0, 6)}`,
            displayName: username || `user_${id.slice(0, 6)}`,
            avatarUrl: image_url || "",
          },
          { new: true }
        );
        console.log(`User updated in DB: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = event.data;

        await UserModel.findOneAndDelete({ clerkId: id });
        console.log(`User deleted from DB: ${id}`);
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook handling failed" });
  }
});

export default router;
