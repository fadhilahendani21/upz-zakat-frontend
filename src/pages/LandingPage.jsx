import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/FeatureCard";
import StatsBar from "../components/landing/StatsBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fff8] to-[#dff5df]">
      <Hero />
      <FeatureCard />
      <StatsBar />
    </div>
  );
}