import { getCourseDataByFullDesignation } from "$lib/data/parse.js";
import { error } from "@sveltejs/kit";

export async function load({ params, url }) {
  let designator = url.pathname.split("/")[2];
  let course = params.slug;

  let data = getCourseDataByFullDesignation(designator + " " + course);
  if (!data) {
    error(404, {
      message: "Course not found",
    });
  }

  return {
    designator: designator,
    course: course,
    fullData: data,
  };
}
