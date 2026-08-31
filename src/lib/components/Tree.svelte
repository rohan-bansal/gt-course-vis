<script>
    import { coursePath } from "$lib/courseUrl.js";

    export let data;
    export let index = -1;
    export let maxIndex = -2;

    const restElementsNotArray = (arr) => {
        let res = true;
        for (let i = 1; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                res = false;
                break;
            }
        }
        return res;
    }
</script>

{#if Array.isArray(data) && data.length > 0}
    {#if data[0] === "or" && data.length === 2}
        <svelte:self data={data[1]} />
    {:else}
        <ul>
            <li>
                <div>
                    <p class="font-mono underline conditional">{data[0] === "and" ? "all of" : "any of"}</p>
                </div>
                {#if restElementsNotArray(data)}
                    <ul class="flex flex-col">
                    {#each data.slice(1) as item}
                        <li class="flex-1">
                            <svelte:self data={item} />
                        </li>
                    {/each}
                    </ul>
                {:else}
                    <ul class="flex flex-row conditional-connect">
                    {#each data.slice(1) as item, childIndex}
                        <li class="flex-1 {childIndex === 0 ? "leftmost-conditional" : (childIndex === data.slice(1).length - 1 ? "rightmost-conditional" : "middle-conditional")}">
                            <svelte:self data={item} index={childIndex} maxIndex={data.slice(1).length - 1}/>
                        </li>
                    {/each}
                    </ul>
                {/if}
            </li>
        </ul>
    {/if}
{:else if data?.id}
    <div class="relative {index === 0 ? "leftmost-course" : (index === maxIndex ? "rightmost-course" : "")}">
        <a href={coursePath(data.id)} class="inline-block border-2 border-gtblue rounded-md p-2 font-lemondays text-gtsecondary bg-gtblue bg-opacity-15 m-0.5 w-28"><span class="text-gt">{data.id.split(" ")[0]}</span> {data.id.split(" ")[1]}</a>
    </div>
{/if}
