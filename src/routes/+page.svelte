<script>
    import CourseSearch from "$lib/components/CourseSearch.svelte";
    import SubjectSearch from "$lib/components/SubjectSearch.svelte";
    import SemesterSelect from "$lib/components/SemesterSelect.svelte";
    export let data;
</script>

<svelte:head>
    <title>GT Course Visualizer</title> 
</svelte:head>

<div class="min-h-full flex flex-col items-center justify-center px-6 py-10">
    <h1 class="text-3xl sm:text-4xl md:text-5xl text-center font-lemondays text-gtsecondary px-2">
        <span class="text-gt">Georgia Tech</span> Course Visualizer
    </h1>
    <div class="w-full max-w-2xl flex flex-col items-center">
        <div class="mt-4 w-full flex justify-center">
            <SemesterSelect
                semesters={data.semesters}
                current={data.semester}
                buttonClass="text-gtdark font-bold text-xl"
            />
        </div>
        <p class="mt-3 font-mono text-sm text-gtsecondary text-center">
            {data.courseCount} courses
            <span class="text-gtdark">·</span>
            {data.subjectCount} subjects
        </p>

        <hr class="w-full h-1 mx-auto my-8 border-0 rounded dark:bg-gtdark">

        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="flex flex-col items-center">
                <p class="mb-3">
                    <span class="text-sm font-medium text-gtsecondary font-lemondays font-bold">Choose a Course:</span>
                </p>
                <CourseSearch prefetch />
            </div>
            <p class="font-lemondays text-gt text-lg my-auto">OR</p>
            <div class="flex flex-col items-center">
                <p class="mb-3">
                    <span class="text-sm font-medium text-gtsecondary font-lemondays font-bold">Choose a Subject:</span>
                </p>
                <SubjectSearch prefetch />
            </div>
        </div>

        {#if data.vs}
            <a href="/changes" class="w-full mt-10">
                <div class="border-2 border-dashed border-gt rounded-md px-5 py-4 text-center hover:bg-gt hover:bg-opacity-10">
                    <p class="font-lemondays text-xl text-gtsecondary">Catalog Changes</p>
                    <p class="font-mono text-sm text-gtsecondary mt-2">
                        Click to see what was added or removed compared to previous semesters
                    </p>
                </div>
            </a>
        {/if}
    </div>
</div>
