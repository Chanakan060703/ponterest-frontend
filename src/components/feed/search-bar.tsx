"use client";

import { FormEvent, useEffect, useState } from "react";

type SearchBarProps = {
  initialValue: string;
  isLoading: boolean;
  onSearch: (value: string) => void;
};

export function SearchBar({
  initialValue,
  isLoading,
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
      className="flex w-full flex-col gap-3 rounded-[2rem] border border-black/5 bg-white/90 p-3 shadow-[0_24px_50px_rgba(34,23,15,0.08)] sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.4rem] bg-[#f7f2ed] px-4 py-3">
        <span className="text-lg text-[#886c58]">⌕</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by image name, tag, or category"
          className="w-full min-w-0 bg-transparent text-sm text-[#2a1d14] outline-none placeholder:text-[#9b7f6d]"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-[#1f4d3c] px-5 py-3 text-sm font-medium text-[#f8efe6] transition hover:bg-[#173c2f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#5e4b40] transition hover:bg-[#f3ece6]"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
