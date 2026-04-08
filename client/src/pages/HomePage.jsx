import { useEffect } from "react";
import { FeaturedProperties } from "../components/home/FeaturedProperties";
import { FeaturedPropertiesSkeleton } from "../components/home/FeaturedPropertiesSkeleton";
import { HeroSection } from "../components/home/HeroSection";
import { LatestPropertiesSection } from "../components/home/LatestPropertiesSection";
import { ServicesSection } from "../components/home/ServicesSection";
import { TestimonialSection } from "../components/home/TestimonialSection";
import { useAsyncData } from "../hooks/useAsyncData";
import { useSeo } from "../hooks/useSeo";
import { useToast } from "../hooks/useToast";
import { propertyService } from "../services/propertyService";

const loadFeaturedProperties = () => propertyService.getFeatured();

export const HomePage = () => {
  const { showToast } = useToast();
  useSeo({
    title: "Residence Elite | Luxury Real Estate Marketplace",
    description: "Browse featured real-estate listings, explore premium homes, and connect with agents through a fast, modern property marketplace.",
  });
  const { data, loading, error } = useAsyncData(
    loadFeaturedProperties,
    { items: [] },
  );

  useEffect(() => {
    if (error) {
      showToast({
        title: "Featured properties unavailable",
        message: "We couldn't load the featured listings right now.",
        tone: "error",
      });
    }
  }, [error, showToast]);

  return (
    <>
      <HeroSection />
      {loading ? <FeaturedPropertiesSkeleton /> : <FeaturedProperties properties={data?.items || []} />}
      <LatestPropertiesSection />
      <ServicesSection />
      <TestimonialSection />
    </>
  );
};
