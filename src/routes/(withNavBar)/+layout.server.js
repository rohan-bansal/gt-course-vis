import { getCourseNumbersAndNames } from "$lib/data/parse.js";

export async function load() {
  return {
    courses: await getCourseNumbersAndNames(),
    semesters: {
      "202608": "Fall 2026",
    },
  };
}
