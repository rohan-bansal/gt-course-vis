<script>

    import { createTooltip, melt } from '@melt-ui/svelte';
    import { fade } from 'svelte/transition';

    import { ExternalLink, HelpCircle, Link } from 'lucide-svelte'; 
	import PrereqTree from '$lib/components/PrereqTree.svelte';
    export let data;

    let courseDesignator = data.designator;
    let courseNumber = data.course;
    let courseDepartment = data.department;
    let courseDescription = data.fullData[0];
    let courseFullDescription = data.fullData[3];

    const {
        elements: { trigger, content, arrow },
        states: { open },
    } = createTooltip({
        positioning: {
        placement: 'top',
        },
        openDelay: 0,
        closeDelay: 0,
        closeOnPointerDown: false,
        forceVisible: true,
    });

    const redirect = (courseName) => {
        let designator = courseName.split(" ")[0];
        let number = courseName.split(" ")[1];
        window.location.href = `/courses/${designator}/${number}`;
    }
</script>

<svelte:head>
    <title>{courseDesignator + " " + courseNumber} | GT Course Visualizer</title> 
</svelte:head>

<div class="flex flex-col items-center justify-start p-4">
    <div class="flex flex-row">
        <h1 class="text-4xl md:text-5xl font-lemondays text-gtsecondary mb-2 ml-6 ">
            <span class="text-gt">{courseDesignator}</span>{courseNumber}
        </h1>
        <a target="_blank" href="https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in=202402&subj_code_in={courseDesignator}&crse_numb_in={courseNumber}"><ExternalLink class="ml-1 text-gtsecondary"/></a>
    </div>

    <h1 class="text-md md:text-xl text-center leading-9 font-mono text-gtsecondary mb-4 underline decoration-wavy decoration-2 underline-offset-8">
        {@html courseDescription}
    </h1>
    {#await data.creditHrsGPA}
        <h1 class="text-sm font-mono text-gtsecondary">
            ...
        </h1>
    {:then creditHoursGPA} 
        <h1 class="text-sm font-mono text-gtsecondary text-center">
            <a href="/courses/{courseDesignator}"><span><Link class="text-gt inline-block mr-1 scale-75" /></span>{courseDepartment}</a> | 
            <span class="text-gt">{creditHoursGPA[0]}</span> 
            {creditHoursGPA[0] === "1" ? "Credit Hr" : "Credit Hrs"} 
            | <span class="text-gt">{creditHoursGPA[1]}</span> Avg. GPA
            {#if creditHoursGPA[1] === "N/A"}
                <span>
                    <button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
                        <HelpCircle class="inline-block" />
                    </button>
                </span>
            {:else}
                {""}
            {/if}
        </h1>
    {/await}

    {#if $open}
    <div
        use:melt={$content}
        transition:fade={{ duration: 100 }}
        class="z-10 rounded-lg bg-gt shadow"
    >
        <div use:melt={$arrow} />
        <p class="px-4 py-1 text-gtsecondary">Data pulled from Oscar since Critique was unavailable.</p>
    </div>
    {/if}
    
</div>
<div class="flex flex-1 justify-center flex-col lg:flex-row mt-4 lg:mt-6 mx-2 lg:mx-12 mb-0 lg:mb-4">
    <div class="flex-1 flex flex-col rounded-md max-w-full lg:max-w-[33%] text-center">
        <h1 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3">Info</h1>
        <div class="flex flex-col border-gt border-dashed border-2 lg:border-none rounded-md p-1.5 m-2 md:mx-32 lg:mx-0">
            <p class="text-gtsecondary font-mono text-sm p-1.5 mb-2">{@html courseFullDescription}</p>
            <a target="_blank" class="text-gt underline decoration-gtsecondary flex mx-auto" href="https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in=202402&subj_code_in={courseDesignator}&crse_numb_in={courseNumber}">Oscar <span class="inline-block scale-75 align-center"><ExternalLink /></span></a>
            {#await data.creditHrsGPA}
                <h1 class="text-gt underline">...</h1>
            {:then creditHrsGPA} 
                {#if creditHrsGPA[1] !== "N/A"}
                    <a target="_blank" class="text-gt underline decoration-gtsecondary flex mx-auto" href="https://critique.gatech.edu/course?courseID={courseDesignator}%20{courseNumber}">Course Critique <span class="inline-block scale-75 align-center"><ExternalLink /></span></a>
                {/if}
            {/await}
        </div>
    </div>
    <div class="flex-auto rounded-md mt-3 mb-3 lg:mx-2 lg:mt-0 lg:mb-0 items-center overflow-x-scroll text-center">
        <h1 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 lg:mb-6">Requirements</h1>
        <PrereqTree treeData={data.reqs[0]} course={courseDesignator + " " + courseNumber}/>
    </div>
    <div class="flex-1 rounded-md max-w-full lg:max-w-[33%]">
        <h1 class="font-lemondays text-center text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-3 mt-4 lg:mt-0">Prereq For</h1>
        <div class="text-center items-center justify-center p-1.5 m-2">
            {#if data.reqs[1].length === 0}
                <button class="bg-gthorizon bg-opacity-15 border-2 border-gthorizon rounded-md p-2 font-lemondays text-gtsecondary m-2 w-28">None</button>
            {:else}
                {#each data.reqs[1] as req}
                    <button on:click={() => redirect(req)} class="bg-gthorizon bg-opacity-15 border-2 border-gthorizon rounded-md p-2 font-lemondays text-gtsecondary m-2 w-28"><span class="text-gt">{req.split(" ")[0]}</span> {req.split(" ")[1]}</button>
                {/each}
            {/if}

        </div>
    </div>
</div>