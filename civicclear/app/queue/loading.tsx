import { LoadingBlock } from "@/shared/ui/loading-block";

export default function Loading() {
  return (
    <div className="rise-in space-y-4 py-2">
      <LoadingBlock label="Loading queue…" />
    </div>
  );
}
