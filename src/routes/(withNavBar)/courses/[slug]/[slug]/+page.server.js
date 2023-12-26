import {
  getCourseDataByFullDesignation,
  getDepartmentByDesignator,
} from "$lib/data/parse.js";
import { error } from "@sveltejs/kit";

import axios from "axios";

export async function load({ params, url }) {
  let designator = url.pathname.split("/")[2];
  let course = params.slug;

  return {
    designator: designator,
    course: course,
    department: getDepartmentByDesignator(designator),
    creditHrsGPA: getCourseCreditHoursGPA(designator, course),
    fullData: await getCourseData(designator, course),
  };
}

async function getCourseData(designator, course) {
  let data = getCourseDataByFullDesignation(designator + " " + course);
  if (!data) {
    error(404, {
      message: "Course not found",
    });
  }

  return data;
}

async function getCourseCreditHoursGPA(designator, course) {
  const res = await axios({
    method: "get",
    url: `https://c4citk6s9k.execute-api.us-east-1.amazonaws.com/prod/data/course?courseID=${designator}%20${course}`,
    timeout: 10000,
  });

  const data = res.data;
  let creditHrs = 0;
  let GPA = 0;
  try {
    creditHrs =
      data.header[0].credits !== null ? data.header[0].credits : "N/A";
    GPA = data.finalAvgs[0].GPA !== null ? data.finalAvgs[0].GPA : "N/A";
  } catch (e) {
    creditHrs = "N/A";
    GPA = "N/A";
  }

  return [creditHrs, GPA];
}
