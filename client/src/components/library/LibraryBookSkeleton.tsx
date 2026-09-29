export function LibraryBookSkeleton() {
  return (
    <div className="min-w-0">
      <div className="aspect-[2/3] animate-pulse rounded-2xl bg-white/[0.04]" />

      <div className="mt-4 h-4 w-4/5 animate-pulse rounded bg-white/[0.05]" />

      <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-white/[0.04]" />

      <div className="mt-3 h-1 animate-pulse rounded-full bg-white/[0.05]" />
    </div>
  );
}