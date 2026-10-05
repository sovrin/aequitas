export type Demo = { title: string; html: string; note?: string; preview?: boolean };
export type Entry = {
  slug: string;
  title: string;
  group: string;
  lede: string;
  /**
   * What the page documents: classes (`.btn`) or elements (`dialog`, `input[type=checkbox]`).
   * The API table reads their data-* attributes from the built CSS. Defaults to `.{slug}`.
   */
  owns?: string[];
  /** The markup structure, one row per part: [selector, role]. */
  anatomy?: [string, string][];
  demos: Demo[];
  /**
   * Descriptions for the API table, keyed `name`, `name=a|b` or `selector[name]`. Attributes the
   * CSS matches are listed even without a row here; rows add meaning and the ones CSS can't show
   * (aria-*, custom properties, defaults).
   */
  attrs?: [string, string][];
  /** What aequitas.js adds. Its presence marks the page "needs aequitas.js". */
  js?: string;
  /** Keyboard interaction: [keys, effect]. */
  keys?: [string, string][];
  /** Accessibility notes: roles, labelling, what the markup must provide. */
  a11y?: string[];
  related?: string[];
  keywords?: string;
};
