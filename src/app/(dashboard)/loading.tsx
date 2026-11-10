import { PageShell } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <PageShell>
      <Skeleton className="mb-3 h-5 w-24" />
      <Skeleton className="mb-3 h-10 w-72" />
      <Skeleton className="mb-8 h-4 w-full max-w-xl" />
      <div className="space-y-4">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    </PageShell>
  );
}
