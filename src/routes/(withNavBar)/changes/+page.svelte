<script>
    import CatalogChanges from "$lib/components/CatalogChanges.svelte";
    export let data;

    $: currentLabel = data.semesters.find((s) => s.id === data.semester)?.label ?? "";
    $: vsOptions = data.semesters.filter((s) => s.id !== data.semester);
</script>

<svelte:head>
    <title>Catalog Changes | GT Course Visualizer</title>
</svelte:head>

<div class="px-4 pt-4 pb-12">
    {#if data.vs}
        <CatalogChanges
            currentLabel={currentLabel}
            vs={data.vs}
            vsOptions={vsOptions}
            added={data.added}
            removed={data.removed}
        />
    {:else}
        <p class="text-center font-mono text-gtsecondary">Not enough semesters to compare.</p>
    {/if}
</div>
