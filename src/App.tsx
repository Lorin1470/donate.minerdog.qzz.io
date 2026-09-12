import { Header } from "./components/Header";
import { DonateSection } from "./components/DonateSection";
import { Footer } from "./components/Footer";
import { NetworkBadge } from "./components/NetworkBadge";

/**
 * Root application component.
 *
 * Single-page layout:
 *   Header → Donate Section → Footer
 *
 * No routing needed — this is a one-page donation site.
 */
export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary bg-grid-pattern">
      <NetworkBadge />
      <Header />
      <DonateSection />
      <Footer />
    </div>
  );
}
