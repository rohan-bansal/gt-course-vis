<script>
    
    export let data;

    let courseDesignator = data.designator;
    let courseNumber = data.course;
    let courseDescription = data.fullData[0];

</script>

<div class="flex flex-col items-center justify-start mt-12">
    <h1 class="text-5xl font-lemondays text-gtsecondary mb-4 underline decoration-solid decoration-4 underline-offset-8">
        <span class="text-gt">{courseDesignator}</span>{courseNumber}
    </h1>
    <h1 class="text-xl font-mono text-gtsecondary">
        {courseDescription}
    </h1>
</div>
