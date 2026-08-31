import { getAllCoursesByDesignator } from "$lib/data/parse.js";
import departments from "$lib/data/departments.json";
import { error } from "@sveltejs/kit";

export async function load({ params, parent }) {
  const { semester } = await parent();
  const designator = params.designator;

  if (!departments[designator]) {
    error(404, "Department not found");
  }

  const deptCourses = await getAllCoursesByDesignator(semester, designator);

  return {
    designator,
    fullDeptName: departments[designator],
    deptCourses,
  };
}
