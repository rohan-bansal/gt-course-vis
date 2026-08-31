<script>
    import "../app.css";
    import Footer from "$lib/components/Footer.svelte";

    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    
    inject({ mode: dev ? 'development' : 'production' });

</script>

<div class="flex h-full min-h-0 flex-col">
    <div class="min-h-0 flex-1 overflow-y-auto">
        <slot />
    </div>
    <Footer />
</div>