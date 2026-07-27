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
  id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null;
  content: string; category: string | null; author: string | null; published_at: string | null;
};

function Post() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle().then(({ data }) => setPost((data as Post) ?? null));
  }, [slug]);

  if (post === undefined) return <div className="min-h-screen bg-background" />;
  if (post === null) throw notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <article className="pt-40 pb-24 container-lux max-w-3xl">
        <div className="kbd-eyebrow text-[color:var(--gold)]">{post.category ?? "Journal"}</div>
        <h1 className="mt-4 font-display text-4xl md:text-6xl">{post.title}</h1>
        <div className="mt-4 text-sm text-muted-foreground">
          {post.author} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
        </div>
        {post.cover_url && (
          <div className="mt-10 aspect-[16/9] overflow-hidden bg-black">
            <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        {post.excerpt && <p className="mt-10 text-lg text-muted-foreground italic">{post.excerpt}</p>}
        <div className="mt-8 prose prose-invert max-w-none whitespace-pre-wrap text-base leading-relaxed">
          {post.content}
        </div>
        <div className="mt-16">
          <Link to="/blog" className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] hover:underline">← All posts</Link>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="pt-40 pb-24 container-lux text-center">
        <h1 className="font-display text-5xl">Post not found</h1>
        <p className="mt-4 text-muted-foreground">This story may have moved.</p>
        <Link to="/blog" className="mt-8 inline-block text-[color:var(--gold)]">← All posts</Link>
      </div>
      <SiteFooter />
    </div>
  );
}
function ErrorState() { return <NotFoundState />; }
