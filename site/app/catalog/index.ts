import type { Entry } from "./types";
import { actions } from "./actions";
import { inputs } from "./inputs";
import { selection } from "./selection";
import { surfaces } from "./surfaces";
import { data } from "./data";
import { content } from "./content";
import { feedback } from "./feedback";
import { overlays } from "./overlays";
import { navigation } from "./navigation";
import { chrome } from "./chrome";
import { marketing } from "./marketing";
import { conversation } from "./conversation";
import { layouts } from "./layouts";

export type { Entry, Demo } from "./types";

/** Component entries, in sidebar order. */
export const components: Entry[] = [
  ...actions,
  ...inputs,
  ...selection,
  ...surfaces,
  ...data,
  ...content,
  ...feedback,
  ...overlays,
  ...navigation,
  ...chrome,
  ...marketing,
  ...conversation,
];
export const layoutEntries: Entry[] = layouts;

export const componentGroups = [
  "Actions",
  "Inputs",
  "Selection",
  "Surfaces",
  "Data display",
  "Content",
  "Feedback",
  "Overlays",
  "Navigation",
  "App chrome",
  "Marketing",
  "Conversation",
];
export const layoutGroups = ["Shells", "Pages", "Application"];

export const byGroup = (entries: Entry[], groups: string[]) =>
  groups
    .map((g) => ({ group: g, entries: entries.filter((e) => e.group === g) }))
    .filter((g) => g.entries.length);

export const findComponent = (slug: string) => components.find((e) => e.slug === slug);
export const findLayout = (slug: string) => layoutEntries.find((e) => e.slug === slug);
export const routes = [
  ...components.map((e) => `/components/${e.slug}`),
  ...layoutEntries.map((e) => `/layouts/${e.slug}`),
];
