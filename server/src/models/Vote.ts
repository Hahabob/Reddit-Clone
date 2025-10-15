import { Schema, model, Document, ObjectId } from "mongoose";

export interface IVote extends Document {
  _id: ObjectId;
  userId: ObjectId; // Who voted
  postId?: ObjectId; // If vote is on a post
  commentId?: string; // If vote is on a comment
  value: 1 | -1; // 1 = upvote, -1 = downvote
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a user can only vote once per post or comment
// Use partial indexes to only apply uniqueness when the field exists (not null)
voteSchema.index(
  { userId: 1, postId: 1 },
  {
    unique: true,
    partialFilterExpression: { postId: { $type: "objectId" } },
  }
);
voteSchema.index(
  { userId: 1, commentId: 1 },
  {
    unique: true,
    partialFilterExpression: { commentId: { $type: "objectId" } },
  }
);

const VoteModel = model<IVote>("Vote", voteSchema);

export default VoteModel;
