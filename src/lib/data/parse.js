import departments from "$lib/data/departments.json";
import { loadSemesterData, resolveSemesterId } from "$lib/data/semesters.js";

const postreqIndexBySemester = new Map();

function getKeysPairedWithNthElement(jsonObj, n) {
  return Object.keys(jsonObj).reduce((result, key) => {
    if (
      jsonObj.hasOwnProperty(key) &&
      Array.isArray(jsonObj[key]) &&
      jsonObj[key].length > n
    ) {
      result[key] = jsonObj[key][n];
    }
    return result;
  }, {});
}

export function decodeHtmlEntities(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export const getCourseNumbersAndNames = async (semesterId) => {
  const courseData = await loadSemesterData(semesterId);
  let data = getKeysPairedWithNthElement(courseData.courses, 0);

  return Object.keys(data).map((courseNumber) => ({
    courseNumber,
    courseName: decodeHtmlEntities(data[courseNumber]),
  }));
};

export const getCatalogStats = async (semesterId) => {
  const courseData = await loadSemesterData(semesterId);
  const keys = Object.keys(courseData.courses);
  const subjects = new Set();
  for (const key of keys) {
    subjects.add(key.split(" ")[0]);
  }
  return {
    courseCount: keys.length,
    subjectCount: subjects.size,
  };
};

export const getCourseDataByFullDesignation = async (
  semesterId,
  fullDesignation,
) => {
  const courseData = await loadSemesterData(semesterId);
  return courseData.courses[fullDesignation];
};

export const getDepartmentByDesignator = (designator) => {
  return departments[designator];
};

export const getAllCoursesByDesignator = async (semesterId, designator) => {
  const courseData = await loadSemesterData(semesterId);
  return Object.keys(courseData.courses)
    .filter((course) => course.startsWith(`${designator} `))
    .map((courseNumber) => ({
      courseNumber,
      courseName: decodeHtmlEntities(courseData.courses[courseNumber]?.[0]),
    }));
};

export const getPrereqs = async (semesterId, fullDesignation) => {
  let data = await getCourseDataByFullDesignation(semesterId, fullDesignation);
  if (!data) {
    return [];
  }

  return data[2] ?? [];
};

function collectPrereqIds(node, ids = new Set()) {
  if (typeof node === "string") {
    if (node.includes(" ")) ids.add(node);
    return ids;
  }

  if (Array.isArray(node)) {
    for (const child of node) collectPrereqIds(child, ids);
    return ids;
  }

  if (node && typeof node === "object") {
    if (typeof node.id === "string") ids.add(node.id);
    for (const value of Object.values(node)) collectPrereqIds(value, ids);
  }

  return ids;
}

function buildPostreqIndex(courses) {
  const index = new Map();

  for (const [course, entry] of Object.entries(courses)) {
    const prereqs = entry?.[2];
    if (!prereqs) continue;

    for (const id of collectPrereqIds(prereqs)) {
      if (!index.has(id)) index.set(id, []);
      index.get(id).push(course);
    }
  }

  return index;
}

async function getPostreqIndex(semesterId) {
  const id = resolveSemesterId(semesterId);
  if (!postreqIndexBySemester.has(id)) {
    const courseData = await loadSemesterData(id);
    postreqIndexBySemester.set(id, buildPostreqIndex(courseData.courses));
  }
  return postreqIndexBySemester.get(id);
}

export const getPostreqs = async (semesterId, fullDesignation) => {
  const index = await getPostreqIndex(semesterId);
  return index.get(fullDesignation) ?? [];
};

const SPECIAL_TOPICS_NUMBERS = new Set(["4803", "8803"]);

export function isSpecialTopicsCourse(number) {
  return SPECIAL_TOPICS_NUMBERS.has(String(number));
}

function instructorDisplayName(raw) {
  return decodeHtmlEntities(String(raw || ""))
    .replace(/\s*\(P\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSpecialTopicsSections(courseEntry) {
  const sectionsObj = courseEntry?.[1];
  if (!sectionsObj || typeof sectionsObj !== "object") return [];

  const topics = [];
  for (const [code, section] of Object.entries(sectionsObj)) {
    if (!Array.isArray(section)) continue;

    const primary = [];
    const rest = [];
    const seen = new Set();
    const meetings = Array.isArray(section[1]) ? section[1] : [];

    for (const meeting of meetings) {
      const names = meeting?.[4];
      if (!Array.isArray(names)) continue;
      for (const raw of names) {
        const name = instructorDisplayName(raw);
        if (!name || seen.has(name)) continue;
        seen.add(name);
        if (/\(P\)\s*$/.test(String(raw || ""))) primary.push(name);
        else rest.push(name);
      }
    }

    topics.push({
      section: code,
      crn: section[0] != null ? String(section[0]) : "",
      title: decodeHtmlEntities(section[7] || "") || "Untitled",
      instructor: [...primary, ...rest].join(", ") || "TBA",
    });
  }

  topics.sort((a, b) =>
    a.section.localeCompare(b.section, undefined, { numeric: true }),
  );
  return topics;
}

// Section arrays store credit hours at index 2. Recitations are often 0.
export function getCreditsFromCourseEntry(courseEntry) {
  if (!courseEntry || typeof courseEntry[1] !== "object" || !courseEntry[1]) {
    return "N/A";
  }

  const hours = new Set();
  for (const section of Object.values(courseEntry[1])) {
    if (Array.isArray(section) && typeof section[2] === "number") {
      hours.add(section[2]);
    }
  }

  if (hours.size === 0) {
    return "N/A";
  }

  const positive = [...hours].filter((n) => n > 0).sort((a, b) => a - b);
  if (positive.length === 0) {
    return "0";
  }
  if (positive.length === 1) {
    return String(positive[0]);
  }

  return `${positive[0]}-${positive[positive.length - 1]}`;
}

export async function getCatalogDiff(currentId, previousId) {
  if (!currentId || !previousId || currentId === previousId) {
    return { added: [], removed: [] };
  }

  const [currentData, previousData] = await Promise.all([
    loadSemesterData(currentId),
    loadSemesterData(previousId),
  ]);

  const currentKeys = new Set(Object.keys(currentData.courses));
  const previousKeys = new Set(Object.keys(previousData.courses));

  const added = [];
  for (const courseNumber of currentKeys) {
    if (!previousKeys.has(courseNumber)) {
      added.push({
        courseNumber,
        courseName: decodeHtmlEntities(currentData.courses[courseNumber]?.[0]),
      });
    }
  }

  const removed = [];
  for (const courseNumber of previousKeys) {
    if (!currentKeys.has(courseNumber)) {
      removed.push({
        courseNumber,
        courseName: decodeHtmlEntities(previousData.courses[courseNumber]?.[0]),
      });
    }
  }

  added.sort((a, b) => a.courseNumber.localeCompare(b.courseNumber));
  removed.sort((a, b) => a.courseNumber.localeCompare(b.courseNumber));

  return { added, removed };
}

export const getCourseCredits = async (semesterId, fullDesignation) => {
  const entry = await getCourseDataByFullDesignation(
    semesterId,
    fullDesignation,
  );
  return getCreditsFromCourseEntry(entry);
};
