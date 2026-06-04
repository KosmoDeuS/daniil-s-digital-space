import { NavLink, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { blogService } from "@/features/blog/services/blogService";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/NotFound";

const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const BlogPage = () => {
  const { slug } = useParams();
  const posts = blogService.getPosts();
  const selectedPost = slug ? blogService.getPostBySlug(slug) : blogService.getDefaultPost();

  if (!selectedPost) {
    return <NotFound />;
  }

  return (
    <main className="px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 font-mono-display text-sm uppercase tracking-wider text-primary">Personal Blog</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="self-start rounded-xl border border-border bg-card/80 p-2 lg:sticky lg:top-24">
            <div className="px-3 py-2">
              <p className="font-mono-display text-xs uppercase tracking-wider text-muted-foreground">Posts</p>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {posts.map((post) => {
                const isSelected = post.slug === selectedPost.slug;

                return (
                  <NavLink
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className={({ isActive }) =>
                      cn(
                        "min-w-[250px] rounded-lg border border-transparent px-3 py-3 text-left transition-colors lg:min-w-0",
                        "hover:border-border hover:bg-secondary/70",
                        (isActive || isSelected) && "border-primary/40 bg-secondary text-foreground",
                      )
                    }
                  >
                    <span className="block text-sm font-medium leading-snug">{post.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{formatPostDate(post.date)}</span>
                    <span className="mt-2 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          <article className="overflow-hidden rounded-xl border border-border bg-card/80">
            <img
              src={selectedPost.image}
              alt={selectedPost.imageAlt}
              className="h-auto w-full border-b border-border bg-secondary object-contain"
            />
            <div className="p-5 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={16} className="text-primary" />
                <time dateTime={selectedPost.date}>{formatPostDate(selectedPost.date)}</time>
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">{selectedPost.title}</h2>
              <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted-foreground">{selectedPost.excerpt}</p>
              <div className="space-y-5 text-sm leading-7 text-foreground/90 sm:text-base sm:leading-8">
                {selectedPost.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
