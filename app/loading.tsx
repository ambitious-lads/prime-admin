import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-brand"
      role="status"
      aria-live="polite"
      aria-label="Loading Prime UAT"
    >
      <div className="flex -translate-y-4 flex-col items-center">
        <Image
          src="/images/white_logo.png"
          alt="Prime UAT"
          width={168}
          height={168}
          priority
          className="h-36 w-36 object-contain sm:h-40 sm:w-40"
        />

        <div
          className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-white/25 sm:w-52"
          role="progressbar"
          aria-label="Loading page"
          aria-valuetext="Loading"
        >
          <span className="prime-loading-line block h-full rounded-full bg-white" />
        </div>
      </div>
      <span className="sr-only">Loading Prime UAT</span>
    </div>
  );
}