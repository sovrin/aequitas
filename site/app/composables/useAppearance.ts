// Site appearance shared by the panel (sidebar and topbar) and the Presets page, so every control agrees.
// Applying and persisting happens once, in plugins/appearance.client.ts.
// The shapes' own --ae-radius-m in rem, as in tokens/presets.css: φ^-½ and φ^½.
export const PRESET_RADIUS: Record<string, number> = { soft: 0.786, round: 1.272 };

export const useAppearance = () => ({
  theme: useState<"light" | "dark" | "auto">("ap-theme", () => "auto"),
  accent: useState("ap-accent", () => ""),
  density: useState("ap-density", () => ""),
  radius: useState("ap-radius", () => ""),
  // --ae-radius-m in rem under the soft or round shape; "" keeps the preset's own.
  radiusM: useState<number | "">("ap-radius-m", () => ""),
  // The site opts into the aurora; "" is the bare attribute (still), "off" removes it.
  aurora: useState<"" | "drift" | "off">("ap-aurora", () => ""),
  // --ae-aurora-seed; "" leaves the framework's default layout.
  auroraSeed: useState<number | "">("ap-aurora-seed", () => ""),
});
