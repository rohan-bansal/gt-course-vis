<script>
    import {
        createCombobox, melt 
    } from "@melt-ui/svelte";
    import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    export let courses;
    let makeRed = false;

    const toOption = (course) => ({
        value: course.courseNumber,
        label: course.courseName,
        disabled: false,
    });

    const {
        elements: { menu, input, option },
        states: { open, inputValue, touchedInput, selected },
    } = createCombobox({
        forceVisible: true,
    });

    $: if (!$open) {
      if($selected) {
        $inputValue = $selected.value;
        makeRed = false;
      } else {
        $inputValue = "";
      }
    }

    let curInput = ""
    $: filteredCourses = $touchedInput
        ? courses.filter(({ courseNumber, courseName }) => {
            curInput = $inputValue;
            const normalizedInput = $inputValue.toLowerCase();
            return (
                courseNumber.toLowerCase().includes(normalizedInput) ||
                courseName.toLowerCase().includes(normalizedInput)
            );
        })
    : courses;

    const redirect = () => {
      console.log(curInput)
      if ($selected || filteredCourses.some((course) => course.courseNumber === curInput)) {
        makeRed = false;
        let course = $selected ? $selected.value : curInput;
        let designator = course.split(" ")[0];
        let number = course.split(" ")[1];
        window.location.href = `/courses/${designator}/${number}`;
      } else {
        makeRed = true;
      }
    }

</script>


 
<div class="grid place-content-center">
  <div class="flex flex-row">
    <div class="relative font-apple-system m-auto mr-2">
      {#if makeRed}
      <input
        use:melt={$input} on:keydown={(e) => {if (e.key === "Enter") redirect();}}
        class="flex h-10 items-center justify-between rounded-lg bg-white
            px-3 pr-12 text-black {makeRed ? 'border-4 border-red-500' : undefined}"
        placeholder="Course Number"
      />
      {:else}
      <input
        use:melt={$input} on:keydown={(e) => {if (e.key === "Enter") redirect();}}
        class="flex h-10 items-center justify-between rounded-lg bg-white
            px-3 pr-12 text-black"
        placeholder="Course Number"
      />
      {/if}
      
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions-->
      <div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-gt" on:click={() => $open = !$open}>
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
            <span class="block text-sm opacity-75">{@html course.courseName}</span>
          </div>
        </li>
      {:else}
        <li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
          No Courses Found
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