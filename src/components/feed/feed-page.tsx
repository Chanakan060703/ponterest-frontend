"use client";

import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { ActiveFilters } from "@/components/feed/active-filters";
import { CategoryTabs } from "@/components/feed/category-tabs";
import { FeedHeader } from "@/components/feed/header";
import { ImageGrid } from "@/components/feed/image-grid";
import { SearchBar } from "@/components/feed/search-bar";
import { fetchCategories, fetchImages, searchImages } from "@/lib/api";
import { FeedCategory, FeedImage } from "@/lib/types";

const PAGE_SIZE = 10;

export function FeedPage() {
  const [categories, setCategories] = useState<FeedCategory[]>([
    { id: "all", name: "All", source: "mock" },
  ]);
  const [images, setImages] = useState<FeedImage[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedTag, setSelectedTag] = useState<{ id: string; name: string } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const deferredSearch = useDeferredValue(submittedSearch);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      const nextCategories = await fetchCategories();
      if (!cancelled) {
        setCategories(nextCategories);
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextImages = deferredSearch
          ? await searchImages(deferredSearch)
          : await fetchImages({ categoryId: selectedCategoryId });

        if (cancelled) {
          return;
        }

        setImages(nextImages);
      } catch {
        if (!cancelled) {
          setImages([]);
          setErrorMessage("Something went wrong while loading the feed.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, [selectedCategoryId, deferredSearch]);

  const filteredImages = images.filter((image) => {
    if (selectedCategoryId !== "all" && image.categoryId !== selectedCategoryId) {
      return false;
    }

    if (!selectedTag) {
      return true;
    }

    return image.tags.some((tag) => tag.id === selectedTag.id);
  });

  const visibleImages = filteredImages.slice(0, visibleCount);
  const selectedCategoryLabel =
    categories.find((category) => category.id === selectedCategoryId)?.name ?? "All";
  const usingFallback = visibleImages.length > 0 && visibleImages.every((image) => image.source === "mock");

  useEffect(() => {
    if (selectedTag && !filteredImages.some((image) => image.tags.some((tag) => tag.id === selectedTag.id))) {
      setSelectedTag(null);
    }
  }, [filteredImages, selectedTag]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategoryId, deferredSearch, selectedTag]);

  const handleLoadMore = useEffectEvent(() => {
    if (visibleCount < filteredImages.length) {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredImages.length));
    }
  });

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          handleLoadMore();
        }
      },
      {
        rootMargin: "0px 0px 320px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSearch = (value: string) => {
    setSelectedTag(null);
    setSearchText(value);
    setSubmittedSearch(value.trim());
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedTag(null);
  };

  const handleTagSelect = (tagId: string, tagName: string) => {
    setSelectedTag((current) =>
      current?.id === tagId ? null : { id: tagId, name: tagName },
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff6ef_0%,#f5efe8_40%,#f2ebe3_100%)] text-[#23170f]">
      <FeedHeader totalItems={filteredImages.length} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <SearchBar
            initialValue={searchText}
            isLoading={isLoading}
            onSearch={handleSearch}
          />
          <div className="rounded-[2rem] border border-black/5 bg-[#22170f] p-5 text-[#f8efe6] shadow-[0_22px_55px_rgba(34,23,15,0.12)]">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#d7c2b3]">
              Visual briefing
            </p>
            <p className="mt-3 text-base leading-7 text-[#f6e8de]">
              Browse mixed-size image cards, jump across categories, and tap any keyword
              to instantly narrow the feed without touching the backend.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-[2rem] border border-black/5 bg-[rgba(255,255,255,0.72)] p-4 shadow-[0_24px_60px_rgba(34,23,15,0.06)] sm:p-5">
          <CategoryTabs
            categories={categories}
            activeCategoryId={selectedCategoryId}
            onSelect={handleCategorySelect}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ActiveFilters
              categoryLabel={selectedCategoryLabel}
              tagLabel={selectedTag?.name ?? null}
              searchLabel={submittedSearch}
              onClearTag={() => setSelectedTag(null)}
              onClearSearch={() => handleSearch("")}
            />
            <p className="text-sm text-[#70594c]">
              Showing {Math.min(visibleImages.length, filteredImages.length)} of{" "}
              {filteredImages.length} images
            </p>
          </div>
        </section>

        {usingFallback ? (
          <div className="rounded-[1.5rem] border border-[#e9dccf] bg-[#fff6ee] px-4 py-3 text-sm text-[#765a4a]">
            Backend data is unavailable or empty right now, so the feed is showing placeholder
            images and sample keywords instead.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-[1.5rem] border border-[#f2cbc6] bg-[#fff0ee] px-4 py-3 text-sm text-[#9b463d]">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div
                key={`skeleton-${index + 1}`}
                className="h-80 animate-pulse rounded-[1.75rem] bg-white/70"
              />
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <>
            <ImageGrid
              images={visibleImages}
              activeTagId={selectedTag?.id ?? null}
              onTagSelect={handleTagSelect}
            />
            <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center">
              {visibleImages.length < filteredImages.length ? (
                <p className="text-sm text-[#80675a]">Scroll for more inspiration</p>
              ) : (
                <p className="text-sm text-[#9c8578]">You&apos;ve reached the end of this set</p>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/80 px-6 py-16 text-center shadow-[0_20px_50px_rgba(34,23,15,0.05)]">
            <h2 className="text-2xl font-semibold tracking-tight text-[#24170f]">
              No images match the current filters
            </h2>
            <p className="mt-3 text-sm text-[#725b4d]">
              Try clearing the search or selected keyword to widen the feed again.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
