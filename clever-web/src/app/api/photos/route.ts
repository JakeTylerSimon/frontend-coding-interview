import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PexelsPhoto = {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  avg_color: string;
  src: {
    tiny: string;
    small: string;
    medium: string;
    large: string;
  };
};

type PexelsSearchResponse = {
  photos: PexelsPhoto[];
};

export async function GET(req: Request) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing PEXELS_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const refresh = searchParams.get("refresh") === "1";

  const endpoint = "https://api.pexels.com/v1/search?query=nature&per_page=10";

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: apiKey },
    cache: refresh ? "no-store" : "force-cache",
    next: refresh ? undefined : { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "Pexels request failed", details: text },
      { status: 500 },
    );
  }

  const json = (await res.json()) as PexelsSearchResponse;

  const photos = json.photos.map((p) => ({
    id: p.id,
    thumbUrl: p.src.small,
    alt: p.alt || "Photo",
    avg_color: p.avg_color,
    photographer: p.photographer,
    photographer_url: p.photographer_url,
    url: p.url,
  }));

  return NextResponse.json({ photos });
}
