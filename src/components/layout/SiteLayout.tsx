import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import bgLuxury from "@/assets/bg-luxury.jpg";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark relative min-h-screen max-w-full overflow-x-hidden text-foreground">
      {/* Fixed luxury background that stays while content scrolls */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage: `url(${bgLuxury})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Subtle vignette/overlay for legibility */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <Header />
      <main className="relative z-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
