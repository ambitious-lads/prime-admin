"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EthiopianRate = {
  category: string;
  program: string;
  fee: string;
};

type InternationalRate = EthiopianRate & {
  refugee: string;
  igad: string;
  international: string;
};

const ethiopianRates: EthiopianRate[] = [
  { category: "Clinical health sciences", program: "Medicine & Dental Medicine", fee: "2,307.69" },
  { category: "Clinical health sciences", program: "Pharmacy", fee: "1,153.17" },
  { category: "Clinical health sciences", program: "Veterinary Medicine", fee: "1,153.17" },
  { category: "Clinical health sciences", program: "Other Health Sciences", fee: "1,153.17" },
  { category: "Laboratory-based subjects", program: "Software Engineering", fee: "1,500.00" },
  { category: "Laboratory-based subjects", program: "Computer Science", fee: "1,500.00" },
  { category: "Laboratory-based subjects", program: "Architecture", fee: "1,500.00" },
  { category: "Laboratory-based subjects", program: "Information Science", fee: "900.00" },
  { category: "Laboratory-based subjects", program: "Other Natural Sciences", fee: "600.00" },
  { category: "Laboratory-based subjects", program: "Engineering", fee: "900.00" },
  { category: "Studio, laboratory or fieldwork", program: "Fieldwork Element Subjects", fee: "917.71" },
  { category: "Business and economics", program: "Law", fee: "700.00" },
  { category: "Business and economics", program: "Business and Economics", fee: "700.00" },
  { category: "Social sciences and humanities", program: "Social Sciences", fee: "600.00" },
  { category: "Social sciences and humanities", program: "Educational Disciplines", fee: "600.00" },
  { category: "Social sciences and humanities", program: "Music, Art and Theatre", fee: "600.00" },
  { category: "Social sciences and humanities", program: "Humanities, Language Studies and Journalism", fee: "600.00" },
];

const internationalRates: InternationalRate[] = ethiopianRates.map((rate) => {
  const health = rate.category === "Clinical health sciences";
  const lab = rate.category === "Laboratory-based subjects";
  const fieldwork = rate.category === "Studio, laboratory or fieldwork";
  const refugee = rate.fee;

  if (health) {
    return { ...rate, refugee, igad: "100", international: "150" };
  }
  if (lab) {
    return { ...rate, refugee, igad: "60", international: "90" };
  }
  if (fieldwork) {
    return { ...rate, refugee, igad: "52", international: "75" };
  }
  return { ...rate, refugee, igad: "42", international: "60" };
});

const ugServiceFees = [
  {
    item: "Internship, externship or practicum",
    basis: "Per undergraduate student",
    fee: "5,400.00 ETB",
  },
  {
    item: "Senior essay or final research project",
    basis: "Per undergraduate student",
    fee: "5,375.00 ETB",
  },
  {
    item: "Externship (Law)",
    basis: "Per ECTS",
    fee: "190.00 ETB",
  },
  {
    item: "Laboratory outside coursework: clinical health and laboratory-based programs",
    basis: "Per ECTS",
    fee: "440.00 ETB",
  },
  {
    item: "Laboratory outside coursework: studio, fieldwork, social sciences, humanities, business and economics",
    basis: "Per ECTS",
    fee: "175.00 ETB",
  },
];

export default function TuitionExplorer() {
  const [query, setQuery] = useState("");

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-8 grid gap-4 border-b border-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Find a fee
          </p>
          <div className="relative mt-3 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search medicine, engineering, fieldwork..."
              className="h-12 rounded-md pl-11"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <SlidersHorizontal className="h-4 w-4" />
          Tuition is charged per ECTS unless another basis is shown.
        </div>
      </div>

      <Tabs defaultValue="ethiopian">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border-b border-line bg-transparent p-0">
          <TabsTrigger value="ethiopian" className="shrink-0 rounded-none px-5 py-3">
            Ethiopian students
          </TabsTrigger>
          <TabsTrigger value="international" className="shrink-0 rounded-none px-5 py-3">
            Non-Ethiopian students
          </TabsTrigger>
          <TabsTrigger value="services" className="shrink-0 rounded-none px-5 py-3">
            Undergraduate service fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ethiopian" className="mt-6">
          <EthiopianTable entries={ethiopianRates} query={query} />
        </TabsContent>
        <TabsContent value="international" className="mt-6">
          <InternationalTable entries={internationalRates} query={query} />
        </TabsContent>
        <TabsContent value="services" className="mt-6">
          <ServiceTable query={query} />
        </TabsContent>
      </Tabs>

      <p className="mt-8 border-l-2 border-brand pl-4 text-sm leading-7 text-muted">
        Ethiopian and refugee amounts are shown in ETB. IGAD, East African, and
        other international student rates are shown in USD. Confirm the current
        billing period and registered ECTS load before payment.
      </p>
    </section>
  );
}

