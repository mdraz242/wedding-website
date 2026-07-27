import { createFileRoute } from "@tanstack/react-router";
import { Play, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { img } from "@/lib/site";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/films")({
  head: () => ({
    meta: [
      { title: "Cinematic Films — Kamal Studios" },
      { name: "description", content: "Wedding trailers, highlight films and cinematic productions by Kamal Studios." },
    ],
  }),
  component: Films,
});

const films = [
  { title: "A Palace Wedding · Udaipur", cover: img.destination },
  { title: "The Kaur & Singh Wedding", cover: img.couple3 },
  { title: "Aarav + Meera · Highlight", cover: img.couple2 },
  { title: "Campaign Film · Sona Jewels", cover: img.fashion },
  { title: "Baby Aanya's First Year", cover: img.baby },
  { title: "Corporate Anthem · Vayu Group", cover: img.corporate },
];

function Films() {
  const { settings } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="pt-40 pb-16">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Films</div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">Films that play like memory.</h1>
        </div>
      </section>

      <section className="container-lux pb-24 grid gap-6 md:grid-cols-2">
        {films.map((f) => (
          <a
            key={f.title}
            href={settings.social.youtube}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-video overflow-hidden bg-black block"
          >
            <img src={f.cover} alt={f.title} className="h-full w-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-16 rounded-full bg-[color:var(--gold)]/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="size-6 ml-1 fill-current" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
              <div className="font-display text-2xl">{f.title}</div>
              <ArrowUpRight className="size-5 text-[color:var(--gold)]" />
            </div>
          </a>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
