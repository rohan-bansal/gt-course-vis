import {
  decodeHtmlEntities,
  getCourseDataByFullDesignation,
  getCreditsFromCourseEntry,
  getDepartmentByDesignator,
  getPostreqs,
  getPrereqs,
  getSpecialTopicsSections,
  isSpecialTopicsCourse,
} from "$lib/data/parse.js";
import { error } from "@sveltejs/kit";
import axios from "axios";

export async function load({ params, parent }) {
  const { semester } = await parent();
  const designator = params.designator;
  const course = params.number;

  const fullData = await getCourseData(semester, designator, course);
  const displayData = [...fullData];
  if (typeof displayData[0] === "string") {
    displayData[0] = decodeHtmlEntities(displayData[0]);
  }
  if (typeof displayData[3] === "string") {
    displayData[3] = decodeHtmlEntities(displayData[3]);
  }

  const specialTopics = isSpecialTopicsCourse(course);

  return {
    designator,
    course,
    semester,
    department: getDepartmentByDesignator(designator),
    credits: getCreditsFromCourseEntry(fullData),
    gpa: getCourseGPA(designator, course),
    reqs: specialTopics ? null : getRequisites(semester, designator, course),
    fullData: displayData,
    topics: specialTopics ? getSpecialTopicsSections(fullData) : [],
  };
}

async function getRequisites(semester, designator, course) {
  const fullName = `${designator} ${course}`;
  const [prereqs, postreqs] = await Promise.all([
    getPrereqs(semester, fullName),
    getPostreqs(semester, fullName),
  ]);
  return [prereqs, postreqs];
}

async function getCourseData(semester, designator, course) {
  if (course.toLowerCase().includes("x")) {
    error(404, {
      message: "Elective/Transfer Course (No Data Available)",
    });
  }

  let data = await getCourseDataByFullDesignation(
    semester,
    `${designator} ${course}`,
  );

  if (!data) {
    error(404, {
      message: "Course Not Found (Not Offered This Semester)",
    });
  }

  return data;
}

async function getCourseGPA(designator, course) {
  const res = await axios({
    method: "get",
    url: `https://c4citk6s9k.execute-api.us-east-1.amazonaws.com/prod/data/course?courseID=${designator}%20${course}`,
    timeout: 10000,
  }).catch(() => null);

  if (!res) {
    return "N/A";
  }

  const data = res.data;

  try {
    if (data.raw && data.raw.length > 0) {
      const sortedRaw = [...data.raw].sort((a, b) => {
        const termA = a.Term?.split(" ") || [];
        const termB = b.Term?.split(" ") || [];

        const yearA = parseInt(termA[1]) || 0;
        const yearB = parseInt(termB[1]) || 0;

        if (yearA !== yearB) return yearB - yearA;

        const semesterOrder = { Fall: 3, Summer: 2, Spring: 1 };
        return (
          (semesterOrder[termB[0]] || 0) - (semesterOrder[termA[0]] || 0)
        );
      });

      return sortedRaw[0].GPA !== null && sortedRaw[0].GPA !== undefined
        ? sortedRaw[0].GPA.toFixed(2)
        : "N/A";
    }

    return data.finalAvgs[0].GPA !== null
      ? data.finalAvgs[0].GPA.toFixed(2)
      : "N/A";
  } catch {
    return "N/A";
  }
}
