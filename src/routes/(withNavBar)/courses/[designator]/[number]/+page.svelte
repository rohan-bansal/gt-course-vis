<script>
    import { createTooltip, melt } from '@melt-ui/svelte';
    import { fade } from 'svelte/transition';

    import { ExternalLink, HelpCircle, Link } from 'lucide-svelte'; 
    import PrereqTree from '$lib/components/PrereqTree.svelte';
    import SpecialTopics from '$lib/components/SpecialTopics.svelte';
    import { coursePath } from '$lib/courseUrl.js';
    export let data;

    $: courseDesignator = data.designator;
    $: courseNumber = data.course;
    $: courseDepartment = data.department;
    $: courseDescription = data.fullData[0];
    $: courseFullDescription = data.fullData[3];
    $: hasTopics = data.topics?.length > 0;

    const {
        elements: { trigger, content, arrow },
        states: { open }
    } = createTooltip({
        positioning: {
        placement: 'top',
        },
        openDelay: 0,
        closeDelay: 0,
        closeOnPointerDown: false,
        forceVisible: true,
    });
</script>

<svelte:head>
    <title>{courseDesignator + " " + courseNumber} | GT Course Visualizer</title> 
</svelte:head>

<div class="flex flex-col items-center justify-start p-4">
    <div class="flex flex-row">
        <h1 class="text-4xl md:text-5xl font-lemondays text-gtsecondary mb-2 ml-6 ">
            <span class="text-gt">{courseDesignator}</span>{courseNumber}
        </h1>
        <a target="_blank" href="https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in={data.semester}&subj_code_in={courseDesignator}&crse_numb_in={courseNumber}"><ExternalLink class="ml-1 text-gtsecondary"/></a>
    </div>

    <p class="text-md md:text-xl text-center leading-9 font-mono text-gtsecondary mb-4 underline decoration-wavy decoration-2 underline-offset-8">
        {courseDescription}
    </p>
    <p class="text-sm font-mono text-gtsecondary text-center">
        <a href="/courses/{courseDesignator}"><span><Link class="text-gt inline-block mr-1 scale-75" /></span>{courseDepartment}</a> | 
        <span class="text-gt">{data.credits}</span> 
        {data.credits === "1" ? "Credit Hr" : "Credit Hrs"} 
        |
        {#await data.gpa}
            <span class="text-gt">...</span> Avg. GPA
        {:then gpa}
            <span class="text-gt">{gpa}</span> Avg. GPA
            {#if gpa === "N/A"}
                <span>
                    <button type="button" class="trigger" use:melt={$trigger} aria-label="Average GPA unavailable">
                        <HelpCircle class="inline-block" />
                    </button>
                </span>
            {/if}
        {/await}
    </p>

    {#if $open}
    <div
        use:melt={$content}
        transition:fade={{ duration: 100 }}
        class="z-10 rounded-lg bg-gt shadow"
    >
        <div use:melt={$arrow} />
        <p class="px-4 py-1 text-gtsecondary">No historical GPA on Course Critique yet.</p>
    </div>
    {/if}
    
</div>
<div class="flex flex-1 justify-center flex-col lg:flex-row mt-4 lg:mt-6 mx-2 lg:mx-12 mb-0 lg:mb-4">
    <div class="flex-1 flex flex-col rounded-md max-w-full lg:max-w-[36%] text-center">
        <h2 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3">Info</h2>
        <div class="flex flex-col border-gt border-dashed border-2 lg:border-none rounded-md p-1.5 m-2 md:mx-32 lg:mx-0">
            <p class="text-gtsecondary font-mono text-sm p-1.5 mb-2">{courseFullDescription}</p>
            <a target="_blank" class="text-gt underline decoration-gtsecondary flex mx-auto" href="https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in={data.semester}&subj_code_in={courseDesignator}&crse_numb_in={courseNumber}">Oscar <span class="inline-block scale-75 align-center"><ExternalLink /></span></a>
            {#await data.gpa}
                <p class="text-gt underline">...</p>
            {:then gpa} 
                {#if gpa !== "N/A"}
                    <a target="_blank" class="text-gt underline decoration-gtsecondary flex mx-auto" href="https://critique.gatech.edu/course?courseID={courseDesignator}%20{courseNumber}">Course Critique <span class="inline-block scale-75 align-center"><ExternalLink /></span></a>
                {/if}
            {/await}
        </div>
    </div>
    {#if hasTopics}
        <div class="flex-auto rounded-md mt-3 mb-8 lg:mx-2 lg:mt-0">
            <SpecialTopics
                topics={data.topics}
                semester={data.semester}
                designator={courseDesignator}
                number={courseNumber}
            />
        </div>
    {:else}
        {#await data.reqs}
            <div class="flex-auto rounded-md mt-3 mb-3 lg:mx-2 lg:mt-0 lg:mb-0 items-center overflow-x-scroll text-center">
                <h2 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 lg:mb-6">Requirements</h2>
                <p class="text-gtsecondary font-mono text-sm">...</p>
            </div>
            <div class="flex-1 flex flex-col rounded-md max-w-full lg:max-w-[36%]">
                <h2 class="font-lemondays text-center text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 mt-4 lg:mt-0">Prereq For</h2>
                <p class="text-gtsecondary font-mono text-sm text-center">...</p>
            </div>
        {:then reqs}
            <div class="flex-auto rounded-md mt-3 mb-3 lg:mx-2 lg:mt-0 lg:mb-0 items-center overflow-x-scroll text-center">
                <h2 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 lg:mb-6">Requirements</h2>
                <PrereqTree treeData={reqs[0]} course={courseDesignator + " " + courseNumber}/>
            </div>
            <div class="flex-1 flex flex-col rounded-md max-w-full lg:max-w-[36%]">
                <h2 class="font-lemondays text-center text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 mt-4 lg:mt-0">Prereq For</h2>
                <div class="flex-initial text-center items-center justify-center p-1.5 m-2">
                    <div class="max-h-80 overflow-y-scroll">
                        {#if reqs[1].length === 0}
                            <span class="inline-block bg-gthorizon bg-opacity-15 border-2 border-gthorizon rounded-md p-2 font-lemondays text-gtsecondary m-2 w-28">None</span>
                        {:else}
                            {#each reqs[1] as req}
                                <a href={coursePath(req)} class="inline-block bg-gthorizon bg-opacity-15 border-2 border-gthorizon rounded-md p-2 font-lemondays text-gtsecondary m-2 w-28"><span class="text-gt">{req.split(" ")[0]}</span> {req.split(" ")[1]}</a>
                            {/each}
                        {/if}
                    </div> 
                </div>
            </div>
        {/await}
    {/if}
</div>
