import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Kamal Studios" },
      { name: "description", content: "Read verified Google reviews from Kamal Studios clients." },
    ],
  }),
  component: Reviews,
});

const reviews = [
  { n: "Rohan Mehta", d: "3 weeks ago", q: "From consultation to delivery, everything was flawless. The final film brought us to tears." },
  { n: "Nisha Rao", d: "2 months ago", q: "Our maternity shoot was intimate and beautifully lit. The team made me feel comfortable throughout." },
  { n: "Ananya Kapoor", d: "1 month ago", q: "They photographed both my wedding and my daughter's first birthday. A studio you trust for a lifetime." },
  { n: "Vikram Enterprises", d: "5 weeks ago", q: "Our go-to for every campaign. Consistent, calm, and consistently premium." },
  { n: "Simran & Arjun", d: "1 week ago", q: "The album is a masterpiece. Every page feels like a page from a coffee-table book." },
  { n: "Devika Nair", d: "6 months ago", q: "The team travelled to Bali for our destination wedding and delivered beyond expectations." },
];

function Reviews() {
  const { settings } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="pt-40 pb-16">
        <div className="container-lux flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="kbd-eyebrow text-[color:var(--gold)]">Reviews</div>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">In their words.</h1>
          </div>
          <div className="text-right">
            <div className="font-display text-6xl">{settings.stats.rating}</div>
            <div className="flex justify-end text-[color:var(--gold)] mt-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
            </div>
            <div className="text-xs text-muted-foreground">{settings.stats.reviews}+ Google reviews</div>
          </div>
        </div>
      </section>

      <section className="container-lux pb-24 grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <figure key={r.n} className="border border-border p-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-medium">{r.n.charAt(0)}</div>
              <div>
                <div className="font-medium text-sm">{r.n}</div>
                <div className="text-xs text-muted-foreground">{r.d}</div>
              </div>
              <div className="ml-auto flex text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
              </div>
            </div>
            <blockquote className="mt-4 text-muted-foreground leading-relaxed">&ldquo;{r.q}&rdquo;</blockquote>
          </figure>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
