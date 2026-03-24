import { AlertTriangle } from "lucide-react";

export function AlertCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-rose-400/25 bg-rose-400/10 p-5">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-rose-300" />
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="mt-3 text-sm text-slate-200">{description}</p>
    </div>
  );
}
