<script>
    import "../app.css";
    import Footer from "$lib/components/Footer.svelte";

    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    
    inject({ mode: dev ? 'development' : 'production' });

</script>

<slot />

<Footer />