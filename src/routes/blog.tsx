import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { img } from "@/lib/site";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Kamal Studios" },
      { name: "description", content: "Notes on photography, weddings, cinema and craft from the Kamal Studios team." },
    ],
  }),
  component: Blog,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string | null;
};

const fallback = [
  { slug: "destination-wedding-shoot", title: "How to plan a destination wedding shoot", published_at: "2026-11-12", category: "Weddings", cover_url: img.destination, excerpt: "A step-by-step guide from consult to delivery." },
  { slug: "pre-wedding-locations-india", title: "Choosing a pre-wedding location in India", published_at: "2026-11-02", category: "Pre-wedding", cover_url: img.couple2, excerpt: "From Rajasthan palaces to Kerala backwaters." },
  { slug: "fine-art-albums", title: "Why fine-art albums matter", published_at: "2026-10-20", category: "Albums", cover_url: img.bridal, excerpt: "The case for something you can hold." },
  { slug: "newborn-safety", title: "Newborn safety on set", published_at: "2026-10-10", category: "Baby", cover_url: img.baby, excerpt: "How our team keeps newborns safe and calm." },
  { slug: "kamal-colour-grade", title: "The Kamal Studios colour grade", published_at: "2026-09-28", category: "Craft", cover_url: img.studio, excerpt: "A quiet, cinematic look built over six decades." },
  { slug: "drone-permissions-india-2026", title: "Drone permissions in India — 2026 guide", published_at: "2026-09-12", category: "Drone", cover_url: img.drone, excerpt: "Everything you need to know before your shoot." },
];

function Blog() {
  const { getPageSEO } = useSiteContent();
  const page = getPageSEO("blog");
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,category,published_at,published")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        let dbList: Post[] = (data as unknown as Post[]) ?? [];
        let localPosts: Post[] = [];
        let deletedKeys = new Set<string>();
        try {
          const l = localStorage.getItem("ks_custom_blog_posts");
          if (l) localPosts = JSON.parse(l);
          const d = localStorage.getItem("ks_custom_deleted_blog_posts");
          if (d) deletedKeys = new Set(JSON.parse(d));
        } catch {}

        const map = new Map<string, Post>();
        for (const p of dbList) {
          const k = p.slug || p.id;
          if (k && !deletedKeys.has(k) && !deletedKeys.has(p.id)) {
            map.set(k, p);
          }
        }
        for (const p of localPosts) {
          if (p.published === false) continue;
          const k = p.slug || p.id;
          if (k && !deletedKeys.has(k) && !deletedKeys.has(p.id)) {
            map.set(k, p);
          }
        }
        setPosts(Array.from(map.values()));
      })
      .catch(() => {
        try {
          const l = localStorage.getItem("ks_custom_blog_posts");
          const d = localStorage.getItem("ks_custom_deleted_blog_posts");
          const deletedKeys = d ? new Set(JSON.parse(d)) : new Set<string>();
          if (l) {
            const localPosts: Post[] = JSON.parse(l);
            setPosts(localPosts.filter((p) => p.published !== false && !deletedKeys.has(p.slug) && !deletedKeys.has(p.id)));
          } else {
            setPosts([]);
          }
        } catch {
          setPosts([]);
        }
      });
  }, []);

  const list = useMemo(() => {
    if (posts && posts.length > 0) return posts;
    try {
      const l = localStorage.getItem("ks_custom_blog_posts");
      const d = localStorage.getItem("ks_custom_deleted_blog_posts");
      const deletedKeys = d ? new Set(JSON.parse(d)) : new Set<string>();
      if (l) {
        const localPosts: Post[] = JSON.parse(l);
        const pub = localPosts.filter((p: any) => p.published !== false && !deletedKeys.has(p.slug) && !deletedKeys.has(p.id));
        if (pub.length > 0) return pub;
      }
    } catch {}
    return fallback;
  }, [posts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="pt-40 pb-16">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Journal</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">{page.heading || "Notes from the atelier."}</h1>
          <p className="mt-4 text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
            {page.subheading || "Insights on wedding planning, venue selection, photography craft, and heritage fashion."}
          </p>
        </div>
      </section>

      <section className="container-lux pb-24 grid gap-8 md:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block border border-border bg-card rounded-sm overflow-hidden p-4">
            <div className="aspect-[4/5] overflow-hidden bg-black rounded-sm">
              {p.cover_url && <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />}
            </div>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground uppercase tracking-[0.22em]">{p.category} · {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
              <div className="mt-2 font-display text-2xl group-hover:text-[color:var(--gold)] transition-colors">{p.title}</div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-[color:var(--gold)] font-medium">Read Article</div>
            </div>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
