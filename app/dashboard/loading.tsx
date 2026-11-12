import { DashboardSkeleton } from "@/components/loading-skeletons";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]">
      <DashboardSkeleton />
    </div>
  );
}
