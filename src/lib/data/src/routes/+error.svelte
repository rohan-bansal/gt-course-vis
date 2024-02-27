<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
    <title>ERROR | GT Course Visualizer</title> 
</svelte:head>

<div class="h-screen flex flex-col items-center justify-start mt-16">
    <h1 class="text-5xl font-lemondays text-gt mb-4">
        {$page.status}
    </h1>
    <h1 class="text-xl font-mono text-gtsecondary underline decoration-solid decoration-2 underline-offset-8">
        {$page.error.message}
    </h1>
</div>
