<script>
    import CourseSearch from "$lib/components/CourseSearch.svelte";
    import SubjectSearch from "$lib/components/SubjectSearch.svelte";
    import SemesterSelect from "$lib/components/SemesterSelect.svelte";
    export let data;
</script>

<div class="rounded-lg m-4">
    <div class="w-full p-4 md:flex md:items-center md:justify-between sm:justify-center">
        <div class="grid w-full place-content-center md:mb-0 md:w-auto mb-2">
            <div class="flex flex-col items-center md:flex-row md:items-center">
                <a href="/"><h1 class="text-4xl font-lemondays text-gtsecondary mx-6 text-center"><span class="text-gt">GT</span> Co.Vis.</h1></a>
                <SemesterSelect semesters={data.semesters} current={data.semester} />
            </div>
        </div>
        <div class="mx-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <CourseSearch />
            <p class="font-lemondays text-gt text-center my-auto">OR</p>
            <SubjectSearch />
        </div>
    </div>
</div>

<slot />
