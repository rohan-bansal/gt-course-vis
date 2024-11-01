<script>
    import CourseSearch from "$lib/components/CourseSearch.svelte";
    export let data;

    import semesterStore from '$lib/stores/semesterStore.js';

    import { createDropdownMenu, melt } from '@melt-ui/svelte'
    const {
        elements: { menu, item, trigger, arrow },
        states: { open }
    } = createDropdownMenu()
    
    import { ChevronDown } from "lucide-svelte";

    const setSemester = (semesterNumber) => {
        semesterStore.set(semesterNumber);
    }

    $: currentSemester = $semesterStore;
    
</script>

<div class="rounded-lg m-4">
    <div class="w-full p-4 md:flex md:items-center md:justify-between sm:justify-center">
        <div class="grid place-content-center md:mb-0 mb-2">
            <div class="flex flex-col md:flex-row">
                <a href="/"><h1 class="text-4xl font-lemondays text-gtsecondary mx-6"><span class="text-gt">GT</span> Co.Vis.</h1></a>
                <button class="my-auto mx auto text-md text-gtdark font-bold">Spring 2025</button>
                    <!-- {#await data.semesters}
                        ...
                    {:then semesters} 
                        <button use:melt={$trigger} class="my-auto mx-auto text-md text-gtdark font-bold">{semesters[currentSemester]}<ChevronDown class="inline-block" /></button>
                        <div use:melt={$menu} class="text-center menu">
                            {#each Object.keys(semesters) as semesterNumber}
                                <div use:melt={$item}>
                                    <button on:click={setSemester(semesterNumber)} class="my-auto mx auto text-md text-gtdark font-bold">{semesters[semesterNumber]}</button>
                                </div>
                            {/each}
                            <div use:melt={$arrow} />
                        </div>
                    {/await} -->
            </div>
        </div>
        <div class="mx-6">
            <CourseSearch courses={data.courses}/>
        </div>
    </div>
</div>

<style lang="postcss">
    .menu {
        @apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
        @apply rounded-md bg-white p-4 shadow-neutral-900/30 lg:max-h-none bg-gtsecondary border-2 border-gt border-gtdark ;
        @apply ring-0 !important;
    }
</style>

<slot />