type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : "text-left"}`}
    >
      {eyebrow && (
        <span className="inline-block text-sm font-bold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2
        className={`${
          eyebrow ? "mt-3" : ""
        } text-3xl sm:text-4xl lg:text-5xl font-black font-accent tracking-tight text-ink leading-[1.15]`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base sm:text-lg text-muted font-medium leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
