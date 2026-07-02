import Link from "next/link";

type StoreBadgesProps = {
  /** Visual theme — "dark" badges on light backgrounds, "light" badges on dark backgrounds. */
  variant?: "dark" | "light";
  className?: string;
};

// Replace these with the real store listings once published.
const APP_STORE_URL = "https://apps.apple.com/app/prime";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=app.prime";

export default function StoreBadges({
  variant = "dark",
  className = "",
}: StoreBadgesProps) {
  const base =
    "inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]";
  const styles =
    variant === "dark"
      ? "bg-ink text-white hover:bg-ink/90 shadow-lg shadow-ink/10"
      : "bg-white text-ink hover:bg-white/90 shadow-lg shadow-black/10";

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Prime UAT on the App Store"
        className={`${base} ${styles}`}
      >
        <svg
          className="h-7 w-7 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.05 12.536c-.024-2.51 2.05-3.715 2.143-3.774-1.168-1.71-2.984-1.944-3.63-1.97-1.546-.156-3.017.91-3.8.91-.78 0-1.99-.886-3.273-.862-1.684.025-3.237.978-4.105 2.487-1.75 3.03-.448 7.52 1.255 9.984.833 1.206 1.825 2.561 3.127 2.513 1.255-.05 1.73-.812 3.246-.812 1.515 0 1.943.812 3.27.787 1.35-.025 2.206-1.23 3.03-2.44.955-1.4 1.347-2.756 1.37-2.826-.03-.014-2.63-1.01-2.656-4.007l.024.01zM14.69 4.94c.692-.84 1.158-2.006 1.03-3.169-.997.04-2.205.664-2.92 1.503-.642.744-1.203 1.93-1.052 3.07 1.112.087 2.25-.565 2.942-1.404z" />
        </svg>
        <span className="flex flex-col leading-none text-left">
          <span className="text-[0.65rem] font-medium opacity-70">
            Download on the
          </span>
          <span className="text-lg font-semibold font-display">App Store</span>
        </span>
      </Link>

      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Prime UAT on Google Play"
        className={`${base} ${styles}`}
      >
        <svg
          className="h-7 w-7 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M3.6 2.6 13.1 12 3.6 21.4c-.36-.2-.6-.58-.6-1.04V3.64c0-.46.24-.84.6-1.04z"
            fill="#34A853"
          />
          <path d="M16.7 8.4 13.1 12 3.6 2.6c.34-.2.78-.22 1.16-.01L16.7 8.4z" fill="#EA4335" />
          <path d="M16.7 15.6 4.76 21.42c-.38.2-.82.18-1.16-.02L13.1 12l3.6 3.6z" fill="#FBBC04" />
          <path
            d="m16.7 8.4 4.06 2.23c.78.43.78 1.45 0 1.88L16.7 15.6 13.1 12l3.6-3.6z"
            fill="#4285F4"
          />
        </svg>
        <span className="flex flex-col leading-none text-left">
          <span className="text-[0.65rem] font-medium opacity-70">GET IT ON</span>
          <span className="text-lg font-semibold font-display">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
