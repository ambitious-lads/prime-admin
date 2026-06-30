import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Brand({
  href = "/",
  showName = true,
  className,
}: {
  href?: string;
  showName?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/logo.png"
        alt="Prime UAT"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
      {showName && (
        <span className="text-lg font-black font-accent text-ink">Prime UAT</span>
      )}
    </Link>
  );
}
