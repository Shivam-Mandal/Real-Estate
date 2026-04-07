import { useEffect, useState } from "react";
import { propertyApi } from "../api/propertyApi";
import { FeaturedProperties } from "../components/home/FeaturedProperties";
import { HeroSection } from "../components/home/HeroSection";
import { ServicesSection } from "../components/home/ServicesSection";
import { TestimonialSection } from "../components/home/TestimonialSection";

export const HomePage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    propertyApi.getFeatured().then(({ data }) => setFeatured(data.items)).catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedProperties properties={featured} />
      <ServicesSection />
      <TestimonialSection />
    </>
  );
};
