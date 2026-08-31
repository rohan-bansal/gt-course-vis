<script>
    export let data;

    $: courseList = data.deptCourses;
    $: designator = data.designator;
    $: fullDeptName = data.fullDeptName;

    const extractCourseNumber = (courseNumber) => {
        return courseNumber.split(" ")[1]
    }
</script>

<svelte:head>
    <title>{designator} | GT Course Visualizer</title> 
</svelte:head>

<div class="flex flex-1 flex-col items-center justify-start mt-12">
    <div class="flex flex-row items-center mb-12">
        <h1 class="text-4xl font-lemondays text-center text-gt mb-2 ml-2 underline underline-offset-8 decoration-gtsecondary">
            <span class="text-3xl text-gtsecondary">{fullDeptName}</span> <span class="text-gtsecondary">(</span>{designator}<span class="text-gtsecondary">)</span>
        </h1>
    </div>
    <div class="flex-1 w-3/4 p-2 py-4 grid mb-0 md:mb-6 md:grid-cols-8 grid-cols-2 gap-4 grid-flow-row border-solid border-gtsecondary border-2 rounded-md text-center">
    {#each courseList as course}
        <div>
            <a
                href="/courses/{designator}/{extractCourseNumber(course.courseNumber)}"
                aria-label={course.courseName}
                class="group relative inline-block"
            >
                <span class="text-xl font-lemondays text-gtsecondary mb-4 underline decoration-dashed decoration-2 underline-offset-8 inline-block">
                    <span class="text-gt">{designator}</span> {extractCourseNumber(course.courseNumber)}
                </span>
                {#if course.courseName}
                    <span class="pointer-events-none absolute left-1/2 bottom-full z-20 mb-1 -translate-x-1/2 max-w-[14rem] rounded-lg bg-gt px-2 py-1 font-mono text-xs text-gtsecondary opacity-0 shadow group-hover:opacity-100">
                        {course.courseName}
                    </span>
                {/if}
            </a>
        </div>
    {/each}
    </div>

</div>
