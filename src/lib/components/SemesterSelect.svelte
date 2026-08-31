<script>
    import { createDropdownMenu, melt } from '@melt-ui/svelte';
    import { ChevronDown } from 'lucide-svelte';
    import { fly } from 'svelte/transition';
    import { invalidateAll } from '$app/navigation';
    import { clearSearchCatalog } from "$lib/searchCatalog.js";

    export let semesters = [];
    export let current = '';
    export let buttonClass = 'my-auto text-md text-gtdark font-bold';
    export let onSelect = null;

    $: currentLabel = semesters.find((s) => s.id === current)?.label ?? '';

    const {
        elements: { menu, item, trigger },
        states: { open }
    } = createDropdownMenu({
        forceVisible: true,
        loop: true,
        positioning: {
            placement: 'bottom',
            gutter: 6
        }
    });

    const setSemester = async (id) => {
        open.set(false);
        if (!id || id === current) return;

        if (onSelect) {
            onSelect(id);
            return;
        }

        const response = await fetch('/api/semester', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ semester: id })
        });

        if (response.ok) {
            clearSearchCatalog();
            await invalidateAll();
        }
    };
</script>

<div class="relative w-fit self-center">
    <button type="button" use:melt={$trigger} class="{buttonClass} inline-flex items-center justify-center gap-0.5">
        {currentLabel}<ChevronDown class="inline-block transition-transform {$open ? 'rotate-180' : ''}" size={18} />
    </button>
    {#if $open}
        <div
            use:melt={$menu}
            transition:fly={{ duration: 150, y: -5 }}
            class="z-20 flex max-h-[300px] min-w-[160px] flex-col overflow-y-auto rounded-md bg-white p-2 shadow-lg border-2 border-gtdark text-center"
        >
            {#each semesters as { id, label }}
                <button
                    type="button"
                    use:melt={$item}
                    on:click={() => setSemester(id)}
                    class="w-full rounded px-3 py-1.5 text-md font-bold {id === current ? 'text-gt' : 'text-gtdark hover:text-gt'}"
                >
                    {label}
                </button>
            {/each}
        </div>
    {/if}
</div>
