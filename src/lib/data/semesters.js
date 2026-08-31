// Drop new catalogs in this folder as YYYYMM.json (02 Spring, 05 Summer, 08 Fall).
const semesterLoaders = import.meta.glob("./semesters/*.json");

const SEASON_LABELS = {
  "02": "Spring",
  "05": "Summer",
  "08": "Fall",
};

const loadedSemesters = new Map();

export const SEMESTER_COOKIE = "semester";
export const SEMESTER_COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
  httpOnly: true,
};

function idFromPath(path) {
  return path.match(/(\d{6})\.json$/)?.[1] ?? null;
}

export function listSemesterIds() {
  return Object.keys(semesterLoaders)
    .map(idFromPath)
    .filter(Boolean)
    .sort()
    .reverse();
}

export function semesterLabel(id) {
  if (!id || id.length < 6) return "";
  const year = id.slice(0, 4);
  const season = SEASON_LABELS[id.slice(4, 6)] ?? "";
  return [season, year].filter(Boolean).join(" ");
}

export function getSemesterOptions() {
  return listSemesterIds().map((id) => ({
    id,
    label: semesterLabel(id),
  }));
}

export function resolveSemesterId(requested) {
  const ids = listSemesterIds();
  if (requested && ids.includes(requested)) {
    return requested;
  }
  return ids[0] ?? null;
}

/** Same season in a prior year, else the immediately older term. */
export function previousComparableSemester(currentId) {
  const ids = listSemesterIds()
    .slice()
    .sort();
  if (!currentId || ids.length < 2) return null;

  const season = currentId.slice(4, 6);
  const sameSeason = ids.filter(
    (id) => id !== currentId && id.slice(4, 6) === season && id < currentId,
  );
  if (sameSeason.length > 0) {
    return sameSeason[sameSeason.length - 1];
  }

  const older = ids.filter((id) => id < currentId);
  return older.length > 0 ? older[older.length - 1] : null;
}

export function readSemesterCookie(cookies) {
  return resolveSemesterId(cookies.get(SEMESTER_COOKIE));
}

export function writeSemesterCookie(cookies, id, url) {
  const resolved = resolveSemesterId(id);
  if (resolved) {
    cookies.set(SEMESTER_COOKIE, resolved, {
      ...SEMESTER_COOKIE_OPTS,
      secure: url?.protocol === "https:",
    });
  }
  return resolved;
}

export async function loadSemesterData(semesterId) {
  const id = resolveSemesterId(semesterId);
  const loader = id ? semesterLoaders[`./semesters/${id}.json`] : null;

  if (!loader) {
    throw new Error(
      `No semester catalog found${id ? ` for ${id}` : ""}. Add a YYYYMM.json file to src/lib/data/semesters/.`,
    );
  }

  if (!loadedSemesters.has(id)) {
    loadedSemesters.set(
      id,
      loader().then((mod) => mod.default ?? mod),
    );
  }

  return loadedSemesters.get(id);
}
