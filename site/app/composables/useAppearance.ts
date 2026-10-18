// Site appearance shared by the panel (sidebar and topbar) and the Presets page, so every control agrees.
// Applying and persisting happens once, in plugins/appearance.client.ts.
export const useAppearance = () => ({
  theme: useState<"light" | "dark" | "auto">("ap-theme", () => "auto"),
  accent: useState("ap-accent", () => ""),
  density: useState("ap-density", () => ""),
  radius: useState("ap-radius", () => ""),
  // The site opts into the aurora; "" is the bare attribute (still), "off" removes it.
  aurora: useState<"" | "drift" | "off">("ap-aurora", () => ""),
  // --ae-aurora-seed; "" leaves the framework's default layout.
  auroraSeed: useState<number | "">("ap-aurora-seed", () => ""),
});
