"use client";

import { Copy, Send } from "lucide-react";
import { toast } from "sonner";
import {
  communityUrl,
  type CommunityContentKind,
} from "@/lib/community-links";
import { Button } from "@/components/ui/button";

export function CommunityShareActions({
  kind,
  id,
  title,
  compact = false,
}: {
  kind: CommunityContentKind;
  id: string;
  title: string;
  compact?: boolean;
}) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(communityUrl(kind, id));
      toast.success("Community link copied.");
    } catch {
      toast.error("Could not copy the link.");
    }
  }

  function shareToTelegram() {
    const url = communityUrl(kind, id);
    const text = `New on Prime UAT: ${title}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (compact) {
    return (
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="Copy community link"
          aria-label={`Copy community link for ${title}`}
          onClick={copyLink}
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Share to Telegram"
          aria-label={`Share ${title} to Telegram`}
          onClick={shareToTelegram}
        >
          <Send />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Copy /> Copy community link
      </Button>
      <Button variant="outline" size="sm" onClick={shareToTelegram}>
        <Send /> Share to Telegram
      </Button>
    </div>
  );
}
