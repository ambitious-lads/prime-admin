import { RequireUser } from "@/components/shared/route-guards";
import { StudentShell } from "@/components/student/shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireUser>
      <StudentShell>{children}</StudentShell>
    </RequireUser>
  );
}
