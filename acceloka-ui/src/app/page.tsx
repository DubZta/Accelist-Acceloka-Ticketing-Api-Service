import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProductSection from "@/components/ProductSection";
import TrustTestimonials from "@/components/TrustTestimonials";
import FaqNewsletter from "@/components/FaqNewsletter";
import Footer from "@/components/Footer";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ProductSection searchParams={searchParams} />
        <TrustTestimonials />
        <FaqNewsletter />
      </main>
      <Footer />
    </>
  );
}
