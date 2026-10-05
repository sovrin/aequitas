export const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Catalog prose to HTML: escapes it, then `code` becomes <code>. */
export const inline = (s: string) => escape(s).replace(/`([^`]+)`/g, "<code>$1</code>");
