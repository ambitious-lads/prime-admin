import type { ReactNode } from "react";
import { ANDROID_DOWNLOAD_URL } from "@/lib/mobile-release";

export default function DownloadModal({
  className = "",
  label = "Download the app",
}: {
  className?: string;
  label?: ReactNode;
}) {
  return (
      <a href={ANDROID_DOWNLOAD_URL} className={className}>
        {label}
      </a>
  );
}
