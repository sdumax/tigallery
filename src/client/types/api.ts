// API Response Types
export interface UnsplashImage {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface Comment {
  id: number;
  imageId: string;
  userId: number | null;
  content: string;
  createdAt: string;
}

export interface Like {
  id: number;
  imageId: string;
  userId: number;
  createdAt: string;
}

export interface LikesResponse {
  likes: Like[];
  count: number;
  isLiked: boolean;
}

// Request Types
export interface SearchImagesParams {
  query: string;
  page?: number;
}

export interface GetImagesParams {
  page?: number;
  perPage?: number;
}

export interface CreateCommentData {
  userId: number;
  content: string;
}

export interface LikeImageData {
  userId: number;
}

// Transformed Types for UI
export interface Pin {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
}
