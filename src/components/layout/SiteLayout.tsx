import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen max-w-full overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
