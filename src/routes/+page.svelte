<script>
    import CourseSearch from "$lib/components/CourseSearch.svelte";
    export let data;
</script>


<div class="h-screen flex flex-col items-center justify-center -mt-16">
    <h1 class="text-5xl font-lemondays text-gtsecondary"><span class="text-gt">Georgia Tech</span> Course Visualizer</h1>
    <hr class="w-96 h-1 mx-auto my-4 border-0 rounded md:my-10 dark:bg-gtdark">
    <br />
    <p class="flex flex-col items-center mb-2">
        <span class="text-sm font-medium text-gtsecondary font-lemondays font-bold"
        >Choose a Course:</span
        >
    </p>
    <CourseSearch courses={data.courses}/>

</div>

