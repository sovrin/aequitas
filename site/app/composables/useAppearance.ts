// Site appearance shared by the panel (sidebar and topbar) and the Presets page, so every control agrees.
// Applying and persisting happens once, in plugins/appearance.client.ts.
export const useAppearance = () => ({
  theme: useState<"light" | "dark" | "auto">("ap-theme", () => "auto"),
  accent: useState("ap-accent", () => ""),
  density: useState("ap-density", () => ""),
  radius: useState("ap-radius", () => ""),
});
