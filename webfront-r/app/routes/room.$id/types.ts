// Shared types for the forum components
export interface Post {
  id: number;
  number: string;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
  image?: string;
  avatar?: string;
}

export interface PostProps {
  post: Post;
}