import { json } from "@sveltejs/kit";
import courseData from "./src/lib/202402.json";

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

// GET /api/courses/all/
// returns all courses paired with their course names
export async function GET({ request }) {
  let data = getKeysPairedWithNthElement(courseData.courses, 0);
  return json({ courses: data });
}
