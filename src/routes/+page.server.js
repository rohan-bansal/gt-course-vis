import {
  previousComparableSemester,
  semesterLabel,
} from "$lib/data/semesters.js";

export async function load({ parent }) {
  const { semester } = await parent();
  const vs = previousComparableSemester(semester);

  return {
    vs,
    vsLabel: vs ? semesterLabel(vs) : "",
  };
}
