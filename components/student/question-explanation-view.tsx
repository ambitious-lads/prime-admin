import type { QuestionVisual } from "@/lib/api/types";
import { RichDocumentView } from "@/components/student/rich-document-view";

export function QuestionExplanationView({
  explanation,
  visual,
}: {
  explanation?: string | null;
  visual?: QuestionVisual | null;
}) {
  if (visual?.type === "rich_document" && visual.explanation?.blocks?.length) {
    return <RichDocumentView document={visual.explanation} />;
  }

  return explanation ? (
    <p className="whitespace-pre-wrap text-sm leading-6 text-ink">
      {explanation}
    </p>
  ) : null;
}
