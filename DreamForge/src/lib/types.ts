// src/lib/types.ts

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export type ProductIdea = {
  id: string;
  created_at: string;
  product_name: string; // <-- title yerine product_name kullanıldı
  description: string;
  category: string;
  funding_goal: number;
  timeline: string;
  photo_url?: string;
  user_id: string;
  
  // İlişkisel veriler ve yeni eklenen sütunlar
  profiles?: User;
  upvote_count: number; // <-- ? kaldırıldı
  status: 'voting' | 'in_production';
  
  // Diğer tablolarla olan ilişkiler
  comments?: Comment[];
  preorders?: Preorder[];
  votes?: Vote[];
};

export type Comment = {
  id: string;
  created_at: string;
  text: string;
  idea_id: string;
  user_id: string;
  author?: User;
};

export type Preorder = {
  id: string;
  created_at: string;
  idea_id: string;
  user_id: string;
  amount: number;
};

export type Vote = {
  id: string;
  created_at: string;
  idea_id: string;
  user_id: string;
  vote_type: 'upvote';
};