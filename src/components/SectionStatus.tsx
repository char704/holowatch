import { Loader2, AlertTriangle } from "lucide-react";

export function LoadingCard({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 bg-brand-card rounded-xl border border-[#232333]">
      <Loader2 className="w-6 h-6 text-brand-purple animate-spin" />
      <p className="text-xs text-gray-400 font-sans">{label}</p>
    </div>
  );
}

export function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 bg-brand-card rounded-xl border border-brand-coral/30 text-center px-6">
      <AlertTriangle className="w-6 h-6 text-brand-coral" />
      <p className="text-sm text-gray-200 font-sans font-medium">Failed to load data</p>
      <p className="text-xs text-gray-500 font-sans max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-4 py-2 text-xs bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg transition-colors font-sans cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}
