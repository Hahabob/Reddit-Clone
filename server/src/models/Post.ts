import { Document, Schema, model, ObjectId } from "mongoose";

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
  communityId: ObjectId;
  authorId: ObjectId;
  title: string;
  content: PostContent;
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
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: postContentSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
