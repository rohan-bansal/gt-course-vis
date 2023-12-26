import { getCourseNumbersAndNames } from "$lib/data/parse.js";

export async function load() {
  let data = getCourseNumbersAndNames();

  return {
    courses: await data,
  };
}
