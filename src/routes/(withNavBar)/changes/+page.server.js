import { getCatalogDiff } from "$lib/data/parse.js";
import {
  previousComparableSemester,
  semesterLabel,
} from "$lib/data/semesters.js";

export async function load({ parent, url }) {
  const { semester, semesters } = await parent();
  const fallback = previousComparableSemester(semester);
  const requested = url.searchParams.get("vs");
  const validIds = new Set(semesters.map((s) => s.id));
  const vs =
    requested && requested !== semester && validIds.has(requested)
      ? requested
      : fallback;

  const diff = vs
    ? await getCatalogDiff(semester, vs)
    : { added: [], removed: [] };

  return {
    vs,
    vsLabel: vs ? semesterLabel(vs) : "",
    added: diff.added,
    removed: diff.removed,
  };
}
