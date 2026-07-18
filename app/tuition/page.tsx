import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TuitionExplorer from "./TuitionExplorer";

export default function TuitionPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[500px] sm:px-8 lg:px-12">
            <div className="max-w-4xl">
              <h1 className="font-accent text-4xl font-black leading-[1.04] text-black sm:text-6xl lg:text-7xl">
                AAU undergraduate tuition
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                Search undergraduate programs by field and review the current
                tuition information available for each placement.
              </p>
            </div>
          </div>
        </header>

        <TuitionExplorer />
        <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-12">
          <p className="border-t border-line pt-6 text-sm leading-7 text-muted">
            Reviewing admission costs? Read the <Link href="/uat-guide" className="font-bold text-ink underline underline-offset-4">AAU UAT guide</Link> for test format, registration guidance, and preparation steps.
          </p>
        </div>      </main>
      <Footer />
    </div>
  );
}
