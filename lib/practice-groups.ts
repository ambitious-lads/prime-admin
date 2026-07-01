export type PracticeGrouping = "verbal" | "quantitative" | "analytical";

export const PRACTICE_GROUPS: {
  key: PracticeGrouping;
  label: string;
  description: string;
  accentColor: string;
}[] = [
  {
    key: "verbal",
    label: "Verbal",
    description: "Reading comprehension, vocabulary, grammar, and verbal reasoning.",
    accentColor: "#4F46E5",
  },
  {
    key: "quantitative",
    label: "Quantitative",
    description: "Algebra, geometry, arithmetic, probability, and data interpretation.",
    accentColor: "#EF4444",
  },
  {
    key: "analytical",
    label: "Analytical",
    description: "Logical deduction, patterns, puzzles, and data sufficiency.",
    accentColor: "#10B981",
  },
];

export const PRACTICE_GROUP_LABELS: Record<PracticeGrouping, string> = {
  verbal: "Verbal",
  quantitative: "Quantitative",
  analytical: "Analytical",
};

export function isPracticeGrouping(value: string): value is PracticeGrouping {
  return value === "verbal" || value === "quantitative" || value === "analytical";
}
