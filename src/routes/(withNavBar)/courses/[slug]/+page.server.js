import { getAllCoursesByDesignator } from "$lib/data/parse.js";
import departments from "$lib/data/departments.json";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const designator = params.slug;

  if (!departments[designator]) {
    error(404, "Department not found");
  }

  const courses = getAllCoursesByDesignator(designator);

  return {
    designator: designator,
    fullDeptName: departments[designator],
    courses: courses,
  };
}
