<script>
    export let data;

    let courseList = data.courses;
    let designator = data.designator;
    let fullDeptName = data.fullDeptName;

    const extractCourseNumber = (course) => {
        return course.split(" ")[1]
    }
</script>

<div class="flex flex-1 flex-col items-center justify-start mt-12">
    <div class="flex flex-row items-center mb-12">
        <h1 class="text-4xl font-lemondays text-gt mb-2 ml-2 underline underline-offset-8 decoration-gtsecondary">
            <span class="text-3xl text-gtsecondary">{fullDeptName}</span> <span class="text-gtsecondary">(</span>{designator}<span class="text-gtsecondary">)</span>
        </h1>
    </div>
    <div class="flex-1 w-3/4 p-2 py-4 grid mb-0 md:mb-6 md:grid-cols-8 grid-cols-2 gap-4 grid-flow-row border-solid border-gtsecondary border-2 rounded-md text-center">
    {#each courseList as course}
        <div>
            <a href="/courses/{designator}/{extractCourseNumber(course)}">
                <h1 class="text-xl font-lemondays text-gtsecondary mb-4 underline decoration-dashed decoration-2 underline-offset-8">
                    <span class="text-gt">{designator}</span>{extractCourseNumber(course)}
                </h1>
            </a>
        </div>
    {/each}
    </div>

</div>
