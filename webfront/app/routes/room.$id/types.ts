// Shared types for the forum components
export interface Post {
  id: string;
  number: string;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
  image?: string;
  avatar?: string;
  messageType?: 'text' | 'image' | 'system';
  dialect_type?: 'kansai' | 'space' | 'normal';
}

export interface PostProps {
  post: Post;
}

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date;
  messageType: 'text' | 'image' | 'system';
  seenBy?: string[];
  dialect_type?: 'kansai' | 'space' | 'normal';
}