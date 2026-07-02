"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coursesApi } from "@/lib/api/endpoints";
import { formatDuration } from "@/lib/utils/format";
import type { CourseMaterial } from "@/lib/api/types";

function isUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

function isDirectVideoUrl(value: string) {
  return /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(value.trim());
}

function paragraphsFrom(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

type MaterialReaderProps = {
  material: CourseMaterial;
  onProgress: (percentage: number) => void;
};

export const MaterialReader = forwardRef<HTMLDivElement, MaterialReaderProps>(
  function MaterialReader({ material, onProgress }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
    const lastReported = useRef(0);
    const lastVideoReported = useRef(0);
    const [embedFailed, setEmbedFailed] = useState(false);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const range = el.scrollHeight - el.clientHeight;
          const pct = range > 0 ? Math.round((el.scrollTop / range) * 100) : 0;
          onProgress(pct);
          if (pct - lastReported.current >= 10) {
            lastReported.current = pct;
            coursesApi
              .progress(material.id, { scrollPercentage: pct })
              .catch(() => {});
          }
        });
      };
      el.addEventListener("scroll", onScroll);
      return () => {
        el.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }, [material.id, onProgress]);

    const materialType = material.type.toLowerCase();
    const source =
      material.url ??
      material.remoteUrl ??
      material.content ??
      material.htmlContent ??
      "";
    const sourceIsUrl = Boolean(source) && isUrl(source);
    const isVideo = materialType === "video";
    const isPdf = materialType === "pdf";

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isVideo) return;

      const reportProgress = () => {
        const duration =
          video.duration || material.durationSeconds || material.videoDurationSeconds || 0;
        if (!duration) return;
        const pct = Math.min(100, Math.round((video.currentTime / duration) * 100));
        onProgress(pct);
        if (pct - lastVideoReported.current >= 10) {
          lastVideoReported.current = pct;
          coursesApi
            .progress(material.id, {
              watchedSeconds: Math.floor(video.currentTime),
              timeSpentSeconds: 10,
            })
            .catch(() => {});
        }
      };

      video.addEventListener("timeupdate", reportProgress);
      video.addEventListener("ended", reportProgress);

      return () => {
        video.removeEventListener("timeupdate", reportProgress);
        video.removeEventListener("ended", reportProgress);
      };
    }, [
      isVideo,
      material.durationSeconds,
      material.id,
      material.videoDurationSeconds,
      onProgress,
    ]);

    const renderBody = () => {
      if (isVideo && sourceIsUrl && isDirectVideoUrl(source)) {
        return (
          <div className="overflow-hidden rounded-2xl border border-line bg-black">
            <video
              ref={videoRef}
              src={source}
              title={material.title}
              className="aspect-video h-full w-full bg-black"
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              playsInline
              preload="metadata"
            />
          </div>
        );
      }

      if (isVideo && sourceIsUrl) {
        return (
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black">
            <iframe
              src={source}
              title={material.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      if (sourceIsUrl && !embedFailed) {
        return (
          <div className="space-y-3">
            <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-line bg-surface">
              <iframe
                src={source}
                title={material.title}
                className="h-full w-full"
                onError={() => setEmbedFailed(true)}
              />
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={source} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Open material
              </a>
            </Button>
          </div>
        );
      }

      if (sourceIsUrl) {
        return (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-14 text-center">
            <FileText className="h-8 w-8 text-brand" />
            <p className="text-sm text-muted">
              This material opens in a new tab.
            </p>
            <Button asChild>
              <a href={source} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Open material
              </a>
            </Button>
          </div>
        );
      }

      const paragraphs = source ? paragraphsFrom(source) : [];
      if (paragraphs.length === 0) {
        return (
          <p className="text-sm text-muted">
            No readable content is available for this material yet.
          </p>
        );
      }
      return (
        <article className="prose-reader max-w-none space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-[15px] leading-7 text-ink/90">
              {para}
            </p>
          ))}
        </article>
      );
    };

    return (
      <div
        ref={innerRef}
        className="h-full overflow-y-auto px-6 py-8 sm:px-10"
      >
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {isVideo ? "Video" : isPdf ? "PDF" : "Reading"}
            {material.durationSeconds
              ? ` · ${formatDuration(material.durationSeconds)}`
              : ""}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
            {material.title}
          </h1>
          <div className="mt-6">{renderBody()}</div>
          <div className="h-32" aria-hidden />
        </div>
      </div>
    );
  },
);
