import { img } from "@/lib/site";

export interface PageSEOContent {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  tags: string;
  og_image?: string;
  heading?: string;
  subheading?: string;
  body_text?: string;
  hero_image?: string;
}

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "locations"
  | "portfolio"
  | "films"
  | "reviews"
  | "blog"
  | "contact"
  | "privacy"
  | "terms";

export const defaultPagesSEO: Record<PageKey, PageSEOContent> = {
  home: {
    meta_title: "Kamal Studios — Luxury Wedding & Cinematic Photography Since 1966",
    meta_description: "Kamal Studios is India's heritage photography and cinematography atelier. Six decades of luxury wedding, portrait, fashion and commercial imagery.",
    meta_keywords: "luxury wedding photography, indian wedding photographer, cinematic wedding films, destination wedding photography, chandigarh photographer",
    tags: "wedding, luxury, photography, cinematography, india",
    og_image: img.heroWedding,
    heading: "Every moment, preserved for a lifetime.",
    subheading: "A photography and cinematography atelier trusted for six decades.",
    body_text: "For six decades, Kamal Studios has photographed India's most celebrated weddings and heritage portraits. Our approach is quiet, considered and cinematic.",
  },
  about: {
    meta_title: "About Us — Kamal Studios | Six Decades of Artistry",
    meta_description: "Learn about the heritage, philosophy, and master photographers behind Kamal Studios. Over 60 years of photographic excellence.",
    meta_keywords: "about kamal studios, heritage wedding studio, top Indian photographers, studio history, sector 17 chandigarh",
    tags: "about, history, team, philosophy, heritage",
    og_image: img.studio,
    heading: "Six decades of light, shadow & emotion.",
    subheading: "Founded in 1966, built on uncompromised artistry and timeless elegance.",
    body_text: "Founded by master craftsmen in 1966, Kamal Studios has evolved from a classical portrait atelier into one of South Asia's premier luxury wedding and commercial visual houses.",
  },
  services: {
    meta_title: "Photography & Cinematography Services — Kamal Studios",
    meta_description: "Explore Kamal Studios' full range of luxury wedding photography, 4K films, pre-wedding sessions, event coverage, and commercial photography.",
    meta_keywords: "wedding photography packages, pre wedding shoot, 4k wedding films, commercial photography, luxury event coverage",
    tags: "services, wedding packages, cinematography, commercial",
    og_image: img.hero2,
    heading: "Every service, one atelier.",
    subheading: "From cinematic weddings to campaign-grade product imagery — a single team, six decades of craft.",
    body_text: "We offer tailored photography and filmmaking suites designed around your vision, schedule, and architectural settings.",
  },
  locations: {
    meta_title: "Service Areas & Destinations — Kamal Studios",
    meta_description: "Headquartered in Chandigarh, capturing luxury destination weddings & films across Mohali, Jaipur, Udaipur, Goa, Delhi, Mumbai, and worldwide.",
    meta_keywords: "destination wedding photographer, udaipur wedding photography, jaipur royal weddings, goa beach wedding shoot, worldwide wedding crew",
    tags: "destinations, service areas, royal weddings, beach weddings",
    og_image: img.destination,
    heading: "A studio without borders.",
    subheading: "Headquartered in Chandigarh, working across India and the world. Destination-ready with a self-contained crew.",
    body_text: "Our passport-ready crew travels globally with full 4K cinema gear, aerial drones, and mobile editing suites.",
  },
  portfolio: {
    meta_title: "Portfolio & Visual Archives — Kamal Studios",
    meta_description: "Browse curated fine-art galleries of luxury weddings, royal celebrations, editorial portraits, and fashion campaigns by Kamal Studios.",
    meta_keywords: "wedding photo gallery, luxury indian wedding photos, bridal portraits, couple pre wedding album, fine art wedding gallery",
    tags: "portfolio, gallery, photo album, bridal, luxury",
    og_image: img.bridal,
    heading: "The Visual Archives.",
    subheading: "Curated moments of love, splendour, and emotional intimacy.",
    body_text: "Each album represents a tailored journey — captured with quiet elegance and color-graded in our signature tone.",
  },
  films: {
    meta_title: "Cinematic Wedding Films & Trailers — Kamal Studios",
    meta_description: "Watch 4K luxury wedding films, sangeet teasers, and emotional highlight reels created by Kamal Studios' cinema directors.",
    meta_keywords: "wedding films, 4k cinema wedding teaser, indian sangeet video, destination wedding video, trailer reel",
    tags: "films, cinema, video, sangeet, trailer",
    og_image: img.destination,
    heading: "Cinematic Motion.",
    subheading: "Moving pictures that feel like feature films.",
    body_text: "Shot on cinema prime lenses with immersive sound design and editorial color grading.",
  },
  reviews: {
    meta_title: "Client Reviews & Testimonials — Kamal Studios",
    meta_description: "Read verified client reviews and testimonials about Kamal Studios' luxury wedding photography and filmmaking services.",
    meta_keywords: "kamal studios reviews, top wedding photographer ratings, client testimonials, google reviews chandigarh",
    tags: "reviews, testimonials, ratings, google reviews",
    og_image: img.hero3,
    heading: "In their words.",
    subheading: "Stories of trust, joy, and memories held close for generations.",
    body_text: "We take deep pride in building relationships with families that span generations.",
  },
  blog: {
    meta_title: "Journal & Insights — Kamal Studios",
    meta_description: "Articles, wedding planning advice, venue guides, and photography insights from the creative directors at Kamal Studios.",
    meta_keywords: "wedding planning blog, top wedding venues in india, pre wedding shoot tips, indian bridal trends",
    tags: "blog, journal, guides, wedding tips",
    og_image: img.heroWedding,
    heading: "Notes from the Atelier.",
    subheading: "Insights on wedding planning, venue selection, photography craft, and heritage fashion.",
    body_text: "Read curated articles written by our directors to help you plan your dream celebration.",
  },
  contact: {
    meta_title: "Contact & Booking Consultation — Kamal Studios",
    meta_description: "Book your wedding date or schedule a consultation with Kamal Studios creative directors in Sector 17, Chandigarh or online.",
    meta_keywords: "book kamal studios, wedding photography consultation, contact studio, sector 17 chandigarh phone",
    tags: "contact, booking, consultation, enquiry",
    og_image: img.studio,
    heading: "Begin your story.",
    subheading: "Tell us about your date, venue, and vision. We will curate a customized experience.",
    body_text: "Our studio in Sector 17, Chandigarh is open for in-person consultations, or we can connect over video call anywhere in the world.",
  },
  privacy: {
    meta_title: "Privacy Policy — Kamal Studios",
    meta_description: "Privacy policy detailing how Kamal Studios collects, protects, and handles client data and media assets.",
    meta_keywords: "privacy policy, data protection, client media privacy",
    tags: "privacy, legal, terms",
    heading: "Privacy Policy.",
    subheading: "How we respect and safeguard your personal information and media.",
    body_text: "Your trust is paramount. We take all necessary security precautions to protect your personal information and gallery media.",
  },
  terms: {
    meta_title: "Terms & Conditions — Kamal Studios",
    meta_description: "Terms and conditions governing photography bookings, copyright, delivery timelines, and payment policies for Kamal Studios.",
    meta_keywords: "terms and conditions, booking terms, copyright policy, delivery timeline",
    tags: "terms, legal, policy, booking conditions",
    heading: "Terms & Conditions.",
    subheading: "Guidelines governing bookings, deliverables, and copyright.",
    body_text: "These terms outline the agreement between Kamal Studios and clients for all photographic and cinematography engagements.",
  },
};
