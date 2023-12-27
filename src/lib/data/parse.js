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

export const getAllCoursesByDesignator = (designator) => {
  let courseNames = Object.keys(courseData.courses);
  let courses = courseNames.filter((course) => { return course.startsWith(designator); });
  
  return courses;
}

export const getPrereqs = (fullDesignation) => {
  let data = getCourseDataByFullDesignation(fullDesignation);
  if (!data) {
    return null;
  }
  let prereqs = data[2];
  return prereqs;
};

function searchJsonValue(jsonTree, targetValue) {
  // Base case: if the current node is the target value, return true
  if (jsonTree === targetValue) {
    return true;
  }

  // If the current node is an object, search its properties
  if (typeof jsonTree === "object" && jsonTree !== null) {
    for (const key in jsonTree) {
      // Recursively search the property value
      if (searchJsonValue(jsonTree[key], targetValue)) {
        return true;
      }
    }
  }

  // If the current node is an array, search its elements
  if (Array.isArray(jsonTree)) {
    for (let i = 0; i < jsonTree.length; i++) {
      // Recursively search the array element
      if (searchJsonValue(jsonTree[i], targetValue)) {
        return true;
      }
    }
  }

  // If the target value is not found in the current node or its children, return false
  return false;
}

export const getPostreqs = (fullDesignation) => {
  const postReqList = [];

  for (const [course, [, , prereqs]] of Object.entries(courseData.courses)) {
    if (prereqs.length > 0 && searchJsonValue(prereqs, fullDesignation)) {
      postReqList.push(course);
    }
  }
  return postReqList;
};
