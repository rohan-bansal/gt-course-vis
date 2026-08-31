import { json } from "@sveltejs/kit";
import { getCourseNumbersAndNames } from "$lib/data/parse.js";
import { readSemesterCookie } from "$lib/data/semesters.js";

export async function GET({ cookies }) {
  const semester = readSemesterCookie(cookies);
  const courses = await getCourseNumbersAndNames(semester);
  return json({ semester, courses });
}
