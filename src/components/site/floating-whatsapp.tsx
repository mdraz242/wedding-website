import { useState } from "react";
import { MessageCircle, Phone, Mail, X } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export function FloatingWhatsApp() {
  const { settings } = useSiteContent();
  const [isOpen, setIsOpen] = useState(true);

  if (!settings) return null;

  const rawNumber = settings.whatsapp ? settings.whatsapp.trim() : "";
  const whatsappUrl = rawNumber.startsWith("http")
    ? rawNumber
    : `https://wa.me/${rawNumber.replace(/[^0-9]/g, "")}`;

  const phoneUrl = settings.phoneRaw ? `tel:${settings.phoneRaw.trim()}` : `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;
  const mailUrl = `mailto:${settings.email || "hello@kamalstudios.com"}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Floating Card Popup */}
      {isOpen && (
        <div className="bg-white text-black shadow-2xl rounded-3xl p-2.5 border border-black/10 w-[300px] sm:w-[320px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col divide-y divide-gray-100">
            {/* Chat on WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div>
                <div className="text-sm font-bold text-gray-900 group-hover:text-[#25D366] transition-colors">
                  Chat on WhatsApp
                </div>
                <div className="text-xs text-gray-500 font-normal mt-0.5">
                  We usually reply instantly
                </div>
              </div>
              <div className="size-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="size-5 fill-current" />
              </div>
            </a>

            {/* Call Now */}
            <a
              href={phoneUrl}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div>
                <div className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                  Call Now
                </div>
                <div className="text-xs text-gray-500 font-normal mt-0.5">
                  Speak with our team
                </div>
              </div>
              <div className="size-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="size-5 fill-current" />
              </div>
            </a>

            {/* Email Us */}
            <a
              href={mailUrl}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div>
                <div className="text-sm font-bold text-gray-900 group-hover:text-[#EF4444] transition-colors">
                  Email Us
                </div>
                <div className="text-xs text-gray-500 font-normal mt-0.5">
                  We'll respond via email
                </div>
              </div>
              <div className="size-11 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Mail className="size-5 fill-current" />
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        className={`size-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-white text-black border border-black/10"
            : "bg-[#25D366] text-white"
        }`}
      >
        {isOpen ? (
          <X className="size-6 text-gray-900" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="size-6 fill-current" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
