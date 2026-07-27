import { cn } from "@/lib/utils/cn";

const DIAGRAM_TEXT =
  /(?:graph|diagram|chart)\b[\s\S]*(?:\n|[│┌┐└┘─█●])|[│┌┐└┘─█●]{2,}/i;

export function QuestionPrompt({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (DIAGRAM_TEXT.test(text)) {
    return (
      <pre
        className={cn(
          className,
          "max-w-full overflow-x-auto whitespace-pre break-normal font-mono text-sm leading-6 text-ink",
        )}
      >
        {text}
      </pre>
    );
  }

  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words leading-relaxed text-ink",
        className,
      )}
    >
      {text}
    </div>
  );
}
