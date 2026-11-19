import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // Semester catalogs are multi-MB JSON files. Emitting them as JSON.parse("...")
  // instead of object literals keeps build memory flat as terms are added.
  json: { stringify: true },
});
