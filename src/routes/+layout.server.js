import { getCatalogStats } from "$lib/data/parse.js";
import {
  SEMESTER_COOKIE,
  getSemesterOptions,
  resolveSemesterId,
  writeSemesterCookie,
} from "$lib/data/semesters.js";

export async function load({ cookies, url }) {
  const requested = cookies.get(SEMESTER_COOKIE);
  const semester = resolveSemesterId(requested);

  if (semester && requested !== semester) {
    writeSemesterCookie(cookies, semester, url);
  }

  const stats = semester
    ? await getCatalogStats(semester)
    : { courseCount: 0, subjectCount: 0 };

  return {
    semester,
    semesters: getSemesterOptions(),
    courseCount: stats.courseCount,
    subjectCount: stats.subjectCount,
  };
}
