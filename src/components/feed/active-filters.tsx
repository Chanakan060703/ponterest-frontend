type ActiveFiltersProps = {
  categoryLabel: string;
  tagLabel: string | null;
  searchLabel: string;
  onClearTag: () => void;
  onClearSearch: () => void;
};

export function ActiveFilters({
  categoryLabel,
  tagLabel,
  searchLabel,
  onClearTag,
  onClearSearch,
}: ActiveFiltersProps) {
  const hasSearch = searchLabel.trim().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-[#e7ddd5] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#6a5345]">
        {categoryLabel}
      </span>
      {tagLabel ? (
        <button
          type="button"
          onClick={onClearTag}
          className="rounded-full bg-[#dcece5] px-3 py-1.5 text-sm text-[#174635]"
        >
          #{tagLabel} ×
        </button>
      ) : null}
      {hasSearch ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="rounded-full bg-white px-3 py-1.5 text-sm text-[#5d493f] shadow-[0_8px_20px_rgba(34,23,15,0.08)]"
        >
          Search: {searchLabel} ×
        </button>
      ) : null}
    </div>
  );
}
