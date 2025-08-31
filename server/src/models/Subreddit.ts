import { Document, Schema, model, ObjectId } from "mongoose";

interface ISubreddit extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  moderators: ObjectId[];
  members: ObjectId[];
  createdAt: Date;
}

const subredditSchema = new Schema<ISubreddit>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    moderators: [
      {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    members: [
      {
        type: Schema.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Subreddit = model<ISubreddit>("User", subredditSchema);
export default Subreddit;
