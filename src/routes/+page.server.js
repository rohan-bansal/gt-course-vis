import courseData from "$lib/data/202402.json";

// pairs key with the n'th element of the array corresponding to the key
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


export async function load() {
    // pair course numbers with course names
    let data = getKeysPairedWithNthElement(courseData.courses, 0);

    const reformattedArray = Object.keys(data).map((courseNumber) => ({
        courseNumber,
        courseName: data[courseNumber],
    }));

    return {
        courses: reformattedArray,
    };
}
