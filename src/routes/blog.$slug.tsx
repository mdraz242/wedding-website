import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Kamal Studios Journal` },
    ],
  }),
  component: Post,
  errorComponent: () => <ErrorState />,
  notFoundComponent: () => <NotFoundState />,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string;
  category: string | null;
  author: string | null;
  published_at: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  tags?: string;
};

function Post() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    let deletedKeys = new Set<string>();
    try {
      const d = localStorage.getItem("ks_custom_deleted_blog_posts");
      if (d) deletedKeys = new Set(JSON.parse(d));
    } catch {}

    const norm = (s: string) => {
      if (!s) return "";
      try {
        s = decodeURIComponent(s);
      } catch {}
      return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    };

    const reqSlug = norm(slug);

    if (deletedKeys.has(reqSlug) || deletedKeys.has(slug)) {
      setPost(null);
      return;
    }

    try {
      const l = localStorage.getItem("ks_custom_blog_posts");
      if (l) {
        const localPosts: Post[] = JSON.parse(l);
        const found = localPosts.find(
          (p) => norm(p.slug) === reqSlug || norm(p.title) === reqSlug || p.id === slug || p.slug === slug
        );
        if (found) {
          if (found.id && deletedKeys.has(found.id)) {
            setPost(null);
            return;
          }
          setPost(found);
          return;
        }
      }
    } catch {}

    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data && !deletedKeys.has(data.id) && !deletedKeys.has(data.slug)) {
          setPost(data as Post);
        } else {
          setPost(null);
        }
      })
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) return <div className="min-h-screen bg-background" />;
  if (post === null) throw notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <article className="pt-40 pb-24 container-lux max-w-3xl">
        <div className="kbd-eyebrow text-[color:var(--gold)]">{post.category ?? "Journal"}</div>
        <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.1]">{post.title}</h1>
        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between border-y border-border py-3">
          <span>By {post.author || "Kamal Studios"}</span>
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
        </div>

        {post.cover_url && (
          <div className="mt-8 aspect-[16/9] overflow-hidden bg-black rounded-sm">
            <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {post.excerpt && <p className="mt-8 text-lg text-muted-foreground italic leading-relaxed">{post.excerpt}</p>}

        <div className="mt-8 prose prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
          {post.content}
        </div>

        {post.tags && (
          <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="text-[color:var(--gold)] font-medium">Tags:</span>
            {post.tags.split(",").map((t, i) => (
              <span key={i} className="bg-card px-2.5 py-1 border border-border rounded-sm">
                #{t.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link to="/blog" className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] hover:underline font-medium">
            ← Back to all journal articles
          </Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="pt-40 pb-24 container-lux text-center">
        <h1 className="font-display text-5xl">Post not found</h1>
        <p className="mt-4 text-muted-foreground">This story may have moved.</p>
        <Link to="/blog" className="mt-8 inline-block text-[color:var(--gold)]">← Back to blog</Link>
      </div>
      <SiteFooter />
    </div>
  );
}
function ErrorState() { return <NotFoundState />; }
