import Hero from "../components/Hero";
import LocationSection from "../components/LocationSection";
import HowItWorks from "../components/HowItWorks";
import WhyKhelaro from "../components/WhyKhelaro";
import OwnerCTA from "../components/OwnerCTA";
import FinalCTA from "../components/FinalCTA";

const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />

      <LocationSection />

      <HowItWorks />

      <WhyKhelaro />

      <OwnerCTA />

      <FinalCTA />
    </main>
  );
};

export default Home;