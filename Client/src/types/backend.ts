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

export interface BackendPost {
  _id: string;
  subredditId: string | { _id: string; name: string };
  authorId: string;
  title: string;
  content: PostContent;
  topics: string[];
  score: number;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | 0; // Current user's vote on this post
  isNSFW: boolean;
  isSpoiler: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  isRemoved: boolean;
  isLocked: boolean;
  isCrosspostable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BackendSubreddit {
  _id: string;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  topics: string[];
  moderators: string[];
  members: string[];
  memberCount?: number;
  isNSFW: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendComment {
  _id: string;
  postId: string;
  authorId: string;
  content: string;
  score: number;
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | 0; // Current user's vote on this comment
  parentId?: string;
  replies?: BackendComment[];
  createdAt: string;
  isDeleted: boolean;
  isRemoved: boolean;
}

export interface BackendUser {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  displayName?: string;
  about?: string;
  socialLinks?: string[];
  isMature: boolean;
  isModerator: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  karma: {
    post: number;
    comment: number;
  };
  gender: string;
  createdAt: string;
  updatedAt?: string;
}
