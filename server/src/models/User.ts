import { Document, Schema, model, ObjectId } from "mongoose";

interface IUser extends Document {
  _id: ObjectId;
  clerkId: string;
  username: string; // unique cant ve changed
  email: string; // user's email from Clerk
  displayName?: string;
  about?: string;
  socialLinks?: string[];
  isMature: boolean; //marks profile as nsfw defaults to false
  isModerator: boolean; // false default , changes to true the moment you create a subreddit or get promoted to moderator
  avatarUrl?: string;
  bannerUrl?: string;
  karma: {
    post: number;
    comment: number;
  };
  gender: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
    },
    about: {
      type: String,
    },
    socialLinks: {
      type: [String],
      default: [],
    },
    isMature: {
      type: Boolean,
      default: false,
    },
    isModerator: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
    },
    bannerUrl: {
      type: String,
    },
    karma: {
      post: { type: Number, default: 0 },
      comment: { type: Number, default: 0 },
    },
    gender: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = model<IUser>("User", userSchema);

export default User;
