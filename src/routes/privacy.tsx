import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Kamal Studios" }, { name: "description", content: "How Kamal Studios collects, uses and protects your information." }] }),
  component: Privacy,
});

function Privacy() {
  const { settings } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <article className="pt-40 pb-24 container-lux max-w-3xl prose prose-neutral">
        <div className="kbd-eyebrow text-[color:var(--gold)]">Legal</div>
        <h1 className="mt-4 font-display text-5xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: 18 July 2026</p>

        <div className="mt-10 space-y-6 text-foreground/90 leading-relaxed">
          <p>{settings.name} ("we", "us", "our") respects your privacy. This policy explains what information we collect when you visit {settings.domain} or engage our services, and how we use it.</p>

          <h2 className="font-display text-2xl">Information we collect</h2>
          <p>Name, phone, email, event details, and any files you share when you enquire, book, or use our services. We may also collect basic analytics (pages visited, device type) to improve the site.</p>

          <h2 className="font-display text-2xl">How we use your information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To respond to enquiries and manage bookings.</li>
            <li>To deliver photographs, films, and albums.</li>
            <li>To send occasional updates about our work (only with consent).</li>
          </ul>

          <h2 className="font-display text-2xl">Sharing</h2>
          <p>We do not sell your data. We share information only with trusted vendors (album printers, cloud gallery hosts) strictly to fulfil your engagement.</p>

          <h2 className="font-display text-2xl">Your photographs</h2>
          <p>We may showcase select images on our portfolio and social channels. If you'd prefer full privacy, tell us at the time of booking and we will honour it.</p>

          <h2 className="font-display text-2xl">Cookies</h2>
          <p>We use minimal cookies for analytics and to remember basic preferences. You can disable cookies in your browser at any time.</p>

          <h2 className="font-display text-2xl">Your rights</h2>
          <p>You can request access, correction, or deletion of your personal data by writing to <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>.</p>

          <h2 className="font-display text-2xl">Contact</h2>
          <p>{settings.name} · {settings.address} · {settings.email} · {settings.phone}</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
