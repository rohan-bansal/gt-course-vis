<script>
	import Tree from "./Tree.svelte";

    export let treeData;
    export let course;

    $: isEmpty = !treeData || (Array.isArray(treeData) && treeData.length === 0);
</script>

<div class="text-center text-gtsecondary my-1.5 mx-0 md:mx-4 md:my-4">
    <div>
        <span class="inline-block border-4 border-gt rounded-md p-2 font-lemondays text-gtsecondary bg-gt bg-opacity-15 w-28 m-0.5"><span class="text-gt">{course.split(" ")[0]}</span> {course.split(" ")[1]}</span>
    </div>
    <div class="bg-gtsecondary h-8 w-1 m-1 mx-auto"></div>
    {#if isEmpty}
        <span class="inline-block border-2 border-[#64CCC9] rounded-md p-2 font-lemondays text-gtsecondary m-0.5 w-28">None</span>
    {:else}
        <Tree data={treeData} />
    {/if}
</div>
