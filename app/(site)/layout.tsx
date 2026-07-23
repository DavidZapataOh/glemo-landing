import Footer from "@/components/v2/Footer";
import Nav from "@/components/v2/Nav";

/** Shared chrome for the standalone marketing pages (pricing, status). The home
 *  composes its own Nav/Footer (with smooth scroll); docs has its own layout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
