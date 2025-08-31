import { Document, Schema, model, ObjectId } from "mongoose";

interface IUser extends Document {
  _id: ObjectId;
  username: string; // unique
  email: string;
  isModerator: boolean;
  password: string; // or Clerk ID if using Clerk
  avatarUrl: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
    isModerator: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
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
