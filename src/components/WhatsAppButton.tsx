import { MessageCircle } from "lucide-react";

const PHONE = "34614001825";

export function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola Vectra, me gustaría más información.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition hover:scale-110 hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)]"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
      <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-green-400" />
    </a>
  );
}
