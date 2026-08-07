import { MessageCircle, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export function FloatingWhatsApp() {
  const { settings } = useSiteContent();

  if (!settings.whatsapp && !settings.phoneRaw) return null;

  const rawNumber = settings.whatsapp ? settings.whatsapp.trim() : "";
  const whatsappUrl = rawNumber.startsWith("http")
    ? rawNumber
    : `https://wa.me/${rawNumber.replace(/[^0-9]/g, "")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      {/* Call Now Floating Action (Reveals smoothly on Hover) */}
      {settings.phoneRaw && (
        <a
          href={`tel:${settings.phoneRaw}`}
          aria-label="Call Now"
          className="flex items-center gap-3 bg-[color:var(--gold)] text-black px-4 py-3 rounded-full shadow-2xl hover:bg-white hover:scale-105 active:scale-95 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 border border-black/10 font-medium"
        >
          <Phone className="size-5 fill-current shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
            Call Now ({settings.phone})
          </span>
        </a>
      )}

      {/* Main WhatsApp Floating Action */}
      {settings.whatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
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
      )}
    </div>
  );
}
