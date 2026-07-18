import SmoothScroll from "@/components/v2/SmoothScroll";
import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import UseCaseStrip from "@/components/v2/UseCaseStrip";
import Problem from "@/components/v2/Problem";
import GlemoInAction from "@/components/v2/GlemoInAction";
import Bento from "@/components/v2/Bento";
import Audiences from "@/components/v2/Audiences";
import DevTerminal from "@/components/v2/DevTerminal";
import StandardsStrip from "@/components/v2/StandardsStrip";
import Faq from "@/components/v2/Faq";
import FinalCta from "@/components/v2/FinalCta";
import Footer from "@/components/v2/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <UseCaseStrip />
        <Problem />
        <GlemoInAction />
        <Bento />
        <Audiences />
        <DevTerminal />
        <StandardsStrip />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
