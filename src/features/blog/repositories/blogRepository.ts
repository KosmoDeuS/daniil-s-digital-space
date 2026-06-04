import { blogPosts, type BlogPost } from "@/content/blogPosts";

export const blogRepository = {
  findAll(): BlogPost[] {
    return [...blogPosts];
  },

  findBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
  },
};
