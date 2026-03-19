export type FeedSource = "api" | "mock";

export type FeedTag = {
  id: number;
  name: string;
};

export type FeedCategory = {
  id: number;
  name: string;
  source: FeedSource;
};

export type FeedImage = {
  id: number;
  title: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  tags: FeedTag[];
  width: number;
  height: number;
  source: FeedSource;
};

export type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
  error?: string;
};

export type UnknownRecord = Record<string, unknown>;
