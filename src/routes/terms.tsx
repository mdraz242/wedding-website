import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Kamal Studios" }, { name: "description", content: "Terms and conditions governing engagement with Kamal Studios." }] }),
  component: Terms,
});

function Terms() {
  const { settings } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <article className="pt-40 pb-24 container-lux max-w-3xl">
        <div className="kbd-eyebrow text-[color:var(--gold)]">Legal</div>
        <h1 className="mt-4 font-display text-5xl">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: 18 July 2026</p>

        <div className="mt-10 space-y-6 text-foreground/90 leading-relaxed">
          <p>By engaging {settings.name} ("we", "us"), you agree to the terms below. These terms sit alongside the specific proposal or invoice issued for your engagement, which take precedence where they differ.</p>

          <h2 className="font-display text-2xl">Bookings & payment</h2>
          <p>A booking is confirmed once we receive a signed proposal and a 30% retainer. The remaining balance is due before the delivery of final files, unless stated otherwise in your proposal.</p>

          <h2 className="font-display text-2xl">Cancellations</h2>
          <p>Retainers are non-refundable but may be transferred to a rescheduled date within 12 months, subject to availability.</p>

          <h2 className="font-display text-2xl">Copyright & usage</h2>
          <p>All photographs and films remain the intellectual property of {settings.name}. Clients receive an unlimited personal-use licence. Commercial use requires a separate agreement.</p>

          <h2 className="font-display text-2xl">Portfolio</h2>
          <p>We may use select images from your engagement in our portfolio and social channels unless you request otherwise in writing at the time of booking.</p>

          <h2 className="font-display text-2xl">Delivery timelines</h2>
          <p>Standard delivery windows are 14 days for photographs and 4–6 weeks for films from the shoot date, subject to complexity.</p>

          <h2 className="font-display text-2xl">Liability</h2>
          <p>Our maximum liability in any circumstance is limited to the amount paid for the specific engagement. We are not liable for indirect or consequential losses.</p>

          <h2 className="font-display text-2xl">Governing law</h2>
          <p>These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts of {settings.address.split(",")[2]?.trim() || "Chandigarh"}.</p>

          <h2 className="font-display text-2xl">Contact</h2>
          <p>{settings.name} · {settings.address} · {settings.email} · {settings.phone}</p>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
