export type FeedSource = "api" | "mock";

export type FeedTag = {
  id: string;
  name: string;
};

export type FeedCategory = {
  id: string;
  name: string;
  source: FeedSource;
};

export type FeedImage = {
  id: string;
  title: string;
  imageUrl: string;
  categoryId: string;
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
