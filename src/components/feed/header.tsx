type HeaderProps = {
  totalItems: number;
};

export function FeedHeader({ totalItems }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,243,238,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f4d3c] text-lg font-semibold text-[#f7efe8] shadow-[0_14px_40px_rgba(31,77,60,0.28)]">
            P
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#7b6352]">
              Ponterest Feed
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-[#22170f] sm:text-2xl">
              Discover visual ideas worth saving
            </h1>
          </div>
        </div>
        <div className="hidden rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm text-[#5d4a3e] shadow-[0_10px_30px_rgba(34,23,15,0.06)] sm:block">
          {totalItems} images ready to explore
        </div>
      </div>
    </header>
  );
}
