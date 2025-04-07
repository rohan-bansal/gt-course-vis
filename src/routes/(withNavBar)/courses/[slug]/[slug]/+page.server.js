import {
  getCourseDataByFullDesignation,
  getDepartmentByDesignator,
  getPrereqs,
  getPostreqs,
} from "$lib/data/parse.js";
import { error } from "@sveltejs/kit";

import axios from "axios";
import { JSDOM } from "jsdom";
import semesterStore from "$lib/stores/semesterStore.js";

export async function load({ params, url }) {
  let designator = url.pathname.split("/")[2];
  let course = params.slug;

  return {
    designator: designator,
    course: course,
    department: getDepartmentByDesignator(designator),
    creditHrsGPA: getCourseCreditHoursGPA(designator, course),
    reqs: await getRequisites(designator, course),
    fullData: await getCourseData(designator, course),
  };
}

async function getRequisites(designator, course) {
  const prereqs = getPrereqs(designator + " " + course);
  const postreqs = getPostreqs(designator + " " + course);
  return [prereqs, postreqs];
}

async function getCourseData(designator, course) {
  let data = getCourseDataByFullDesignation(designator + " " + course);

  if (course.toLowerCase().includes("x")) {
    error(404, {
      message: "Elective/Transfer Course (No Data Available)",
    });
  }

  if (!data) {
    error(404, {
      message: "Course Not Found (Not Offered This Semester)",
    });
  }

  return data;
}

async function getCourseCreditHoursGPA(designator, course) {
  let creditHrs = 0;
  let GPA = 0;

  console.log(designator, course);

  const res = await axios({
    method: "get",
    url: `https://c4citk6s9k.execute-api.us-east-1.amazonaws.com/prod/data/course?courseID=${designator}%20${course}`,
    timeout: 10000,
  }).catch((e) => {
    return null;
  });

  if (!res) {
    console.log("error");
    creditHrs = "N/A";
    GPA = "N/A";
  } else {
    const data = res.data;

    try {
      console.log(data.header[0], data.finalAvgs);
      creditHrs =
        data.header[0].credits !== null ? data.header[0].credits : "N/A";
      console.log(creditHrs);

      // Find the raw data entry with the latest term
      if (data.raw && data.raw.length > 0) {
        // Sort the raw data by Term in descending order (latest first)
        const sortedRaw = [...data.raw].sort((a, b) => {
          const termA = a.Term?.split(" ") || [];
          const termB = b.Term?.split(" ") || [];

          const yearA = parseInt(termA[1]) || 0;
          const yearB = parseInt(termB[1]) || 0;

          // First compare years
          if (yearA !== yearB) return yearB - yearA;

          // If years are equal, compare semesters
          const semesterOrder = { Fall: 3, Summer: 2, Spring: 1 };
          return (
            (semesterOrder[termB[0]] || 0) - (semesterOrder[termA[0]] || 0)
          );
        });

        // Use GPA from the latest term if available
        GPA =
          sortedRaw[0].GPA !== null && sortedRaw[0].GPA !== undefined
            ? sortedRaw[0].GPA.toFixed(2)
            : "N/A";
      } else {
        // Fallback to the original behavior if raw data isn't available
        GPA =
          data.finalAvgs[0].GPA !== null
            ? data.finalAvgs[0].GPA.toFixed(2)
            : "N/A";
      }
    } catch (e) {
      console.log("error", e);
      creditHrs = "N/A";
      GPA = "N/A";
    }
  }

  // if credit hours is N/A, try to get it from oscar instead. could be a new course that doesn't have course critique data yet
  if (creditHrs === "N/A") {
    try {
      const res = await axios({
        method: "get",
        url: `https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in=${$semesterStore}&subj_code_in=${designator}&crse_numb_in=${course}`,
        timeout: 10000,
      }).catch((e) => {
        return null;
      });

      if (!res) {
        return [creditHrs, GPA];
      }

      const dom = new JSDOM(res.data);
      const creditHrsElement =
        dom.window.document.querySelector("td.ntdefault").textContent;

      const index = creditHrsElement.toLowerCase().indexOf("credit hours");

      // If the phrase is found, get the element immediately preceding it
      if (index !== -1) {
        // Split the string into an array of words
        const words = creditHrsElement
          .substring(0, index)
          .split(" ")
          .filter((word) => word !== "");

        // Return the last element in the array (immediately preceding "credit hours")
        creditHrs = words[words.length - 1].split(".")[0];
      }
    } catch (e) {
      creditHrs = "N/A";
    }
  }

  return [creditHrs, GPA];
}
