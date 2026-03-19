import { FeedCategory, FeedImage, FeedTag } from "@/lib/types";

const mockCategoryNames = [
  "Nature",
  "Travel",
  "Food",
  "Interiors",
  "Street",
  "Minimal",
] as const;

const mockTagGroups = [
  ["golden hour", "mountains", "clouds", "cinematic"],
  ["weekend", "coastal", "sunny", "escape"],
  ["dessert", "artisan", "coffee", "sweet tooth"],
  ["studio", "calm", "texture", "home decor"],
  ["city lights", "night", "urban", "motion"],
  ["soft tones", "editorial", "clean", "modern"],
  ["wildlife", "forest", "green", "macro"],
  ["market", "culture", "colorful", "candid"],
] as const;

const mockTitles = [
  "Morning Ridge",
  "Seaside Pause",
  "Freshly Baked Mood",
  "Warm Minimal Loft",
  "Late Night Crosswalk",
  "Quiet Product Story",
  "Rainforest Detail",
  "Weekend Bazaar",
  "Sunset Overlook",
  "Ceramic Brunch",
  "Gallery Corner",
  "Neon Alley",
  "Studio Shelf",
  "Lakeside Drive",
  "Tropical Afternoon",
  "Amber Roast",
  "Concrete Calm",
  "Wild Trail",
  "Window Light",
  "Rooftop Motion",
  "Coastal Table",
  "Sketchbook Desk",
  "Foggy Pines",
  "City Cafe",
];

const mockSizes = [
  [600, 400], // Short & Wide
  [600, 900], // Tall
  [600, 600], // Square
  [600, 1100], // Very Tall
  [600, 500], // Medium Short
  [600, 800], // Standard
  [600, 1200], // Extremely Tall
  [600, 450], // Wide
] as const;

const categories: FeedCategory[] = mockCategoryNames.map((name, index) => ({
  id: -(index + 1),
  name,
  source: "mock",
}));

const buildTags = (seed: number): FeedTag[] => {
  const group = mockTagGroups[seed % mockTagGroups.length];
  return group.map((name, index) => ({
    id: -((seed + 1) * 100 + index + 1),
    name,
  }));
};

export const mockImages: FeedImage[] = mockTitles.map((title, index) => {
  const [width, height] = mockSizes[index % mockSizes.length];
  const category = categories[index % categories.length];
  const lines = `${width}x${height}`;
  const label = encodeURIComponent(`${title}\n${lines}`);

  return {
    id: -(index + 1),
    title,
    imageUrl: `https://placehold.co/${width}x${height}/EADFD2/3F3027?text=${label}`,
    categoryId: category.id,
    categoryName: category.name,
    tags: buildTags(index),
    width,
    height,
    source: "mock",
  };
});

export const mockCategories: FeedCategory[] = categories;

export const getMockFeedImages = () => mockImages;

export const getMockCategories = () => mockCategories;
