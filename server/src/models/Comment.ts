import { Document, Schema, model, ObjectId } from "mongoose";

export interface IComment extends Document {
  postId: ObjectId;
  authorId: ObjectId;
  content: string;
  parentId?: ObjectId; // for nested comments
  votes: number;
  createdAt: Date;
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
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  votes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
