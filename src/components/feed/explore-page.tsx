"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  ChevronDown,
  Check,
  Grid2X2,
  ImageIcon,
  Layers3,
  LogOut,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { CreateImageModal } from "@/components/feed/create-image-modal";
import { ImageGrid } from "@/components/feed/image-grid";
import { ImagePreviewModal } from "@/components/feed/image-preview-modal";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFavorites } from "@/hooks/use-favorites";
import { FeedImage } from "@/lib/types";

type ExploreTab = "pins" | "boards" | "collages";
type SortMode = "recent" | "oldest" | "title";

const uniqueById = (images: FeedImage[]) => {
  const imageMap = new Map<number, FeedImage>();
  images.forEach((image) => imageMap.set(image.id, image));
  return Array.from(imageMap.values());
};

export function ExplorePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    favoriteIdSet,
    favoriteImages,
    isLoadingFavorites,
    toggleFavorite,
  } = useFavorites(user);
  const [selectedImage, setSelectedImage] = useState<FeedImage | null>(null);
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState<{ id: number; name: string } | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ExploreTab>("pins");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [showCreatedOnly, setShowCreatedOnly] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  const displayName = user?.name || user?.email.split("@")[0] || "Chonakan";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const sortedImages = useMemo(() => {
    const nextImages = [...favoriteImages];

    if (sortMode === "oldest") {
      return nextImages.reverse();
    }

    if (sortMode === "title") {
      return nextImages.sort((first, second) =>
        first.title.localeCompare(second.title),
      );
    }

    return nextImages;
  }, [favoriteImages, sortMode]);

  const visibleImages = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return sortedImages.filter((image) => {
      const matchesSearch =
        !query ||
        image.title.toLowerCase().includes(query) ||
        image.categoryName.toLowerCase().includes(query) ||
        image.tags.some((tag) => tag.name.toLowerCase().includes(query));
      const matchesTag =
        !activeTag || image.tags.some((tag) => tag.id === activeTag.id);
      const matchesCategory =
        activeCategoryId === null || image.categoryId === activeCategoryId;
      const matchesOwner = !showCreatedOnly || image.source === "api";

      return matchesSearch && matchesTag && matchesCategory && matchesOwner;
    });
  }, [activeCategoryId, activeTag, searchText, showCreatedOnly, sortedImages]);

  const boards = useMemo(() => {
    const boardMap = new Map<
      number,
      { id: number; name: string; images: FeedImage[] }
    >();

    favoriteImages.forEach((image) => {
      const board = boardMap.get(image.categoryId) ?? {
        id: image.categoryId,
        name: image.categoryName,
        images: [],
      };
      board.images.push(image);
      boardMap.set(image.categoryId, board);
    });

    return Array.from(boardMap.values()).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [favoriteImages]);

  const collages = useMemo(() => {
    const collageMap = new Map<
      number,
      { id: number; name: string; images: FeedImage[] }
    >();

    favoriteImages.forEach((image) => {
      image.tags.forEach((tag) => {
        const collage = collageMap.get(tag.id) ?? {
          id: tag.id,
          name: tag.name,
          images: [],
        };
        collage.images = uniqueById([...collage.images, image]);
        collageMap.set(tag.id, collage);
      });
    });

    return Array.from(collageMap.values())
      .filter((collage) => collage.images.length > 0)
      .sort((first, second) => second.images.length - first.images.length);
  }, [favoriteImages]);

  const handleTagSelect = (tagId: number, tagName: string) => {
    setActiveTab("pins");
    setActiveCategoryId(null);
    setActiveTag((current) =>
      current?.id === tagId ? null : { id: tagId, name: tagName },
    );
  };

  const handleBoardSelect = (categoryId: number) => {
    setActiveTab("pins");
    setActiveTag(null);
    setActiveCategoryId(categoryId);
  };

  const handleCollageSelect = (tagId: number, tagName: string) => {
    setActiveTab("pins");
    setActiveCategoryId(null);
    setActiveTag({ id: tagId, name: tagName });
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied.");
    } catch {
      toast.error("Unable to copy the profile link.");
    }
  };

  const handleBusinessSwitch = () => {
    setIsAccountMenuOpen(false);
    toast.info("Business profiles are not available yet.");
  };

  const handleAddAccount = () => {
    setIsAccountMenuOpen(false);
    toast.info("Log out first to add another account.");
  };

  const handleLogout = async () => {
    setIsAccountMenuOpen(false);
    await logout();
  };

  const clearFilters = () => {
    setSearchText("");
    setActiveTag(null);
    setActiveCategoryId(null);
    setShowCreatedOnly(false);
  };

  const activeCategoryName =
    activeCategoryId === null
      ? null
      : boards.find((board) => board.id === activeCategoryId)?.name ?? null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff6ef_0%,#f5efe8_42%,#f2ebe3_100%)] text-[#23170f]">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center gap-4">
          <label className="flex min-h-14 flex-1 items-center gap-3 rounded-[1.5rem] border border-black/5 bg-white/85 px-5 text-[#70594c] shadow-[0_18px_45px_rgba(34,23,15,0.06)]">
            <Search size={22} />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search your saved ideas"
              className="w-full bg-transparent text-base font-medium text-[#2a1d14] outline-none placeholder:text-[#9b7f6d]"
            />
          </label>

          <div ref={accountMenuRef} className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((current) => !current)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#fb923c] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(251,146,60,0.28)] transition hover:scale-105"
              aria-label="Open account menu"
              aria-expanded={isAccountMenuOpen}
            >
              {initial}
            </button>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((current) => !current)}
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#ede4dc] text-[#5d4a3e] transition hover:bg-[#e3d6cb] sm:flex"
              aria-label="Open account menu"
              aria-expanded={isAccountMenuOpen}
            >
              <ChevronDown
                size={22}
                className={isAccountMenuOpen ? "rotate-180 transition" : "transition"}
              />
            </button>

            {isAccountMenuOpen ? (
              <div className="absolute right-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-2rem))] rounded-[1.25rem] border border-black/5 bg-white p-2 text-[#22170f] shadow-[0_24px_70px_rgba(34,23,15,0.18)]">
                <p className="px-3 py-2 text-xs font-medium text-[#80675a]">
                  Currently signed in
                </p>

                <div className="flex items-center gap-3 rounded-[1rem] border-2 border-[#5f6dff] bg-[#fffaf6] p-3 shadow-[0_0_0_2px_rgba(95,109,255,0.08)]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fb923c] text-2xl font-semibold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold">
                      {displayName}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#70594c]">
                      Personal
                    </p>
                    <p className="mt-2 truncate text-sm text-[#80675a]">
                      {user?.email ?? "No email available"}
                    </p>
                  </div>
                  <Check size={20} className="shrink-0 text-[#22170f]" />
                </div>

                <button
                  type="button"
                  onClick={handleBusinessSwitch}
                  className="mt-2 flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm font-semibold transition hover:bg-[#f7f2ed]"
                >
                  <BriefcaseBusiness size={18} />
                  Switch to business
                </button>

                <p className="px-3 pb-1 pt-4 text-xs font-medium text-[#80675a]">
                  Your account
                </p>

                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm font-semibold transition hover:bg-[#f7f2ed]"
                >
                  <Plus size={18} />
                  Add another account
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left text-sm font-semibold text-[#9b463d] transition hover:bg-[#fff0ee]"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid gap-8 rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-[0_24px_60px_rgba(34,23,15,0.06)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#806758]">
              Saved library
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#22170f] sm:text-5xl">
              Ideas you saved
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-6 text-base font-semibold">
              {[
                { id: "pins" as const, label: "Pins", icon: ImageIcon },
                { id: "boards" as const, label: "Boards", icon: Grid2X2 },
                { id: "collages" as const, label: "Collages", icon: Layers3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "flex items-center gap-2 border-b-2 pb-2 transition",
                      isActive
                        ? "border-[#22170f] text-[#22170f]"
                        : "border-transparent text-[#80675a] hover:text-[#22170f]",
                    ].join(" ")}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="flex items-center gap-4 lg:justify-end">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#fb923c] text-3xl font-semibold text-white shadow-[0_14px_36px_rgba(251,146,60,0.25)]">
              {initial}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold text-[#22170f]">
                {displayName}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#70594c]">
                Following 0 people
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareProfile}
              className="ml-auto flex items-center gap-2 rounded-[1.25rem] bg-[#ede4dc] px-5 py-3 text-sm font-semibold text-[#4f3c30] transition hover:bg-[#e3d6cb]"
            >
              <Share2 size={17} />
              Share profile
            </button>
          </aside>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="h-12 appearance-none rounded-full border border-black/5 bg-white/80 pl-11 pr-9 text-sm font-semibold text-[#5f493c] outline-none transition hover:bg-white"
                aria-label="Sort saved ideas"
              >
                <option value="recent">Newest saved</option>
                <option value="oldest">Oldest saved</option>
                <option value="title">Title A-Z</option>
              </select>
              <SlidersHorizontal
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#80675a]"
              />
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#80675a]"
              />
            </div>
            <button
              type="button"
              className="flex h-12 items-center gap-2 rounded-full border-2 border-[#fb923c] bg-white/80 px-4 text-sm font-semibold text-[#22170f] shadow-[0_0_0_3px_rgba(251,146,60,0.12)]"
            >
              <Star size={18} fill="currentColor" />
              Favorites
            </button>
            <button
              type="button"
              onClick={() => setShowCreatedOnly((current) => !current)}
              className={[
                "flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
                showCreatedOnly
                  ? "bg-[#22170f] text-[#f8efe6]"
                  : "bg-white/80 text-[#5f493c] hover:bg-white",
              ].join(" ")}
              aria-pressed={showCreatedOnly}
            >
              <UserRound size={17} />
              Created by you
            </button>
            {activeCategoryName ? (
              <button
                type="button"
                onClick={() => setActiveCategoryId(null)}
                className="rounded-full bg-[#ede4dc] px-4 py-3 text-sm font-semibold text-[#5f493c]"
              >
                {activeCategoryName} x
              </button>
            ) : null}
            {activeTag ? (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="rounded-full bg-[#ffe3e8] px-4 py-3 text-sm font-semibold text-[#b81742]"
              >
                #{activeTag.name} x
              </button>
            ) : null}
            {(searchText || activeTag || activeCategoryId !== null || showCreatedOnly) ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-4 py-3 text-sm font-semibold text-[#70594c] transition hover:bg-white/70"
              >
                Clear
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-[1.25rem] bg-[#fb923c] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_36px_rgba(251,146,60,0.24)] transition hover:bg-[#f97316]"
          >
            Create
          </button>
        </section>

        {activeTab === "pins" ? (
          visibleImages.length > 0 ? (
            <ImageGrid
              images={visibleImages}
              activeTagId={activeTag?.id ?? null}
              onTagSelect={handleTagSelect}
              onImageSelect={setSelectedImage}
              showFavoriteAction
              favoriteImageIds={favoriteIdSet}
              onFavoriteToggle={toggleFavorite}
            />
          ) : (
            <EmptyState
              title={
                isLoadingFavorites
                  ? "Loading favorites"
                  : favoriteImages.length === 0
                    ? "No favorites yet"
                    : "No saved ideas found"
              }
              description={
                isLoadingFavorites
                  ? "Your saved ideas are being loaded."
                  : favoriteImages.length === 0
                  ? "Go to Home and tap the heart on images you want to keep here."
                  : "Try changing your search, sort, board, or tag filters."
              }
            />
          )
        ) : null}

        {activeTab === "boards" ? (
          boards.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <button
                  key={board.id}
                  type="button"
                  onClick={() => handleBoardSelect(board.id)}
                  className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/80 text-left shadow-[0_20px_50px_rgba(34,23,15,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="grid h-44 grid-cols-3 gap-1 bg-[#efe7e1] p-1">
                    {board.images.slice(0, 3).map((image) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt=""
                        className="h-full w-full rounded-[1rem] object-cover"
                      />
                    ))}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#22170f]">
                      {board.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#70594c]">
                      {board.images.length} saved pins
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No boards yet"
              description="Save images from Home and they will be grouped by category here."
            />
          )
        ) : null}

        {activeTab === "collages" ? (
          collages.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {collages.map((collage) => (
                <button
                  key={collage.id}
                  type="button"
                  onClick={() => handleCollageSelect(collage.id, collage.name)}
                  className="rounded-[1.5rem] border border-black/5 bg-white/80 p-4 text-left shadow-[0_20px_50px_rgba(34,23,15,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="grid aspect-square grid-cols-2 gap-2">
                    {collage.images.slice(0, 4).map((image) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt=""
                        className="h-full w-full rounded-[1rem] object-cover"
                      />
                    ))}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#22170f]">
                    #{collage.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#70594c]">
                    {collage.images.length} related pins
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No collages yet"
              description="Saved image tags will become quick collage groups here."
            />
          )
        ) : null}
      </main>

      <ImagePreviewModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onTagSelect={handleTagSelect}
        showFavoriteAction
        isFavorite={selectedImage ? favoriteIdSet.has(selectedImage.id) : false}
        onFavoriteToggle={toggleFavorite}
      />
      <CreateImageModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-black/10 bg-white/70 px-6 text-center shadow-[0_20px_50px_rgba(34,23,15,0.04)]">
      <h2 className="text-2xl font-semibold tracking-tight text-[#24170f]">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#725b4d]">
        {description}
      </p>
    </section>
  );
}
