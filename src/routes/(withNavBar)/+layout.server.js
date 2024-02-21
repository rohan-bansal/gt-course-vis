import { getCourseNumbersAndNames } from "$lib/data/parse.js";

export async function load() {
  let data = getCourseNumbersAndNames();

  return {
    courses: await data,
    semesters: await getSemesters(),
  };
}

async function getSemesters() {
  // list of semesters in json format: https://rbansal.dev/gt-course-vis/

  const response = await fetch("https://rohan-bansal.github.io/gt-course-vis");
  const data = await response.json();

  const semesters = data.terms;

  let termDict = {};

  for (let semester of semesters) {
    let year = semester.slice(0, 4);
    let season = semester.slice(4, 6);

    let seasonStr = "";
    if (season === "02") {
      seasonStr = "Spring";
    } else if (season === "05") {
      seasonStr = "Summer";
    } else if (season === "08") {
      seasonStr = "Fall";
    }

    termDict[semester] = `${seasonStr} ${year}`;
  }

  return termDict;
}
