import { HeroSection } from "@/components/hero-section";
import { FeaturedSeminars } from "@/components/featured-seminars";
import { StatsSection } from "@/components/stats-section";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <StatsSection />
      <FeaturedSeminars />
      <HowItWorks />
    </div>
  );
}
