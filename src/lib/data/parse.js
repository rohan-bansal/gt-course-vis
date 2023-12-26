import courseData from "$lib/data/202402.json";
import departments from "$lib/data/departments.json";

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

export const getCourseNumbersAndNames = async () => {
  // pair course numbers with course names
  let data = getKeysPairedWithNthElement(courseData.courses, 0);

  const reformattedArray = Object.keys(data).map((courseNumber) => ({
    courseNumber,
    courseName: data[courseNumber],
  }));

  return reformattedArray;
};

export const getCourseDataByFullDesignation = (fullDesignation) => {
  return courseData.courses[fullDesignation];
};

export const getDepartmentByDesignator = (designator) => {
  return departments[designator];
};
