import type { PhotoItem } from "@/lib/types";

const PHOTOS_CACHE_KEY = "ciweb.photos.cache.v1";
const RATINGS_KEY = "ciweb.photos.ratings.v1";

const PHOTOS_TTL_MS = 10 * 60 * 1000;

type PhotosCachePayload = {
  savedAt: number;
  photos: PhotoItem[];
};

export type Rating = "liked" | "disliked";
export type RatingsMap = Record<number, Rating>;

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadCachedPhotos(): PhotoItem[] | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(PHOTOS_CACHE_KEY);
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as PhotosCachePayload;
    if (!payload?.savedAt || !Array.isArray(payload?.photos)) return null;

    const isFresh = Date.now() - payload.savedAt < PHOTOS_TTL_MS;
    return isFresh ? payload.photos : null;
  } catch {
    return null;
  }
}

export function saveCachedPhotos(photos: PhotoItem[]) {
  if (!isBrowser()) return;
  const payload: PhotosCachePayload = { savedAt: Date.now(), photos };
  localStorage.setItem(PHOTOS_CACHE_KEY, JSON.stringify(payload));
}

export function clearCachedPhotos() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ciweb.photos.cache.v1");
}

export function clearRatings() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ciweb.photos.ratings.v1");
}

export function loadRatings(): RatingsMap {
  if (!isBrowser()) return {};
  const raw = localStorage.getItem(RATINGS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RatingsMap;
  } catch {
    return {};
  }
}

export function saveRatings(map: RatingsMap) {
  if (!isBrowser()) return;
  localStorage.setItem(RATINGS_KEY, JSON.stringify(map));
}

export function cycleRating(current: Rating): Rating {
  return current === "liked" ? "disliked" : "liked";
}
