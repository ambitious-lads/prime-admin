import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <section className="border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">AAU admission resource</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Understand the Undergraduate Admission Test</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Review the published test structure, registration and test-day guidance, preparation strategy, and official-source checks before you begin practicing.</p>
            </div>
            <Link href="/uat-guide" className="inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-black">Read the AAU UAT guide</Link>
          </div>
        </section>
        <Features />
        <Testimonials />
        <About />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
