import { LoadingBlock } from "@/shared/ui/loading-block";

export default function AnalyticsLoading() {
  return (
    <div className="rise-in py-8">
      <LoadingBlock label="Loading analytics…" />
    </div>
  );
}
