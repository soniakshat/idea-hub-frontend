// src/types/Post.ts

export interface Post {
  _id: string;
  id: string;
  title: string;
  content: string;
  author: {
    id: string,
    name: string;
  };
  tags?: string[];
  business?: string[];
  status: string;
  timestamp: string;
  comments: { id: string; content: string; author: string; timestamp: string }[];
  likes: string[];
  resource: string;
}


