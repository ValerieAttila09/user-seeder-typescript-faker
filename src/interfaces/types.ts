export interface Post {
  id: string;
  title: string;
  tag: string;
  content: string;
  createdAt: Date,
  publishedBy: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  posts: Post[];
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}