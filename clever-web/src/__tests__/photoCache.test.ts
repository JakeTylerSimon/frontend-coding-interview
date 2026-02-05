import {
  loadRatings,
  saveRatings,
  cycleRating,
  type RatingsMap,
} from "@/lib/photoCache";

describe("photoCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("cycleRating toggles between liked and disliked", () => {
    expect(cycleRating("disliked")).toBe("liked");
    expect(cycleRating("liked")).toBe("disliked");
  });

  it("saveRatings + loadRatings roundtrip", () => {
    const map: RatingsMap = { 1: "liked", 2: "disliked" };
    saveRatings(map);

    const loaded = loadRatings();
    expect(loaded).toEqual(map);
  });
});
