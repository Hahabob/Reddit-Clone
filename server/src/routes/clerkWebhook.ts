// routes/clerkWebhook.ts
import express from "express";
import { Webhook } from "svix";
import UserModel from "../models/User";

const router = express.Router();

router.post("/clerk-webhook", async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
      );
    }

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res
        .status(400)
        .json({ error: "Error occurred -- no svix headers" });
    }

    // Get the body (it's already raw from the middleware)
    const body = req.body;

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let event;

    // Verify the payload with the headers
    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res
        .status(400)
        .json({ error: "Error occurred -- webhook verification failed" });
    }

    const webhookEvent = event as any; // Cast to any for Clerk webhook events

    switch (webhookEvent.type) {
      case "user.created": {
        const {
          id,
          username,
          first_name,
          last_name,
          image_url,
          profile_image_url,
          email_addresses,
        } = webhookEvent.data;

        // Get primary email address
        const primaryEmail =
          email_addresses?.find(
            (email: any) =>
              email.id === webhookEvent.data.primary_email_address_id
          )?.email_address ||
          email_addresses?.[0]?.email_address ||
          "";

        // Create a username from available data
        let finalUsername = username;
        if (!finalUsername && first_name && last_name) {
          // Convert Hebrew/non-ASCII characters to ASCII or use email
          const emailPrefix = primaryEmail.split("@")[0];
          finalUsername = emailPrefix || `user_${id.slice(-6)}`;
        } else if (!finalUsername) {
          finalUsername = `user_${id.slice(-6)}`;
        }

        // Get the best available image
        const avatarUrl = profile_image_url || image_url || "";

        await UserModel.create({
          clerkId: id,
          username: finalUsername,
          email: primaryEmail,
          displayName: finalUsername,
          about: "",
          socialLinks: [],
          isMature: false,
          isModerator: false,
          avatarUrl: avatarUrl,
          bannerUrl: "",
          karma: {
            post: 0,
            comment: 0,
          },
          gender: "unspecified",
        });
        break;
      }

      case "user.updated": {
        const {
          id,
          username,
          first_name,
          last_name,
          image_url,
          profile_image_url,
          email_addresses,
        } = webhookEvent.data;

        // Get primary email address
        const primaryEmail =
          email_addresses?.find(
            (email: any) =>
              email.id === webhookEvent.data.primary_email_address_id
          )?.email_address ||
          email_addresses?.[0]?.email_address ||
          "";

        // Create a username from available data
        let finalUsername = username;
        if (!finalUsername && first_name && last_name) {
          const emailPrefix = primaryEmail.split("@")[0];
          finalUsername = emailPrefix || `user_${id.slice(-6)}`;
        } else if (!finalUsername) {
          finalUsername = `user_${id.slice(-6)}`;
        }

        // Get the best available image
        const avatarUrl = profile_image_url || image_url || "";

        await UserModel.findOneAndUpdate(
          { clerkId: id },
          {
            username: finalUsername,
            email: primaryEmail,
            displayName: finalUsername,
            avatarUrl: avatarUrl,
          },
          { new: true }
        );
        break;
      }

      case "user.deleted": {
        const { id } = webhookEvent.data;

        await UserModel.findOneAndDelete({ clerkId: id });
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
