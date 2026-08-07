import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, Send } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { services } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Kamal Studios — Book a Consultation" },
      { name: "description", content: "Enquire about weddings, portraits, commercial and cinematic productions. Reach us on WhatsApp, phone, or by form." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { settings, getPageSEO } = useSiteContent();
  const page = getPageSEO("contact");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const f = new FormData(e.currentTarget);
    const payload = {
      name: String(f.get("name") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      phone: String(f.get("phone") ?? "").trim() || null,
      service: String(f.get("service") ?? "") || null,
      event_date: (String(f.get("date") ?? "") || null) as string | null,
      message: [
        String(f.get("message") ?? "").trim(),
        f.get("location") ? `Location: ${f.get("location")}` : "",
        f.get("budget") ? `Budget: ${f.get("budget")}` : "",
      ].filter(Boolean).join("\n"),
      status: "new",
    };
    if (!payload.name || !payload.email || !payload.message) {
      setErr("Please fill name, email and a message.");
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("enquiries").insert(payload);
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="pt-40 pb-24">
        <div className="container-lux grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="kbd-eyebrow text-[color:var(--gold)]">Get in touch</div>
            <h1 className="mt-4 font-display text-5xl md:text-6xl leading-[1.1]">
              {page.heading || "Begin the conversation."}
            </h1>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              {page.subheading || "Tell us a little about your day, we'll respond within 24 hours with a curated proposal."}
            </p>

            <ul className="mt-10 space-y-4 text-sm">
              <li className="flex gap-3"><Phone className="size-4 mt-1 text-[color:var(--gold)]" /> <a href={`tel:${settings.phoneRaw}`}>{settings.phone}</a></li>
              <li className="flex gap-3"><MessageCircle className="size-4 mt-1 text-[color:var(--gold)]" /> <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li className="flex gap-3"><Mail className="size-4 mt-1 text-[color:var(--gold)]" /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li className="flex gap-3"><MapPin className="size-4 mt-1 text-[color:var(--gold)]" /> {settings.address}</li>
            </ul>

            <div className="mt-10 border border-border p-6 bg-secondary/40 rounded-sm">
              <div className="kbd-eyebrow text-[color:var(--gold)]">Studio hours</div>
              <div className="mt-2 text-sm">{settings.hours}</div>
            </div>
          </div>

          <div className="md:col-span-7">
            {sent ? (
              <div className="border border-[color:var(--gold)] p-10 text-center rounded-sm">
                <div className="font-display text-3xl">Thank you.</div>
                <p className="mt-3 text-muted-foreground">Your enquiry has landed. Expect a personal reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 border border-border p-8 bg-card rounded-sm">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Your name" name="name" required />
                  <Field label="Phone / WhatsApp" name="phone" />
                </div>
                <Field label="Email" name="email" type="email" required />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="kbd-eyebrow text-muted-foreground">Service</label>
                    <select name="service" className="bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]">
                      {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <Field label="Preferred date" name="date" type="date" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Location" name="location" />
                  <Field label="Approx. budget (INR)" name="budget" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="kbd-eyebrow text-muted-foreground">Tell us about your day</label>
                  <textarea name="message" rows={5} required className="bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]" />
                </div>
                {err && <div className="text-xs text-destructive">{err}</div>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
                >
                  <Send className="size-4" /> {busy ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="kbd-eyebrow text-muted-foreground">{label}</label>
      <input {...rest} className="bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]" />
    </div>
  );
}
