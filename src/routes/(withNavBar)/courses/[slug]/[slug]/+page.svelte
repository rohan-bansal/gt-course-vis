<script>

    import { ExternalLink} from 'lucide-svelte';    
    export let data;

    let courseDesignator = data.designator;
    let courseNumber = data.course;
    let courseDepartment = data.department;
    let courseDescription = data.fullData[0];
</script>

<div class="flex flex-col items-center justify-start mt-12">
    <div class="flex flex-row">
        <h1 class="text-5xl font-lemondays text-gtsecondary mb-2 ml-6 ">
            <span class="text-gt">{courseDesignator}</span>{courseNumber}
        </h1>
        <a target="_blank" href="https://oscar.gatech.edu/pls/bprod/bwckctlg.p_disp_course_detail?cat_term_in=202402&subj_code_in={courseDesignator}&crse_numb_in={courseNumber}"><ExternalLink class="ml-1 text-gtsecondary"/></a>
    </div>

    <h1 class="text-xl font-mono text-gtsecondary mb-4 underline decoration-wavy decoration-2 underline-offset-8">
        {@html courseDescription}
    </h1>
    {#await data.creditHrsGPA}
        <h1 class="text-sm font-mono text-gtsecondary">
            ...
        </h1>
    {:then creditHoursGPA} 
        <h1 class="text-sm font-mono text-gtsecondary">
            {courseDepartment} | <span class="text-gt">{creditHoursGPA[0]}</span> Credit Hrs | <span class="text-gt">{creditHoursGPA[1]}</span> GPA
        </h1>
    {/await}
    
</div>