function EthiopianTable({ entries, query }: { entries: EthiopianRate[]; query: string }) {
  const filtered = useFiltered(entries, query);
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="grid grid-cols-[52px_1fr_160px] bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">
        <span>No.</span>
        <span>Program category</span>
        <span className="text-right">ETB per ECTS</span>
      </div>
      <div className="divide-y divide-line">
        {filtered.map((entry, index) => (
          <div key={entry.program} className="grid grid-cols-[52px_1fr_160px] items-center px-4 py-4 transition-colors hover:bg-surface">
            <span className="text-sm tabular-nums text-muted">{index + 1}</span>
            <div className="pr-5">
              <p className="text-sm font-medium leading-6">{entry.program}</p>
              <p className="mt-0.5 text-xs text-muted">{entry.category}</p>
            </div>
            <strong className="text-right text-lg tabular-nums">{entry.fee}</strong>
          </div>
        ))}
        <Empty show={filtered.length === 0} />
      </div>
    </div>
  );
}

function InternationalTable({ entries, query }: { entries: InternationalRate[]; query: string }) {
  const filtered = useFiltered(entries, query);
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <div className="min-w-[820px]">
        <div className="grid grid-cols-[52px_1fr_150px_150px_170px] bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">
          <span>No.</span>
          <span>Program category</span>
          <span className="text-right">Refugee · ETB</span>
          <span className="text-right">IGAD / EA · USD</span>
          <span className="text-right">International · USD</span>
        </div>
        <div className="divide-y divide-line">
          {filtered.map((entry, index) => (
            <div key={entry.program} className="grid grid-cols-[52px_1fr_150px_150px_170px] items-center px-4 py-4 transition-colors hover:bg-surface">
              <span className="text-sm tabular-nums text-muted">{index + 1}</span>
              <div className="pr-5">
                <p className="text-sm font-medium leading-6">{entry.program}</p>
                <p className="mt-0.5 text-xs text-muted">{entry.category}</p>
              </div>
              <strong className="text-right tabular-nums">{entry.refugee}</strong>
              <strong className="text-right tabular-nums">{entry.igad}</strong>
              <strong className="text-right tabular-nums">{entry.international}</strong>
            </div>
          ))}
          <Empty show={filtered.length === 0} />
        </div>
      </div>
    </div>
  );
}

function ServiceTable({ query }: { query: string }) {
  const normalized = query.trim().toLowerCase();
  const filtered = ugServiceFees.filter(
    (entry) =>
      !normalized ||
      entry.item.toLowerCase().includes(normalized) ||
      entry.basis.toLowerCase().includes(normalized),
  );
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="grid grid-cols-[52px_1fr_160px] bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-white">
        <span>No.</span>
        <span>Undergraduate service</span>
        <span className="text-right">Fee</span>
      </div>
      <div className="divide-y divide-line">
        {filtered.map((entry, index) => (
          <div key={entry.item} className="grid grid-cols-[52px_1fr_160px] items-center px-4 py-4 transition-colors hover:bg-surface">
            <span className="text-sm tabular-nums text-muted">{index + 1}</span>
            <div className="pr-5">
              <p className="text-sm font-medium leading-6">{entry.item}</p>
              <p className="mt-0.5 text-xs text-muted">{entry.basis}</p>
            </div>
            <strong className="text-right tabular-nums">{entry.fee}</strong>
          </div>
        ))}
        <Empty show={filtered.length === 0} />
      </div>
    </div>
  );
}

function useFiltered<T extends EthiopianRate>(entries: T[], query: string) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? entries.filter(
          (entry) =>
            entry.program.toLowerCase().includes(normalized) ||
            entry.category.toLowerCase().includes(normalized),
        )
      : entries;
  }, [entries, query]);
}

function Empty({ show }: { show: boolean }) {
  return show ? (
    <p className="px-5 py-12 text-center text-sm text-muted">
      No fee matches that search.
    </p>
  ) : null;
}
