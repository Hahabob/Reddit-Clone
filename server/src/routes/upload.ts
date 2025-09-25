import { Router } from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary";

const router = Router();

// Use in-memory storage; we will stream buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64 data URI for Cloudinary upload
    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "reddit-clone/uploads",
      resource_type: "image",
    });

    return res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error", error);
    return res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
