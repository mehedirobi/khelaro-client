import Hero from "../components/home/Hero";
import LocationSection from "../components/home/LocationSection";
import FeaturedTurfs from "../components/home/FeaturedTurfs";
import HowItWorks from "../components/home/HowItWorks";
import WhyKhelaro from "../components/home/WhyKhelaro";
import OwnerCTA from "../components/home/OwnerCTA";
import FinalCTA from "../components/home/FinalCTA";

const Home = () => {
  return (
    <>
      <Hero />
      <LocationSection />
      <FeaturedTurfs />
      <HowItWorks />
      <WhyKhelaro />
      <OwnerCTA />
      <FinalCTA />
    </>
  );
};

export default Home;