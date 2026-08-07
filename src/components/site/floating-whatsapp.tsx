import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export function FloatingWhatsApp() {
  const { settings } = useSiteContent();

  if (!settings.whatsapp) return null;

  const rawNumber = settings.whatsapp.trim();
  const whatsappUrl = rawNumber.startsWith("http")
    ? rawNumber
    : `https://wa.me/${rawNumber.replace(/[^0-9]/g, "")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#25D366] text-white px-4 py-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
    >
      <MessageCircle className="size-6 fill-current shrink-0 animate-bounce" />
      <span className="text-xs font-semibold uppercase tracking-wider max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
        Chat on WhatsApp
      </span>
      <span className="relative flex h-3 w-3 -ml-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
}
