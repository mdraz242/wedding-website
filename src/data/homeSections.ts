import { img } from "@/lib/site";

export interface WhyUsItem {
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface HomeSectionsConfig {
  hero: {
    title_part1: string;
    title_part2: string;
    subtitle: string;
    btn_primary_text: string;
    btn_secondary_text: string;
    videos?: string[];
  };
  featured_services: {
    eyebrow: string;
    heading: string;
  };
  why_us: {
    eyebrow: string;
    heading: string;
    image_url: string;
    items: WhyUsItem[];
  };
  portfolio_preview: {
    eyebrow: string;
    heading: string;
  };
  films_section: {
    eyebrow: string;
    heading: string;
  };
  google_reviews: {
    eyebrow: string;
    heading: string;
  };
  process_section: {
    eyebrow: string;
    heading: string;
    steps: string[];
  };
  service_areas_section: {
    eyebrow: string;
    heading: string;
    paragraph: string;
  };
  faq_section: {
    eyebrow: string;
    heading: string;
    faqs: FAQItem[];
  };
  final_cta: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    background_image: string;
    btn_primary_text: string;
  };
}

export const defaultHomeSections: HomeSectionsConfig = {
  hero: {
    title_part1: "Every moment,",
    title_part2: "preserved for a lifetime.",
    subtitle: "A photography and cinematography atelier trusted for six decades.",
    btn_primary_text: "Book Now",
    btn_secondary_text: "View Portfolio",
  },
  featured_services: {
    eyebrow: "Signature services",
    heading: "Craft, across every occasion.",
  },
  why_us: {
    eyebrow: "Why Kamal Studios",
    heading: "The atelier behind the frame.",
    image_url: img.studio,
    items: [
      { title: "Experienced photographers", desc: "Six decades of accumulated craft." },
      { title: "Cinematic post-production", desc: "Colour-graded for cinema, not for feeds." },
      { title: "Fine-art heirloom albums", desc: "Italian-bound, archival, hand-designed." },
      { title: "Certified drone operators", desc: "DGCA-certified, cinema-grade rigs." },
      { title: "Destination-ready crew", desc: "Airline-tested logistics, anywhere." },
      { title: "Fast, curated delivery", desc: "Sneak peek in 72h, full gallery in 14 days." },
      { title: "A single point of contact", desc: "One producer, from consult to delivery." },
      { title: "Latest cameras & optics", desc: "Continuously refreshed, always insured." },
    ],
  },
  portfolio_preview: {
    eyebrow: "Selected work",
    heading: "A quiet portfolio.",
  },
  films_section: {
    eyebrow: "Cinematic films",
    heading: "Films that play like memory.",
  },
  google_reviews: {
    eyebrow: "Google reviews",
    heading: "loved by families across generations.",
  },
  process_section: {
    eyebrow: "Our process",
    heading: "Unhurried, considered, delivered.",
    steps: ["Consultation", "Planning", "Photography", "Editing", "Delivery", "Memories forever"],
  },
  service_areas_section: {
    eyebrow: "Service areas",
    heading: "A studio without borders.",
    paragraph: "Headquartered in Chandigarh, working across India and the world. Destination-ready with a self-contained crew.",
  },
  faq_section: {
    eyebrow: "FAQ",
    heading: "Answers, before you ask.",
    faqs: [
      { q: "How far in advance should I book?", a: "For weddings, 6–9 months for peak dates. For portraits and commercial work, 3–4 weeks is comfortable." },
      { q: "Do you travel for destination weddings?", a: "Yes — we shoot destination weddings across India and internationally with a self-contained crew and producer." },
      { q: "When do we receive our photos and film?", a: "A sneak peek arrives in 72 hours, the full curated gallery in 14 days, and the highlight film within 4–6 weeks." },
      { q: "Can I customise a package?", a: "Absolutely — every engagement begins with a consultation to shape a package around your day." },
      { q: "Do you offer photo albums?", a: "Yes — hand-designed, Italian-bound, archival fine-art albums, printed on giclée papers." },
    ],
  },
  final_cta: {
    eyebrow: "Begin",
    heading: "Book your shoot today.",
    paragraph: "Every celebrated wedding, every heirloom portrait, every campaign — it starts with a conversation.",
    background_image: img.destination,
    btn_primary_text: "Book consultation",
  },
};
