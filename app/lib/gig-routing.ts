import type { Gig } from "./demo-store";

export function slugifyGigTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function gigRouteKey(gig: Pick<Gig, "id" | "title">) {
  return slugifyGigTitle(gig.title) || gig.id;
}

export function findGigByRouteKey(gigs: Gig[], routeKey: string) {
  return gigs.find((gig) => gig.id === routeKey || gigRouteKey(gig) === routeKey);
}
