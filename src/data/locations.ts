import { img } from "@/lib/site";

export interface Venue {
  name: string;
  type: string;
  desc: string;
}

export interface Location {
  slug: string;
  name: string;
  region: string;
  title: string;
  tagline: string;
  intro: string;
  heroImage: string;
  highlights: string[];
  popularVenues: Venue[];
  servicesOffered: string[];
  faqs: { q: string; a: string }[];
  gallery: string[];
}

export const locations: Location[] = [
  {
    slug: "chandigarh",
    name: "Chandigarh",
    region: "Headquarters · Tricity",
    title: "Luxury Wedding Photography & Cinematography in Chandigarh",
    tagline: "Home of Kamal Studios — documenting Chandigarh's most iconic celebrations for over 6 decades.",
    intro:
      "As our founding headquarters since 1966, Chandigarh holds a deeply special place in the story of Kamal Studios. From grand regal ceremonies in the city's lush luxury estates to intimate celebrations at classic heritage properties, our crew brings uncompromised artistry and seamless execution to every Chandigarh wedding.",
    heroImage: img.heroWedding,
    highlights: [
      "Headquarters studio with complete in-house production team",
      "Decades of relationships with premium local venues and planners",
      "Same-day portrait sessions and quick 72-hour preview delivery",
      "Full aerial drone cinematography and 4K cinema cameras",
    ],
    popularVenues: [
      { name: "The Oberoi Sukhvilas Spa Resort", type: "Luxury Forest Resort", desc: "Secluded royal luxury amidst the Siswan Forest Range." },
      { name: "JW Marriott Hotel Chandigarh", type: "5-Star Luxury Hotel", desc: "Contemporary elegance with grand ballroom spaces in the heart of the city." },
      { name: "Taj Chandigarh", type: "Heritage Luxury", desc: "Classic sophistication for royal wedding receptions and sangeet nights." },
      { name: "Hyatt Regency Chandigarh", type: "Modern Grandeur", desc: "Expansive lawns and grand banquets perfect for large scale celebrations." },
    ],
    servicesOffered: [
      "Editorial Wedding Photography",
      "4K Cinematic Wedding Films",
      "Pre-Wedding Storytelling Sessions",
      "Aerial Drone Cinematography",
      "Handcrafted Fine-Art Albums",
    ],
    faqs: [
      {
        q: "Where is the main Kamal Studios office in Chandigarh?",
        a: "Our flaghsip studio is located in Sector 17, Chandigarh. You can schedule an in-person consultation with our creative directors at any time.",
      },
      {
        q: "Do you charge travel fees for weddings in the Tricity area?",
        a: "No travel fees apply for Chandigarh, Mohali, or Panchkula (the Tricity region).",
      },
      {
        q: "Can we view physical photo album samples in Chandigarh?",
        a: "Yes! Our studio showcases hand-bound Italian leather and archival giclée album samples across various styles.",
      },
    ],
    gallery: [img.heroWedding, img.bridal, img.couple, img.aisle, img.ring, img.reception],
  },
  {
    slug: "mohali",
    name: "Mohali",
    region: "Tricity Region",
    title: "Premium Wedding Photography & Films in Mohali",
    tagline: "Elevating Mohali's modern grand weddings with timeless editorial imagery.",
    intro:
      "Mohali has rapidly transformed into one of the North's most vibrant wedding hubs, known for sprawling luxury farmhouses and state-of-the-art wedding resorts. Kamal Studios brings its signature cinematic eye and relaxed, unobtrusive direction to capture the energy, grand decor, and emotional core of Mohali celebrations.",
    heroImage: img.hero2,
    highlights: [
      "Extensive experience with Mohali's premier farmhouse resorts",
      "Expertise in large-scale sangeet productions and multi-day galas",
      "Seamless local crew dispatch with zero travel latency",
    ],
    popularVenues: [
      { name: "Radisson Red Chandigarh Mohali", type: "Luxe Contemporary Resort", desc: "Vibrant design and open-air lawn venues." },
      { name: "Forest Hill Golf & Country Club", type: "Hillside Country Club", desc: "Panoramas of lush greenery ideal for sunset vows." },
      { name: "Wyndham Chandigarh Mohali", type: "5-Star Luxury", desc: "State-of-the-art ballroom and opulent bridal suites." },
    ],
    servicesOffered: [
      "Multi-Day Wedding Coverage",
      "Pre-Wedding & Couple Portraits",
      "Live Streaming & Real-Time Gallery Setup",
      "High-Definition Drone Filming",
    ],
    faqs: [
      {
        q: "How early should we book for a Mohali wedding?",
        a: "Peak wedding dates in Mohali (October to March) book out 6 to 9 months in advance.",
      },
      {
        q: "Do you shoot night sangeet events at outdoor Mohali farmhouses?",
        a: "Yes, our team carries specialized low-light cinematic prime lenses and ambient lighting setups designed for night celebrations.",
      },
    ],
    gallery: [img.hero2, img.couple2, img.haldi, img.mehndi, img.reception],
  },
  {
    slug: "panchkula",
    name: "Panchkula",
    region: "Tricity Region",
    title: "Scenic Wedding Photography & Cinematography in Panchkula",
    tagline: "Picturesque hill-backdrop celebrations documented with fine-art precision.",
    intro:
      "Nestled at the foothills of the Shivalik range, Panchkula offers serene resort settings, golf club estates, and elegant boutique venues. We specialize in capturing the crisp natural light, scenic landscapes, and joyful intimacy of Panchkula weddings.",
    heroImage: img.hero3,
    highlights: [
      "Specialised natural light outdoor photography",
      "Sunset and hill-side landscape framing expertise",
      "Dedicated creative crew based locally in Tricity",
    ],
    popularVenues: [
      { name: "Golden Tulip Panchkula", type: "Resort at Shivalik Foothills", desc: "Picturesque poolside and lawn venues nestled against the hills." },
      { name: "The Lalit Chandigarh (IT Park / Panchkula)", type: "5-Star Luxury Resort", desc: "Encapsulated in tranquility with grand ballroom facilities." },
      { name: "Panchkula Golf Club", type: "Scenic Country Club", desc: "Expansive green vistas perfect for grand outdoor mandaps." },
    ],
    servicesOffered: [
      "Natural Light Wedding Photography",
      "Scenic Outdoor Pre-Wedding Shoots",
      "Full Cinematic Highlight Reels",
      "Traditional & Candid Photography",
    ],
    faqs: [
      {
        q: "Are pre-wedding sessions near Morni Hills or Pinjore Gardens available?",
        a: "Absolutely! We frequently conduct pre-wedding shoots across scenic locations around Panchkula including Morni Hills and Pinjore Gardens.",
      },
    ],
    gallery: [img.hero3, img.bridal, img.couple3, img.aisle],
  },
  {
    slug: "ludhiana",
    name: "Ludhiana",
    region: "Punjab",
    title: "Royal & Grand Wedding Photography in Ludhiana",
    tagline: "Capturing the opulence, grandeur, and deep traditions of Punjab's grandest celebrations.",
    intro:
      "Ludhiana is famous for unmatched hospitality and extravagant wedding celebrations. From royal palace-inspired resorts to high-energy sangeets, Kamal Studios captures the soul, splendour, and emotional richness of Ludhiana weddings with editorial flair.",
    heroImage: img.heroWedding,
    highlights: [
      "Decades of capturing high-profile Punjabi weddings in Ludhiana",
      "Specialized direction for high-energy Sangeet & Anand Karaj ceremonies",
      "Self-contained multi-camera production crew",
    ],
    popularVenues: [
      { name: "Hyatt Regency Ludhiana", type: "Luxury City Center Hotel", desc: "Refined grandeur and exceptional culinary experience." },
      { name: "Radisson Blu Hotel Ludhiana", type: "5-Star Luxury", desc: "Spacious banquets tailored for royal wedding galas." },
      { name: "Kingsville Resort", type: "Luxury Palace Resort", desc: "Palatial architecture creating a majestic backdrop for nuptials." },
    ],
    servicesOffered: [
      "Anand Karaj & Religious Ceremony Coverage",
      "Grand Sangeet & After-Party Films",
      "Candid & Royal Portraiture",
      "Same-Day Edit Highlights",
    ],
    faqs: [
      {
        q: "Do you cover multi-day events across Ludhiana?",
        a: "Yes, we provide full coverage starting from Mehendi, Haldi, Cocktail night, to Anand Karaj and Reception.",
      },
    ],
    gallery: [img.heroWedding, img.haldi, img.mehndi, img.couple],
  },
  {
    slug: "delhi",
    name: "Delhi",
    region: "NCR & Capital",
    title: "Luxury Wedding Photography & Filmmaking in Delhi NCR",
    tagline: "Editorial elegance for Delhi's heritage mansions, farmhouses, and 5-star galas.",
    intro:
      "Delhi weddings are legendary for their scale, fashion, and architectural backdrop. Whether it's a heritage wedding in South Delhi, a starry night at Chattarpur farmhouses, or a regal affair at imperial 5-star hotels, Kamal Studios brings international filmmaking standards to the capital.",
    heroImage: img.destination,
    highlights: [
      "Dedicated crew dispatched from Chandigarh/Delhi route effortlessly",
      "Experience across Chattarpur, Aerocity, and Lutyens' Delhi venues",
      "High-fashion editorial aesthetic suited for Delhi couture weddings",
    ],
    popularVenues: [
      { name: "The Leela Palace New Delhi", type: "Royal Palace Hotel", desc: "Unmatched royal luxury in Chanakyapuri." },
      { name: "The Taj Mahal Hotel, New Delhi", type: "Iconic Heritage Hotel", desc: "Timeless elegance on Mansingh Road." },
      { name: "Chattarpur Luxury Farmhouses", type: "Private Estate Venues", desc: "Expansive private lawns hosting grand custom mandaps." },
      { name: "JW Marriott Hotel New Delhi Aerocity", type: "Contemporary Grandeur", desc: "Sophisticated modern ballrooms." },
    ],
    servicesOffered: [
      "High-Fashion Wedding Photography",
      "4K Feature-Length Cinema Films",
      "Pre-Wedding Lifestyle Shoots in Delhi & NCR",
      "Drone Aerial Cinematography",
    ],
    faqs: [
      {
        q: "Does your team travel to Gurgaon and Noida for NCR events?",
        a: "Yes! We cover the entire Delhi NCR region including Gurgaon, Noida, and Greater Noida.",
      },
    ],
    gallery: [img.destination, img.bridal, img.couple2, img.reception],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra · West Coast",
    title: "Cinematic Wedding Photography & Films in Mumbai",
    tagline: "Sea-breeze romance and high-society glamour captured with cinematic perfection.",
    intro:
      "From coastal sunsets overlooking the Arabian Sea to high-profile celebrity galas in South Bombay and BKC, Mumbai weddings demand flair, speed, and discretion. Kamal Studios delivers artistic storytelling suited for Mumbai's fast-paced, high-fashion weddings.",
    heroImage: img.fashion,
    highlights: [
      "Cinematic storytelling with Bollywood-grade color grading",
      "Discreet and professional crew experienced with high-profile guests",
      "Seaside and cityscape pre-wedding photography",
    ],
    popularVenues: [
      { name: "The Taj Mahal Palace, Mumbai", type: "Iconic Sea-Facing Landmark", desc: "The ultimate symbol of heritage luxury at Apollo Bunder." },
      { name: "St. Regis Mumbai", type: "High-Rise Luxury Hotel", desc: "Opulent ballrooms elevated above the Lower Parel skyline." },
      { name: "JWM Marriott Mumbai Juhu", type: "Beachfront Luxury Resort", desc: "Direct beach access for sunset vows and chic cocktail nights." },
    ],
    servicesOffered: [
      "Celebrity & High-Profile Wedding Coverage",
      "Coastal Pre-Wedding Portraits",
      "Cinematic Teaser & Highlight Films",
      "Fine-Art Coffee Table Albums",
    ],
    faqs: [
      {
        q: "How does the team handle travel logistics to Mumbai?",
        a: "We deploy a self-contained crew from Chandigarh/Delhi with all high-end camera equipment, lighting, and drone gear fully managed.",
      },
    ],
    gallery: [img.fashion, img.couple, img.aisle, img.destination],
  },
  {
    slug: "goa",
    name: "Goa",
    region: "Destination · Beaches",
    title: "Destination Wedding Photography & Films in Goa",
    tagline: "Sun-drenched romance, beach mandaps, and effortless coastal celebrations.",
    intro:
      "Goa is India's premier destination for breezy beach weddings and lush tropical resorts. Kamal Studios crafts dreamy, sunlit imagery and romantic cinematic films that preserve the relaxed, emotional atmosphere of your Goan celebration.",
    heroImage: img.destination,
    highlights: [
      "Specialized coastal and golden-hour lighting experts",
      "Underwater & beachside portraiture capabilities",
      "Complete destination crew setup ready for multi-day beach festivals",
    ],
    popularVenues: [
      { name: "Taj Exotica Resort & Spa, Goa", type: "Benaulim Beachfront Estate", desc: "56 acres of lush gardens fronting the Arabian Sea." },
      { name: "Alila Diwa Goa", type: "Majestic Tropical Sanctuary", desc: "Paddy field vistas and infinity pool mandap setups in South Goa." },
      { name: "W Goa", type: "Chic Cliffside Resort", desc: "Dramatic Vagator beach cliffs and trendy night event spaces." },
      { name: "Grand Hyatt Goa", type: "Indo-Portuguese Palace Resort", desc: "Bambolim bay waterfront with grand ballroom and lawns." },
    ],
    servicesOffered: [
      "Beachfront Mandap & Sunset Ceremony Coverage",
      "Pool Party & Mehendi Cinematography",
      "Romantic Sunset Couple Shoots",
      "Drone Ocean & Aerial Shots",
    ],
    faqs: [
      {
        q: "What is the best season for a Goa destination wedding photo shoot?",
        a: "October to April offers clear skies, soothing sea breezes, and ideal golden-hour light for photography.",
      },
    ],
    gallery: [img.destination, img.couple2, img.reception, img.hero2],
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    region: "Rajasthan · Pink City",
    title: "Royal Destination Wedding Photography in Jaipur",
    tagline: "Palatial splendour, royal forts, and fairytale weddings captured in timeless tones.",
    intro:
      "Jaipur is the pinnacle of royal Indian destination weddings. With grand courtyards, elephant processions, and centuries-old fort views, our crew crafts regal, editorial imagery that honors the heritage and grandeur of Pink City weddings.",
    heroImage: img.heroWedding,
    highlights: [
      "Extensive experience with Jaipur's grand heritage palaces",
      "Deep understanding of royal fort lighting and grand architectural framing",
      "Complete destination filming team with 4K cinema gear",
    ],
    popularVenues: [
      { name: "Rambagh Palace, Jaipur", type: "Former Royal Residence", desc: "The jewel of Jaipur, offering unparalleled royal hospitality." },
      { name: "Fairmont Jaipur", type: "Mughal & Rajput Fortress", desc: "Grand palatial architecture built specifically for lavish weddings." },
      { name: "Jai Mahal Palace", type: "18th-Century Indo-Saracenic Palace", desc: "18 acres of Mughal gardens in the city center." },
      { name: "Samode Palace", type: "Heritage Palace & Garden Estate", desc: "Intimate heritage elegance surrounded by the Aravalli hills." },
    ],
    servicesOffered: [
      "Royal Palace Wedding Photography",
      "Heritage Fort Pre-Wedding Films",
      "Cinematic Royal Procession & Baraat Coverage",
      "Bespoke Leather & Silk Heirloom Albums",
    ],
    faqs: [
      {
        q: "Do you need special permits for shooting at Jaipur forts?",
        a: "Our destination management team handles location coordination and permits for key heritage spots across Jaipur.",
      },
    ],
    gallery: [img.heroWedding, img.bridal, img.couple3, img.reception],
  },
  {
    slug: "udaipur",
    name: "Udaipur",
    region: "Rajasthan · Lake City",
    title: "Royalty & Lakefront Wedding Photography in Udaipur",
    tagline: "Romance on the waters of Lake Pichola — documenting India's finest fairytale weddings.",
    intro:
      "Known as the Venice of the East, Udaipur provides an ethereal backdrop of floating palaces, calm lake waters, and dramatic hills. Kamal Studios captures Udaipur weddings with cinematic depth, transforming royal celebrations into timeless visual art.",
    heroImage: img.hero3,
    highlights: [
      "Mastery of lakefront night illuminations and boat procession filming",
      "Featured coverage at top Lake Pichola heritage palaces",
      "Self-contained luxury production crew",
    ],
    popularVenues: [
      { name: "Taj Lake Palace, Udaipur", type: "Floating Marble Palace", desc: "Iconic 18th-century sanctuary in the middle of Lake Pichola." },
      { name: "The Leela Palace Udaipur", type: "Lakefront Luxury Hotel", desc: "Breathtaking views of the City Palace and Aravalli Mountains." },
      { name: "Jagmandir Island Palace", type: "Historic Island Palace", desc: "Exclusive island venue for unforgettable royal receptions." },
      { name: "Oberoi Udaivilas", type: "Palatial Resort Estate", desc: "Meandering fountains and domes overlooking the lake." },
    ],
    servicesOffered: [
      "Lakefront & Island Wedding Cinematography",
      "Boat Procession & Evening Gala Photography",
      "Royal Couple Portraits",
      "Full Feature Cinematic Wedding Film",
    ],
    faqs: [
      {
        q: "How many crew members travel for a destination wedding in Udaipur?",
        a: "Depending on your scale, our team ranges from a tight 4-person editorial crew up to a full 12-person multi-camera cinematography production crew.",
      },
    ],
    gallery: [img.hero3, img.destination, img.couple, img.bridal],
  },
  {
    slug: "jalandhar",
    name: "Jalandhar",
    region: "Punjab",
    title: "Vibrant Wedding Photography & Films in Jalandhar",
    tagline: "Rich culture, joyful celebrations, and emotional memories captured beautifully.",
    intro:
      "Jalandhar is renowned for its warmth, vibrant Punjabi tradition, and magnificent NRI wedding celebrations. Kamal Studios brings over 60 years of heritage to capture the heart, laughter, and grand rituals of Jalandhar weddings.",
    heroImage: img.hero2,
    highlights: [
      "Specialized in NRI wedding logistics and international family coordination",
      "Experienced with Jalandhar's luxury GT Road resorts",
      "Rapid delivery options for families returning abroad",
    ],
    popularVenues: [
      { name: "The Cabbana Resort & Spa", type: "Luxury GT Road Resort", desc: "Sprawling green lawns and grand ballrooms." },
      { name: "Radisson Hotel Jalandhar", type: "5-Star City Hotel", desc: "Refined banquets for sangeets and reception dinners." },
      { name: "Imperial Medical Hall & Lawns", type: "Heritage Event Estate", desc: "Classic backdrop for grand wedding ceremonies." },
    ],
    servicesOffered: [
      "Full Punjabi Wedding Ritual Coverage",
      "NRI Family Portraiture",
      "4K Sangeet & Jaggo Films",
      "Custom Online Gallery for Overseas Relatives",
    ],
    faqs: [
      {
        q: "Can overseas relatives order physical photo albums directly?",
        a: "Yes, we ship our fine-art archival albums worldwide directly to Canada, UK, USA, Australia, and beyond.",
      },
    ],
    gallery: [img.hero2, img.haldi, img.mehndi, img.couple2],
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    region: "Punjab · Sacred Heritage",
    title: "Sacred & Royal Wedding Photography in Amritsar",
    tagline: "Honor, devotion, and grand heritage captured around Punjab's spiritual heart.",
    intro:
      "Amritsar weddings blend deep spiritual reverence with rich cultural heritage. From sacred Anand Karaj ceremonies at historic Gurdwaras to grand evening galas, Kamal Studios documents your sacred union with grace and artistic dignity.",
    heroImage: img.heroWedding,
    highlights: [
      "Respectful, quiet coverage during sacred Anand Karaj prayers",
      "Heritage portraiture around Amritsar's architectural landmarks",
      "In-house editing team specializing in classic timeless tones",
    ],
    popularVenues: [
      { name: "Taj Swarna, Amritsar", type: "5-Star Luxury Hotel", desc: "Modern luxury with authentic Punjabi hospitality." },
      { name: "Radisson Blu Hotel Amritsar", type: "Luxe Airport Resort", desc: "Expansive lawns perfect for large wedding galas." },
      { name: "Welcomhotel by ITC Hotels, Amritsar", type: "Colonial Heritage Estate", desc: "Restored 100-year-old Haveli setting." },
    ],
    servicesOffered: [
      "Sacred Anand Karaj Photography",
      "Pre-Wedding Shoots near Heritage Haveli Settings",
      "High-Definition Sangeet & Reception Cinematography",
      "Curated Digital & Print Collections",
    ],
    faqs: [
      {
        q: "Do your photographers strictly adhere to Gurdwara decorum?",
        a: "Yes, our team is deeply familiar with traditional customs, dress codes, and respectful positioning during religious ceremonies.",
      },
    ],
    gallery: [img.heroWedding, img.bridal, img.aisle, img.ring],
  },
  {
    slug: "worldwide",
    name: "Destination · Worldwide",
    region: "International",
    title: "Global Destination Wedding Photography & Films",
    tagline: "Worldwide coverage for international weddings — Europe, Middle East, Southeast Asia, & Americas.",
    intro:
      "Love knows no borders. Kamal Studios' passport-ready production crew travels globally to capture luxury destination weddings. Whether it's a villa in Lake Como, a beach resort in Bali, a palace in Dubai, or a estate wedding in California, we deliver world-class visual storytelling anywhere on Earth.",
    heroImage: img.destination,
    highlights: [
      "Passport & visa ready creative directors and cinematography crew",
      "Self-contained international travel kits and drone permits handled",
      "Global experience across Europe, UAE, Southeast Asia, and USA",
    ],
    popularVenues: [
      { name: "Lake Como Villas (Italy)", type: "Italian Heritage Estate", desc: "Romantic lakeside terraces and historic Italian architecture." },
      { name: "Armani Hotel Dubai (UAE)", type: "Burj Khalifa Luxury", desc: "Ultra-luxury urban wedding venue in downtown Dubai." },
      { name: "Bali Cliffside Resorts (Indonesia)", type: "Ocean Panorama Estate", desc: "Uluwatu cliffside mandaps overlooking the Indian Ocean." },
      { name: "Château de Chantilly (France)", type: "French Castle", desc: "Fairytale French estate for royal European celebrations." },
    ],
    servicesOffered: [
      "International Destination Wedding Photography",
      "Worldwide 4K Cinema Production",
      "Global Pre-Wedding Shoots (Europe, UAE, Asia)",
      "Multi-Language Client Concierge & Rapid Delivery",
    ],
    faqs: [
      {
        q: "How are travel and accommodation expenses handled for overseas weddings?",
        a: "We provide transparent all-inclusive travel quotes covering flights, visas, and stay for our minimal self-contained crew.",
      },
      {
        q: "Can you provide same-day edits for international reception dinners?",
        a: "Yes! Our mobile editing suite enables us to deliver high-impact teaser trailers on-site for your reception screening.",
      },
    ],
    gallery: [img.destination, img.heroWedding, img.couple, img.fashion, img.reception],
  },
];

export function locationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
}
