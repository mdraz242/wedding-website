import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Camera, Users, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { img } from "@/lib/site";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Kamal Studios — Six Decades of Craft" },
      { name: "description", content: "Founded in 1966, Kamal Studios is one of India's most respected photography and cinematography ateliers." },
      { property: "og:image", content: img.studio },
    ],
  }),
  component: About,
});

function About() {
  const { settings, getPageSEO } = useSiteContent();
  const page = getPageSEO("about");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="pt-40 pb-24">
        <div className="container-lux grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <div className="kbd-eyebrow text-[color:var(--gold)]">About the atelier</div>
            <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[1.08]">
              {page.heading || "Six decades of light, shadow & emotion."}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              {page.body_text || "Founded in Chandigarh, Kamal Studios has photographed three generations of India's most celebrated families and brands."}
            </p>
          </div>
          <img src={page.hero_image || img.studio} alt="Kamal Studios team" className="md:col-span-6 aspect-[4/3] object-cover rounded-sm" />
        </div>
      </section>

      <section className="py-24 bg-[color:var(--ink)] text-white">
        <div className="container-lux grid md:grid-cols-4 gap-10">
          {([
            [Camera, "Craft", "We shoot for the archive, not the algorithm."],
            [Users, "Care", "One producer, from consult to delivery."],
            [Sparkles, "Cinema", "Every film graded for cinema, delivered in 4K."],
            [Award, "Legacy", "Six decades. Three generations. One studio."],
          ] as const).map(([Icon, title, desc]) => (
            <div key={title}>
              <Icon className="size-6 text-[color:var(--gold)]" />
              <div className="font-display text-2xl mt-4">{title}</div>
              <p className="text-white/60 mt-2 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-lux">
          <div className="kbd-eyebrow text-[color:var(--gold)]">Timeline</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Six decades in six moments.</h2>
          <ol className="mt-12 space-y-8">
            {[
              ["1966", "Kamal Studios opens on Chandigarh's Sector 17 promenade."],
              ["1982", "First national editorial commission for a leading fashion magazine."],
              ["1998", "Launches dedicated wedding cinematography division."],
              ["2011", "Opens fine-art album atelier with Italian binding partner."],
              ["2019", "Adds DGCA-certified drone cinematography."],
              ["2024", "Serves clients across 60+ cities and 15+ countries."],
            ].map(([y, t]) => (
              <li key={y} className="grid grid-cols-[100px_1fr] gap-6 items-baseline border-t border-border pt-6">
                <div className="font-display text-3xl text-[color:var(--gold)]">{y}</div>
                <div className="text-lg text-foreground">{t}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 bg-secondary/50 text-center">
        <div className="container-lux">
          <h2 className="font-display text-4xl md:text-6xl">Let's create your archive.</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors">
            Begin the conversation
          </Link>
          <div className="mt-4 text-sm text-muted-foreground">or call <a href={`tel:${settings.phoneRaw}`} className="underline hover-gold">{settings.phone}</a></div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
