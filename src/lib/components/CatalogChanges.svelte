<script>
    import SemesterSelect from "$lib/components/SemesterSelect.svelte";
    import { coursePath } from "$lib/courseUrl.js";
    import { goto } from "$app/navigation";

    export let currentLabel = "";
    export let vs = "";
    export let vsOptions = [];
    export let added = [];
    export let removed = [];

    let query = "";
    let tab = "added";

    const matches = (course, needle) => {
        if (!needle) return true;
        return (
            course.courseNumber.toLowerCase().includes(needle) ||
            (course.courseName || "").toLowerCase().includes(needle)
        );
    };

    $: needle = query.trim().toLowerCase();
    $: shownAdded = added.filter((c) => matches(c, needle));
    $: shownRemoved = removed.filter((c) => matches(c, needle));

    const setVs = (id) => {
        goto(`/changes?vs=${id}`, { replaceState: true, noScroll: true, keepFocus: true });
    };
</script>

<section class="w-full max-w-5xl mx-auto px-4">
    <div class="border-2 border-dashed border-gt rounded-md p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
            <div>
                <h2 class="font-lemondays text-2xl text-gtsecondary underline decoration-gt underline-offset-4 decoration-4 mb-2">Catalog Changes</h2>
                <p class="text-sm font-mono text-gtsecondary flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{currentLabel}</span>
                    <span class="text-gtdark">vs</span>
                    <SemesterSelect
                        semesters={vsOptions}
                        current={vs}
                        onSelect={setVs}
                        buttonClass="text-sm text-gtsecondary font-bold"
                    />
                </p>
            </div>
            <p class="font-mono text-sm text-gtsecondary">
                <span class="text-gtlime">+{added.length}</span> now offered
                <span class="text-gtdark mx-2">|</span>
                <span class="text-gthorizon">−{removed.length}</span> no longer listed
            </p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <input
                bind:value={query}
                type="search"
                placeholder="Filter courses"
                class="flex h-10 w-full sm:max-w-xs items-center rounded-lg bg-white px-3 text-black"
            />
            <div class="flex lg:hidden gap-2 font-mono text-sm">
                <button
                    type="button"
                    class="px-3 py-1 rounded-md border-2 {tab === 'added' ? 'border-gtlime text-gtlime' : 'border-gtdark text-gtdark'}"
                    on:click={() => (tab = 'added')}
                >Added</button>
                <button
                    type="button"
                    class="px-3 py-1 rounded-md border-2 {tab === 'removed' ? 'border-gthorizon text-gthorizon' : 'border-gtdark text-gtdark'}"
                    on:click={() => (tab = 'removed')}
                >Removed</button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="{tab === 'removed' ? 'hidden lg:block' : ''}">
                <h3 class="font-lemondays text-lg text-gtlime mb-2">Now Offered</h3>
                <div class="max-h-80 overflow-y-auto text-left">
                    {#if shownAdded.length === 0}
                        <p class="font-mono text-sm text-gtdark">None</p>
                    {:else}
                        {#each shownAdded as course}
                            <a
                                href={coursePath(course.courseNumber)}
                                class="block rounded-md px-2 py-1.5 hover:bg-gtlime hover:bg-opacity-15"
                            >
                                <span class="font-lemondays text-gtsecondary">
                                    <span class="text-gt">{course.courseNumber.split(" ")[0]}</span>
                                    {course.courseNumber.split(" ")[1]}
                                </span>
                                {#if course.courseName}
                                    <span class="block font-mono text-xs text-gtdark">{course.courseName}</span>
                                {/if}
                            </a>
                        {/each}
                    {/if}
                </div>
            </div>
            <div class="{tab === 'added' ? 'hidden lg:block' : ''}">
                <h3 class="font-lemondays text-lg text-gthorizon mb-2">No Longer Listed</h3>
                <div class="max-h-80 overflow-y-auto text-left">
                    {#if shownRemoved.length === 0}
                        <p class="font-mono text-sm text-gtdark">None</p>
                    {:else}
                        {#each shownRemoved as course}
                            <div class="rounded-md px-2 py-1.5">
                                <span class="font-lemondays text-gtsecondary">
                                    <span class="text-gt">{course.courseNumber.split(" ")[0]}</span>
                                    {course.courseNumber.split(" ")[1]}
                                </span>
                                {#if course.courseName}
                                    <span class="block font-mono text-xs text-gtdark">{course.courseName}</span>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>
