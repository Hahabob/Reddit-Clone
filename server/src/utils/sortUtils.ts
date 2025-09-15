import { EnrichedPost } from "../models/Post";
import { EnrichedComment } from "../models/Comment";

export function sortHot(
  items: EnrichedPost[] | EnrichedComment[]
): (EnrichedPost | EnrichedComment)[] {
  return items.sort((a, b) => hotScore(b) - hotScore(a));
}

function hotScore(item: EnrichedPost | EnrichedComment) {
  const score = item.upvotes - item.downvotes;
  const order = Math.log10(Math.max(Math.abs(score), 1));
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0;
  const seconds = new Date(item.createdAt).getTime() / 1000 - 1134028003; // Reddit’s epoch
  return sign * order + seconds / 45000;
}

export function sortNew(
  items: EnrichedPost[] | EnrichedComment[]
): (EnrichedPost | EnrichedComment)[] {
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function sortTop(
  items: EnrichedPost[] | EnrichedComment[],
  t: string = "all"
): (EnrichedPost | EnrichedComment)[] {
  const now = Date.now();

  const filtered = items.filter((p) => {
    const created = new Date(p.createdAt).getTime();
    switch (t) {
      case "day":
        return now - created <= 86400000;
      case "week":
        return now - created <= 604800000;
      case "month":
        return now - created <= 2592000000;
      case "year":
        return now - created <= 31536000000;
      default:
        return true; // "all"
    }
  });

  return filtered.sort(
    (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
  );
}

export function sortRising(
  items: EnrichedPost[] | EnrichedComment[]
): (EnrichedPost | EnrichedComment)[] {
  return items.sort((a, b) => risingScore(b) - risingScore(a));
}

function risingScore(item: EnrichedPost | EnrichedComment) {
  const score = item.upvotes - item.downvotes;
  const ageHours = (Date.now() - new Date(item.createdAt).getTime()) / 3600000;
  return score / Math.pow(ageHours + 2, 1.5); // fresh posts with fast growth rise
}

export function sortControversial(items: EnrichedPost[] | EnrichedComment[]) {
  return items.sort((a, b) => controversialScore(b) - controversialScore(a));
}

function controversialScore(item: EnrichedPost | EnrichedComment) {
  const ups = item.upvotes;
  const downs = item.downvotes;
  if (ups <= 0 || downs <= 0) return 0;
  return ups + downs === 0 ? 0 : (ups * downs) / Math.pow(ups + downs, 1.2);
}
