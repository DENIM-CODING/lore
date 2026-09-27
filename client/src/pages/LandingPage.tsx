import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#09090b]">
      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  );
}