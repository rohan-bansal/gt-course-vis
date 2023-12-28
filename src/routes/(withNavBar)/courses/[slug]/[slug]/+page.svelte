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
</script>

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
            {#if creditHoursGPA[1] === "N/A"}
                <span>
                    <button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
                        <HelpCircle class="inline-block" />
                    </button>
                </span>
            {:else}
                {""}
            {/if}
            | <span class="text-gt">{creditHoursGPA[1]}</span> GPA
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
<div class="flex flex-1 flex-col md:flex-row mt-4 md:mt-6 mx-2 md:mx-12 mb-0 md:mb-4">
    <div class="flex-auto rounded-md">

    </div>
    <div class="flex-auto rounded-md mt-2 md:mx-2 md:mt-0 items-center overflow-x-scroll">
        <PrereqTree treeData={data.reqs[0]} course={courseDesignator + " " + courseNumber}/>
    </div>
    <div class="flex-auto rounded-md">

    </div>
</div>