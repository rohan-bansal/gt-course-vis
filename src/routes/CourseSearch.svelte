<script>
    import {
        createCombobox, melt 
    } from "@melt-ui/svelte";
    import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    export let courses;

    const toOption = (course) => ({
        value: course.courseNumber,
        label: course.courseName,
        disabled: false,
    });

    const {
        elements: { menu, input, option, label },
        states: { open, inputValue, touchedInput, selected },
    } = createCombobox({
        forceVisible: true,
    });

    $: if (!$open) {
      $inputValue = $selected ? $selected.value : "";
    }

    $: filteredCourses = $touchedInput
        ? courses.filter(({ courseNumber, courseName }) => {
            const normalizedInput = $inputValue.toLowerCase();
            return (
                courseNumber.toLowerCase().includes(normalizedInput) ||
                courseName.toLowerCase().includes(normalizedInput)
            );
        })
    : courses;

</script>


 
<div class="grid place-content-center">
  <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
  <label use:melt={$label} class="flex flex-col items-center mb-2">
    <span class="text-sm font-medium text-gtsecondary font-lemondays font-bold"
      >Choose a Course:</span
    >
  </label>
 
  <div class="relative font-apple-system">
    <input
      use:melt={$input}
      class="flex h-10 items-center justify-between rounded-lg bg-white
          px-3 pr-12 text-black"
      placeholder="Course Number"
    />
    <div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-gt">
      {#if $open}
        <ChevronUp class="square-4" />
      {:else}
        <ChevronDown class="square-4" />
      {/if}
    </div>
  </div>
</div>
{#if $open}
  <ul
    class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -5 }}
  >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
      tabindex="0"
    >
      {#each filteredCourses as course, index (index)}
        <li
          use:melt={$option(toOption(course))}
          class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        hover:bg-gt
        data-[highlighted]:bg-gt data-[highlighted]:text-gtsecondary
          data-[disabled]:opacity-50"
        >
          {#if course.courseNumber === $selected?.value}
            <div class="check absolute left-2 top-1/2 z-10 text-gtdark">
              <Check class="square-4 scale-75" />
            </div>
          {/if}
          <div class="pl-4">
            <span class="font-medium">{course.courseNumber}</span>
            <span class="block text-sm opacity-75">{course.courseName}</span>
          </div>
        </li>
      {:else}
        <li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
          Loading Courses...
        </li>
      {/each}
    </div>
  </ul>
{/if}

<style lang="postcss">
  .check {
    @apply absolute left-0.5 top-1/2;
    translate: 0 calc(-50% + 1px);
  }
</style>