"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from "@/lib/api";
import { AuthUser } from "@/lib/api/auth";
import { FeedImage } from "@/lib/types";

const uniqueById = (images: FeedImage[]) => {
  const imageMap = new Map<number, FeedImage>();
  images.forEach((image) => imageMap.set(image.id, image));
  return Array.from(imageMap.values());
};

export function useFavorites(user: AuthUser | null) {
  const router = useRouter();
  const [favoriteImages, setFavoriteImages] = useState<FeedImage[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      if (!user) {
        setFavoriteImages([]);
        return;
      }

      setIsLoadingFavorites(true);
      try {
        const images = await listFavorites();
        if (!cancelled) {
          setFavoriteImages(images);
        }
      } catch {
        if (!cancelled) {
          setFavoriteImages([]);
          toast.error("Unable to load your favorites.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFavorites(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const favoriteImageIds = useMemo(
    () => favoriteImages.map((image) => image.id),
    [favoriteImages],
  );

  const favoriteIdSet = useMemo(
    () => new Set(favoriteImageIds),
    [favoriteImageIds],
  );

  const toggleFavorite = useCallback(
    async (image: FeedImage) => {
      if (!user) {
        toast.info("Please log in to save favorites.");
        router.push("/login");
        return;
      }

      const isAlreadyFavorite = favoriteIdSet.has(image.id);
      const previousImages = favoriteImages;

      setFavoriteImages((currentImages) =>
        isAlreadyFavorite
          ? currentImages.filter((favoriteImage) => favoriteImage.id !== image.id)
          : uniqueById([image, ...currentImages]),
      );

      try {
        if (isAlreadyFavorite) {
          await removeFavorite(image.id);
        } else {
          const savedImage = await addFavorite(image.id);
          if (savedImage) {
            setFavoriteImages((currentImages) =>
              uniqueById([
                savedImage,
                ...currentImages.filter((favoriteImage) => favoriteImage.id !== image.id),
              ]),
            );
          }
        }
      } catch {
        setFavoriteImages(previousImages);
        toast.error("Unable to update favorites.");
      }
    },
    [favoriteIdSet, favoriteImages, router, user],
  );

  return {
    favoriteIdSet,
    favoriteImageIds,
    favoriteImages,
    isLoadingFavorites,
    toggleFavorite,
  };
}
