import SmoothScroll from "@/components/v2/SmoothScroll";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import StandardsStrip from "@/components/v2/StandardsStrip";
import Problem from "@/components/v2/Problem";
import HowItWorks from "@/components/v2/HowItWorks";
import FeatureTour from "@/components/v2/FeatureTour";
import DevTerminal from "@/components/v2/DevTerminal";
import Audiences from "@/components/v2/Audiences";
import Faq from "@/components/v2/Faq";
import FinalCta from "@/components/v2/FinalCta";
import Footer from "@/components/v2/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <StandardsStrip />
        <Problem />
        <HowItWorks />
        <FeatureTour />
        <DevTerminal />
        <Audiences />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
