import { components, layoutEntries, componentGroups, layoutGroups, byGroup } from "~/catalog";

/* Site structure, derived from the catalog: sections, groups, flat page order (prev/next), search index. */
export type Link = { to: string; label: string };
export type Group = { group: string; links: Link[] };
/** Two levels: a section holds either direct links or collapsible groups. */
export type Section = { title: string; links?: Link[]; groups?: Group[] };

const foundations: Link[] = [
  { to: "/foundations/proportion", label: "Proportion" },
  { to: "/foundations/material", label: "Material" },
  { to: "/foundations/presets", label: "Presets" },
];
const showcases: Link[] = [
  { to: "/showcase/dashboard", label: "Dashboard" },
  { to: "/showcase/settings", label: "Settings" },
  { to: "/showcase/landing", label: "Landing" },
  { to: "/showcase/kitchen-sink", label: "Kitchen sink" },
];

export const sections: Section[] = [
  { title: "Start", links: [{ to: "/", label: "Overview" }] },
  { title: "Foundations", links: foundations },
  {
    title: "Layouts",
    groups: byGroup(layoutEntries, layoutGroups).map((g) => ({
      group: g.group,
      links: g.entries.map((e) => ({ to: `/layouts/${e.slug}`, label: e.title })),
    })),
  },
  {
    title: "Components",
    groups: byGroup(components, componentGroups).map((g) => ({
      group: g.group,
      links: g.entries.map((e) => ({ to: `/components/${e.slug}`, label: e.title })),
    })),
  },
  { title: "Showcase", links: showcases },
  { title: "Behaviours", links: [{ to: "/behaviours", label: "Behaviours" }] },
  {
    title: "Reference",
    links: [
      { to: "/reference/utilities", label: "Utilities" },
      { to: "/reference/icons", label: "Icons" },
      { to: "/reference/motion", label: "Motion" },
    ],
  },
];

/** Icon per group, from the framework's own set. */
export const groupIcons: Record<string, string> = {
  Shells: "layout",
  Pages: "grid",
  Application: "sliders",
  Actions: "arrow-right",
  Inputs: "edit",
  Selection: "check-square",
  Surfaces: "copy",
  "Data display": "table",
  Content: "type",
  Feedback: "bell",
  Overlays: "layers",
  Navigation: "menu",
  "App chrome": "monitor",
  Marketing: "globe",
  Conversation: "mail",
};

/** Every page in reading order, for prev/next. */
export const pages: Link[] = sections
  .flatMap((s) => s.links ?? s.groups!.flatMap((g) => g.links))
  .filter((l) => !l.to.includes("#"));

/** The group a path belongs to, if any. */
export const groupOf = (path: string): string | undefined =>
  sections
    .flatMap((s) => s.groups ?? [])
    .find((g) => g.links.some((l) => l.to.split("#")[0] === path))?.group;

export type Entry = { to: string; title: string; page: string; keywords: string };
export const index: Entry[] = [
  ...foundations.map((l) => ({
    to: l.to,
    title: l.label,
    page: "Foundations",
    keywords: "phi golden ratio scale colour frost glass tokens accent density presets",
  })),
  ...layoutEntries.map((e) => ({
    to: `/layouts/${e.slug}`,
    title: e.title,
    page: `Layouts · ${e.group}`,
    keywords: `${e.lede} ${e.demos.map((d) => d.title).join(" ")} ${e.keywords ?? ""}`,
  })),
  ...components.map((e) => ({
    to: `/components/${e.slug}`,
    title: e.title,
    page: e.group,
    keywords: `${e.lede} ${(e.owns ?? []).join(" ")} ${e.demos.map((d) => d.title).join(" ")} ${(e.attrs ?? []).map((a) => a[0]).join(" ")} ${e.keywords ?? ""}`,
  })),
  ...showcases.map((l) => ({
    to: l.to,
    title: l.label,
    page: "Showcase",
    keywords: "showcase example demo kitchen sink app",
  })),
  {
    to: "/behaviours",
    title: "Behaviours",
    page: "Behaviours",
    keywords:
      "javascript typescript data-open data-close dismiss theme tabs combobox copy toast init bind enhance api",
  },
  {
    to: "/reference/utilities",
    title: "Utilities",
    page: "Reference",
    keywords:
      "margin padding gap flex grid display position sizing typography colour shadow hairline responsive breakpoint hide-s hide-l light-only dark-only scrollbar helpers",
  },
  { to: "/reference/icons", title: "Icons", page: "Reference", keywords: "icon mask svg" },
  {
    to: "/reference/motion",
    title: "Motion",
    page: "Reference",
    keywords: "animate fade slide scale spin stagger loading bar reveal parallax scroll-driven",
  },
];
