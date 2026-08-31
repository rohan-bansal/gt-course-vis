import { writable, get } from "svelte/store";

export const searchCourses = writable(null);

let inflight = null;

export function clearSearchCatalog() {
  inflight = null;
  searchCourses.set(null);
}

export function ensureSearchCourses() {
  const cached = get(searchCourses);
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
 
  inflight = fetch("/api/courses")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load courses");
      return response.json();
    })
    .then((data) => {
      const courses = data.courses ?? [];
      searchCourses.set(courses);
      return courses;
    })
    .catch(() => {
      searchCourses.set([]);
      return [];
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
