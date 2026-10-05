import { fileURLToPath } from "node:url";
import { routes } from "./app/catalog";

// Prerendered docs for aequitas: every route ships as real HTML and hydrates into an SPA.
// The framework itself is the parent package's dist/.
export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: false },
  css: [
    fileURLToPath(new URL("../dist/aequitas.css", import.meta.url)),
    fileURLToPath(new URL("../dist/aequitas.icons.css", import.meta.url)),
    "~/assets/docs.css",
  ],
  alias: {
    "@aequitas": fileURLToPath(new URL("../dist", import.meta.url)),
  },
  // Route transitions live in plugins/aequitas.client.ts (View Transitions API with a Vue fallback).
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "en", "data-ae-manual": "" },
      title: "aequitas",
      meta: [{ name: "description", content: "A minimal design language in golden proportion." }],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      // Restore the saved appearance before first paint, so the prerendered page never flashes the
      // system theme (or default accent/density/shape) while the bundle loads.
      script: [
        {
          tagPosition: "head",
          tagPriority: "critical",
          innerHTML: `try{var d=document.documentElement.dataset,s=localStorage,t=s.getItem("ae-theme");if(t==="light"||t==="dark")d.theme=t;["accent","density","radius"].forEach(function(k){var v=s.getItem("docs-"+k);if(v)d[k]=v})}catch(e){}`,
        },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: [
        "/",
        "/foundations/proportion",
        "/foundations/material",
        "/foundations/presets",
        "/behaviours",
        "/reference/utilities",
        "/reference/icons",
        "/reference/motion",
        "/showcase/dashboard",
        "/showcase/settings",
        "/showcase/landing",
        "/showcase/kitchen-sink",
        ...routes,
      ],
    },
  },
  vite: {
    server: { fs: { allow: [fileURLToPath(new URL("..", import.meta.url))] } },
  },
});
