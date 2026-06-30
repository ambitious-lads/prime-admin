import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/utils/format";

export function UserCell({
  name,
  phone,
  avatarUrl,
}: {
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
        <AvatarFallback>{initialsOf(name || "?")}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{name || "—"}</p>
        {phone ? <p className="truncate text-xs text-muted">{phone}</p> : null}
      </div>
    </div>
  );
}
