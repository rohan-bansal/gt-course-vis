<script>
    import CourseSearch from "$lib/components/CourseSearch.svelte";
    export let data;
</script>

<div class="rounded-lg m-4">
    <div class="w-full p-4 md:flex md:items-center md:justify-between">
        <a href="/"><h1 class="text-4xl font-lemondays text-gtsecondary mx-6"><span class="text-gt">GT</span> Co.Vis.</h1></a>
        <div class="mx-6">
            <CourseSearch courses={data.courses}/>
        </div>
    </div>
</div>

<slot />