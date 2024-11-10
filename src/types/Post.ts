// src/types/Post.ts

export interface Post {
  _id: string;
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  tags?: string[];
  business?: string[];
  status: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isUpvoted: boolean;
  isDownvoted: boolean;
  comments: { id: string; content: string; author: string; timestamp: string }[];
}

