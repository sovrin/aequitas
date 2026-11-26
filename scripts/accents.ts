/*
 * The named accents (data-accent), each as its hue and the two shades it resolves to: light for
 * the light theme's fills, dark for the dark theme's. The one source for both the preset rules
 * (src/_generated/accents.css, via generate.ts) and dist/accents.json (via build.ts), for what
 * can't read the CSS: an SVG favicon, a canvas, a native shell.
 *
 * Most shades are the default formulas in tokens/color.css at the accent's hue
 * (light oklch(0.55 0.2 h), dark oklch(0.72 0.15 h)), written out so readers need no maths.
 */
export type Accent = { hue: number; light: string; dark: string; contrast?: string };

export const accents: Record<string, Accent> = {
  blue: { hue: 255, light: "oklch(0.55 0.2 255)", dark: "oklch(0.72 0.15 255)" },
  indigo: { hue: 280, light: "oklch(0.55 0.2 280)", dark: "oklch(0.72 0.15 280)" },
  purple: { hue: 305, light: "oklch(0.55 0.2 305)", dark: "oklch(0.72 0.15 305)" },
  pink: { hue: 350, light: "oklch(0.55 0.2 350)", dark: "oklch(0.72 0.15 350)" },
  red: { hue: 25, light: "oklch(0.55 0.2 25)", dark: "oklch(0.72 0.15 25)" },
  orange: { hue: 55, light: "oklch(0.55 0.2 55)", dark: "oklch(0.72 0.15 55)" },
  yellow: { hue: 90, light: "oklch(0.55 0.2 90)", dark: "oklch(0.72 0.15 90)" },
  // Green and teal are light hues: their solid fill is darkened so white text on it stays 4.5:1.
  // A custom --ae-hue between about 150 and 220 needs the same.
  green: { hue: 150, light: "oklch(0.5 0.17 150)", dark: "oklch(0.72 0.15 150)" },
  teal: { hue: 195, light: "oklch(0.5 0.13 195)", dark: "oklch(0.72 0.15 195)" },
  graphite: {
    hue: 255,
    light: "oklch(0.42 0.01 255)",
    dark: "oklch(0.78 0.01 255)",
    contrast: "light-dark(oklch(0.99 0 0), oklch(0.18 0 0))",
  },
};
