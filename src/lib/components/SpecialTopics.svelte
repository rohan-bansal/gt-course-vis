<script>
    import { ExternalLink } from 'lucide-svelte';
    import { oscarScheduleUrl } from '$lib/courseUrl.js';

    export let topics = [];
    export let semester = '';
    export let designator = '';
    export let number = '';

    $: oscarUrl = oscarScheduleUrl(semester, designator, number);
</script>

{#if topics.length}
    <div class="w-full">
        <h2 class="font-lemondays text-2xl text-gtsecondary text-center underline decoration-gt underline-offset-4 decoration-4 mb-3">Topics</h2>
        <ul class="border-2 border-dashed border-gt rounded-md divide-y divide-gtdark">
            {#each topics as topic}
                <li class="flex items-start justify-between gap-3 py-3 px-3 md:px-4">
                    <div class="min-w-0">
                        <p class="font-lemondays text-gtsecondary">
                            <span class="text-gt">{topic.section}</span>
                            <span class="text-gtdark mx-2">·</span>
                            {topic.title}
                        </p>
                        <p class="font-mono text-sm text-gtsecondary mt-1">{topic.instructor}</p>
                    </div>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={oscarUrl}
                        class="text-gt shrink-0 mt-0.5"
                        aria-label="Oscar schedule for {designator} {number} section {topic.section}"
                    >
                        <ExternalLink size={18} />
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}
