import { blogRepository } from "@/features/blog/repositories/blogRepository";
import type { BlogPost } from "@/content/blogPosts";

const sortByNewest = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const blogService = {
  getPosts(): BlogPost[] {
    return sortByNewest(blogRepository.findAll());
  },

  getPostBySlug(slug: string): BlogPost | undefined {
    return blogRepository.findBySlug(slug);
  },

  getDefaultPost(): BlogPost | undefined {
    return this.getPosts()[0];
  },
};
