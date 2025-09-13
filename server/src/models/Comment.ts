import { Document, Schema, model, ObjectId } from "mongoose";

export interface IComment extends Document {
  _id: ObjectId;
  postId: ObjectId;
  authorId: ObjectId;
  content: string;
  score: number;
  parentId?: ObjectId; // for nested comments
  createdAt: Date;
  isDeleted: boolean;
  isRemoved: boolean;
}

const commentSchema: Schema<IComment> = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: { type: Boolean, default: false },
  isRemoved: { type: Boolean, default: false },
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
