"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type SearchBarProps = {
  initialValue: string;
  onSearch: (value: string) => void;
};

export function SearchBar({
  initialValue,
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex h-11 min-w-0 items-center gap-3 rounded-full border border-black/5 bg-[#f7f2ed]/95 px-4 shadow-[0_10px_24px_rgba(34,23,15,0.05)] transition focus-within:border-[#fb923c]/30 focus-within:bg-[#fbf6f1] focus-within:ring-2 focus-within:ring-[#fb923c]/25 sm:h-12">
        <Search size={15} className="shrink-0 text-[#886c58]" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by image name, tag, or category"
          className="w-full min-w-0 bg-transparent text-sm text-[#2a1d14] outline-none placeholder:text-[#9b7f6d]"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6f5748] transition hover:bg-[#eaded4] hover:text-[#22170f]"
            aria-label="Clear search"
          >
            <X size={17} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>
    </form>
  );
}
