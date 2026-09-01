import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  categoryName?: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  published: boolean;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: Date;
}

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  comments: Comment[];
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setComments: (comments: Comment[]) => void;
  setLoading: (loading: boolean) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: [],
      currentPost: null,
      comments: [],
      loading: false,
      setPosts: (posts) => set({ posts }),
      setCurrentPost: (post) => set({ currentPost: post }),
      setComments: (comments) => set({ comments }),
      setLoading: (loading) => set({ loading }),
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),
      updatePost: (id, data) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...data } : p)),
          currentPost:
            state.currentPost?.id === id
              ? { ...state.currentPost, ...data }
              : state.currentPost,
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      likePost: (id) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, likes: p.likes + 1 } : p
          ),
        })),
    }),
    {
      name: "blog-ghar-storage",
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
      }),
    }
  )
);
