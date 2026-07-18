"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  governmentSponsoredCutoffs,
  governmentSponsoredCutoffs2024,
  selfSponsoredCutoffs,
  selfSponsoredCutoffs2024,
  type CutoffEntry,
} from "@/lib/aau-admission-data";

export default function CutoffPointsPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <header className="border-b border-black/10 bg-white">
          <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[500px] sm:px-8 lg:px-12">
            <div className="max-w-4xl">
              <h1 className="font-accent text-4xl font-black leading-[1.04] text-black sm:text-6xl lg:text-7xl">
              2025/26 academic year cutoff points
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                Search AAU undergraduate placement points for self-sponsored
                applicants and compare freshman placement thresholds for
                government-sponsored applicants.
              </p>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="mb-8 grid gap-4 border-b border-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Find a program
              </p>
              <div className="relative mt-3 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search medicine, engineering, law..."
                  className="h-12 rounded-md pl-11"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <SlidersHorizontal className="h-4 w-4" />
              Points shown are placement cutoffs, not UAT-only scores.
            </div>
          </div>

          <Tabs defaultValue="2025">
            <TabsList className="mb-8 h-auto rounded-md bg-surface p-1">
              <TabsTrigger value="2025" className="px-5 py-2.5">
                2025/26
              </TabsTrigger>
              <TabsTrigger value="2024" className="px-5 py-2.5">
                2024
              </TabsTrigger>
            </TabsList>
            <TabsContent value="2025">
              <SponsorshipTables
                selfEntries={selfSponsoredCutoffs}
                governmentEntries={governmentSponsoredCutoffs}
                query={query}
              />
            </TabsContent>
            <TabsContent value="2024">
              <SponsorshipTables
                selfEntries={selfSponsoredCutoffs2024}
                governmentEntries={governmentSponsoredCutoffs2024}
                query={query}
              />
            </TabsContent>
          </Tabs>

          <p className="mt-8 border-l-2 border-brand pl-4 text-sm leading-7 text-muted">
            Placement thresholds can change each admission round. Use this table
            for orientation and confirm final placement information through AAU.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SponsorshipTables({
  selfEntries,
  governmentEntries,
  query,
}: {
  selfEntries: CutoffEntry[];
  governmentEntries: CutoffEntry[];
  query: string;
}) {
  return (
    <Tabs defaultValue="self">
      <TabsList className="h-auto w-full justify-start rounded-none border-b border-line bg-transparent p-0">
        <TabsTrigger value="self" className="rounded-none px-5 py-3">
          Self-sponsored
        </TabsTrigger>
        <TabsTrigger value="government" className="rounded-none px-5 py-3">
          Government-sponsored
        </TabsTrigger>
      </TabsList>
      <TabsContent value="self" className="mt-6">
        <CutoffTable entries={selfEntries} query={query} />
      </TabsContent>
      <TabsContent value="government" className="mt-6">
        <CutoffTable entries={governmentEntries} query={query} />
      </TabsContent>
    </Tabs>
  );
}

function CutoffTable({ entries, query }: { entries: CutoffEntry[]; query: string }) {
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? entries.filter((entry) => entry.program.toLowerCase().includes(normalized))
      : entries;
  }, [entries, query]);

  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="grid grid-cols-[52px_1fr_72px] bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">
        <span>No.</span>
        <span>Program</span>
        <span className="text-right">Point</span>
      </div>
      <div className="divide-y divide-line">
        {filtered.map((entry, index) => (
          <div
            key={entry.program}
            className="grid grid-cols-[52px_1fr_72px] items-center px-4 py-4 transition-colors hover:bg-surface"
          >
            <span className="text-sm tabular-nums text-muted">{index + 1}</span>
            <span className="pr-4 text-sm font-medium leading-6">{entry.program}</span>
            <strong className="text-right text-lg tabular-nums">{entry.point}</strong>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted">
            No program matches that search.
          </p>
        ) : null}
      </div>
    </div>
  );
}
