import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FamiliesSection from "@/components/FamiliesSection";
import EngineeringDepth from "@/components/EngineeringDepth";
import MotorArchitecture from "@/components/MotorArchitecture";
import LocationMap from "@/components/LazyLocationMap";
import ContactSection from "@/components/ContactSection";
import InvestorsSection from "@/components/InvestorsSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Support deep links such as /#contact (e.g. from the About page or shared URLs).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let frames = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (frames++ < 300) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <main>
      <HeroSection />
      <FamiliesSection />
      <EngineeringDepth />
      <MotorArchitecture />
      <LocationMap />
      <ContactSection />
      <InvestorsSection />
      <Footer />
    </main>
  );
}
