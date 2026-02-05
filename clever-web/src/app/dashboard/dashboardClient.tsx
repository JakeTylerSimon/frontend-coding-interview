"use client";

import Image from "next/image";
import styles from "./dashboard.module.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { apiGet } from "@/lib/api";
import { isSignedIn, signOut } from "@/lib/auth";
import type { PhotoItem } from "@/lib/types";
import {
  cycleRating,
  loadCachedPhotos,
  loadRatings,
  saveCachedPhotos,
  saveRatings,
  type Rating,
  type RatingsMap,
} from "@/lib/photoCache";
import { useToast } from "@/components/Toast";

type PhotosResponse = { photos: PhotoItem[] };

function StarIcon({ state }: { state: Rating }) {
  const src = state === "liked" ? "/solid-star.png" : "/empty-star.png";

  return (
    <Image className={styles.starImg} src={src} alt="" width={20} height={20} />
  );
}

function SkeletonRow() {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.starWrap}>
          <div className={styles.skelStar} />
        </div>

        <div className={styles.thumbWrap}>
          <div className={styles.skelThumb} />
        </div>

        <div className={styles.meta}>
          <div className={styles.skelLineLg} />
          <div className={styles.skelLineMd} />
          <div className={styles.skelLineSm} />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.skelLink} />
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [ratings, setRatings] = useState<RatingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const toast = useToast();

  // auth guard
  useEffect(() => {
    if (!isSignedIn()) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    setRatings(loadRatings());

    const cached = loadCachedPhotos();
    if (cached?.length) {
      setPhotos(cached);
      setLoading(false);
      return;
    }

    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPhotos() {
    try {
      setLoading(true);
      setError(null);

      const data = await apiGet<PhotosResponse>("/api/photos");

      setPhotos(data.photos);
      saveCachedPhotos(data.photos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  }

  function onToggleRating(photoId: number) {
    const current: Rating = ratings[photoId] ?? "disliked";

    const next = cycleRating(current);

    const updated = { ...ratings, [photoId]: next };
    setRatings(updated);
    saveRatings(updated);

    if (next === "liked") toast.success("Liked an Image", 3000);
    if (next === "disliked") toast.danger("Disliked an Image", 3000);
  }

  const skeletonCount = useMemo(() => 10, []);

  if (checkingAuth) {
    return <main className={styles.page} />;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoWrap} aria-hidden="true">
            <Image
              src="/logo.svg"
              alt="Clever-Icon"
              width={75}
              height={75}
              priority
            />
          </div>

          <div className={styles.headerRow}>
            <h1 className={styles.title}>All photos</h1>

            <button
              className={styles.signOut}
              onClick={() => {
                toast.info("Signed out", 2500);
                signOut();
                router.push("/login");
              }}
              type="button"
            >
              Sign out
            </button>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <section className={styles.list}>
          {loading &&
            Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}

          {!loading &&
            !error &&
            photos.map((p) => {
              const state: Rating = ratings[p.id] ?? "disliked";

              return (
                <div className={styles.row} key={p.id}>
                  <div className={styles.left}>
                    <button
                      className={styles.starWrap}
                      type="button"
                      onClick={() => onToggleRating(p.id)}
                      aria-label={state === "liked" ? "Dislike" : "Like"}
                    >
                      <StarIcon state={state} />
                    </button>

                    <div className={styles.thumbWrap}>
                      <Image
                        className={styles.thumb}
                        src={p.thumbUrl}
                        alt={p.alt || "Photo"}
                        width={75}
                        height={75}
                        sizes="75px"
                        priority={false}
                      />
                    </div>

                    <div className={styles.meta}>
                      <div className={styles.photographer}>
                        {p.photographer}
                      </div>
                      <div className={styles.alt}>{p.alt}</div>
                      <div className={styles.colorRow}>
                        <span className={styles.colorText}>{p.avg_color}</span>
                        <span
                          className={styles.colorSwatch}
                          style={{ backgroundColor: p.avg_color }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.right}>
                    <a
                      className={styles.portfolio}
                      href={p.photographer_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.portfolioIcon} aria-hidden="true">
                        <Image src="/links.svg" alt="" width={12} height={12} />
                      </span>
                      <span>Portfolio</span>
                    </a>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </main>
  );
}
