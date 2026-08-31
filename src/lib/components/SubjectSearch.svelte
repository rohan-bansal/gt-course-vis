<script>
    import { onDestroy, onMount } from "svelte";
    import {
        createCombobox, melt 
    } from "@melt-ui/svelte";
    import { ChevronDown, ChevronUp } from 'lucide-svelte';
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import departments from "$lib/data/departments.json";
    import { ensureSearchCourses, searchCourses } from "$lib/searchCatalog.js";

    const RESULT_CAP = 30;
    const DEBOUNCE_MS = 150;

    export let prefetch = false;

    let makeRed = false;
    let debouncedQuery = "";
    let debounceTimer;

    $: catalog = $searchCourses ?? [];
    $: loading = $searchCourses === null;

    $: subjects = (() => {
        const seen = new Map();
        for (const course of catalog) {
            const designator = course.courseNumber.split(" ")[0];
            if (!seen.has(designator)) {
                seen.set(designator, {
                    designator,
                    name: departments[designator] ?? designator,
                });
            }
        }
        return [...seen.values()].sort((a, b) => a.designator.localeCompare(b.designator));
    })();

    const toOption = (subject) => ({
        value: subject.designator,
        label: subject.name,
        disabled: false,
    });

    const {
        elements: { menu, input, option },
        states: { open, inputValue, selected },
    } = createCombobox({
        forceVisible: true,
    });

    $: if (!$open && $selected) {
      $inputValue = $selected.value;
      makeRed = false;
    }

    $: query = ($inputValue || "").trim().toLowerCase();

    $: {
      clearTimeout(debounceTimer);
      if (!query) {
        debouncedQuery = "";
      } else {
        debounceTimer = setTimeout(() => {
          debouncedQuery = query;
        }, DEBOUNCE_MS);
      }
    }

    onDestroy(() => clearTimeout(debounceTimer));

    onMount(() => {
      if (prefetch) ensureSearchCourses();
    });

    function rankSubject(subject, q) {
        const designator = subject.designator.toLowerCase();
        const name = (subject.name || "").toLowerCase();
        if (designator === q) return 0;
        if (designator.startsWith(q)) return 1;
        if (name.startsWith(q)) return 2;
        if (name.includes(q) || designator.includes(q)) return 3;
        return -1;
    }

    function rankFilter(list, q) {
        if (!q) return [];
        return list
            .map((subject) => ({ subject, rank: rankSubject(subject, q) }))
            .filter((row) => row.rank >= 0)
            .sort((a, b) => a.rank - b.rank || a.subject.designator.localeCompare(b.subject.designator))
            .map((row) => row.subject);
    }

    $: filteredSubjects = rankFilter(subjects, debouncedQuery);
    $: visibleSubjects = filteredSubjects.slice(0, RESULT_CAP);

    const ensureCatalog = () => {
      ensureSearchCourses();
    };

    const redirect = async () => {
      const list = await ensureSearchCourses();
      const seen = new Map();
      for (const course of list) {
        const designator = course.courseNumber.split(" ")[0];
        if (!seen.has(designator)) {
          seen.set(designator, {
            designator,
            name: departments[designator] ?? designator,
          });
        }
      }
      const subjectList = [...seen.values()];
      const typed = ($inputValue || "").trim();
      const matches = rankFilter(subjectList, typed.toLowerCase());
      const exact = matches.find(
        (subject) => subject.designator.toLowerCase() === typed.toLowerCase()
      );
      const designator = $selected?.value || exact?.designator || (typed ? matches[0]?.designator : null);
      if (designator) {
        makeRed = false;
        goto(`/courses/${designator}`);
      } else {
        makeRed = true;
      }
    };
</script>

<div class="grid place-content-center">
  <div class="flex flex-row">
    <div class="relative font-apple-system m-auto mr-2">
      <input
        use:melt={$input}
        on:focus={ensureCatalog}
        on:keydown={(e) => {if (e.key === "Enter") { e.preventDefault(); redirect(); }}}
        class="flex h-10 items-center justify-between rounded-lg bg-white
            px-3 text-black {makeRed ? 'border-4 border-red-500' : ''}"
        placeholder="Subject Code"
      />
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
      <div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-gt" on:click={() => { ensureCatalog(); $open = !$open; }}>
        {#if $open}
          <ChevronUp class="square-4"/>
        {:else}
          <ChevronDown class="square-4"/>
        {/if}
      </div>
    </div>
    <button on:click={() => redirect()} class="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-gt text-gt text-gtsecondary">
      <span class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-gt top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
      <span class="relative text-gt transition duration-300 group-hover:text-gtsecondary ease">Go</span>
    </button>
  </div>
</div>
{#if $open}
  <ul
    class="z-10 flex max-h-[300px] flex-col overflow-hidden overflow-x-visible rounded-lg"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -5 }}
  >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="flex max-h-full flex-col gap-0 overflow-y-auto overflow-x-clip bg-white px-2 py-2 text-black"
      tabindex="0"
    >
      {#if loading}
        <li class="relative rounded-md py-1 pl-8 pr-4">Loading...</li>
      {:else if !debouncedQuery}
        <li class="relative rounded-md py-1 pl-8 pr-4">Type to search</li>
      {:else}
        {#each visibleSubjects as subject (subject.designator)}
          <li
            use:melt={$option(toOption(subject))}
            class="relative cursor-pointer scroll-my-2 rounded-md py-2 pr-4
          hover:bg-gt
          data-[highlighted]:bg-gt data-[highlighted]:text-gtsecondary
            data-[disabled]:opacity-50"
          >
            <div class="pl-2">
              <span class="font-medium">{subject.designator}</span>
              <span class="block text-xs opacity-75">{subject.name}</span>
            </div>
          </li>
        {:else}
          <li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
            No Subjects Found
          </li>
        {/each}
        {#if filteredSubjects.length > RESULT_CAP}
          <li class="relative rounded-md py-1 pl-8 pr-4 text-xs opacity-75">
            Showing {RESULT_CAP} of {filteredSubjects.length}
          </li>
        {/if}
      {/if}
    </div>
  </ul>
{/if}
