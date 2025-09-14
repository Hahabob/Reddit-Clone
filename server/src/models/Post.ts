import { Document, Schema, model, ObjectId } from "mongoose";

//todo make topics field, on post creation inherits topics from community.
export type PostContent =
  | { type: "text"; text: string }
  | { type: "image"; url: string; altText?: string }
  | { type: "video"; url: string; duration?: number; thumbnailUrl?: string }
  | { type: "link"; url: string; title?: string; description?: string }
  | {
      type: "poll";
      question: string;
      options: { text: string; votes: number }[];
      duration: number;
    }
  | {
      type: "mixed";
      text?: string;
      images?: { url: string; altText?: string }[];
      links?: { url: string; title?: string }[];
    };

export interface IPost extends Document {
  _id: ObjectId;
  subredditId: ObjectId;
  authorId: ObjectId;
  title: string;
  content: PostContent;
  score: number;
  isNSFW: boolean;
  isSpoiler: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  isRemoved: boolean;
  isLocked: boolean;
  isCrosspostable: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const optionSchema = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const imageSchema = new Schema({
  url: { type: String, required: true },
  altText: { type: String },
});

const linkSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  description: { type: String },
});

const postContentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "video", "link", "poll", "mixed"],
    },
    text: { type: String },
    images: [imageSchema],
    links: [linkSchema],
    url: { type: String },
    altText: { type: String },
    thumbnailUrl: { type: String },
    duration: { type: Number },
    question: { type: String },
    options: [optionSchema],
  },
  { _id: false }
);

const postSchema: Schema<IPost> = new Schema(
  {
    subredditId: {
      type: Schema.Types.ObjectId,
      ref: "Subreddit",
      required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: postContentSchema, required: true },
    score: { type: Number, required: true, default: 0 },
    isNSFW: { type: Boolean, default: false },
    isSpoiler: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    isCrosspostable: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
