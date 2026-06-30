import { RequireAdmin } from "@/components/shared/route-guards";
import { AdminShell } from "@/components/admin/shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}
