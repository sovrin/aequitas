/*
 * The icon set: 377 stroke icons on a 24-grid with squared caps and joins.
 * Hand-authored icons are raw SVG bodies; families (arrows, chevrons, corners, files, folders,
 * users, calendars…) are built from primitives and derived by rotation or mirroring.
 */
type Pt = [number, number];
type Shape =
  | { t: "poly"; pts: Pt[]; close?: boolean }
  | { t: "rect"; x: number; y: number; w: number; h: number }
  | { t: "circle"; cx: number; cy: number; r: number }
  | { t: "dot"; x: number; y: number }
  | {
      t: "arc";
      x1: number;
      y1: number;
      r: number;
      x2: number;
      y2: number;
      large: 0 | 1;
      sweep: 0 | 1;
    }
  | { t: "raw"; d: string };

const poly = (...pts: Pt[]): Shape => ({ t: "poly", pts });
const closed = (...pts: Pt[]): Shape => ({ t: "poly", pts, close: true });
const rect = (x: number, y: number, w: number, h: number): Shape => ({ t: "rect", x, y, w, h });
const circ = (cx: number, cy: number, r: number): Shape => ({ t: "circle", cx, cy, r });
const dot = (x: number, y: number): Shape => ({ t: "dot", x, y });
const raw = (d: string): Shape => ({ t: "raw", d });
const arc = (
  x1: number,
  y1: number,
  r: number,
  x2: number,
  y2: number,
  large: 0 | 1 = 0,
  sweep: 0 | 1 = 1,
): Shape => ({ t: "arc", x1, y1, r, x2, y2, large, sweep });

const f = (n: number) => String(Math.round(n * 100) / 100);
const map = (shapes: Shape[], T: (x: number, y: number) => Pt, flipSweep = false): Shape[] =>
  shapes.map((s) => {
    switch (s.t) {
      case "poly":
        return { ...s, pts: s.pts.map(([x, y]) => T(x, y)) };
      case "rect": {
        const [ax, ay] = T(s.x, s.y);
        const [bx, by] = T(s.x + s.w, s.y + s.h);
        return rect(Math.min(ax, bx), Math.min(ay, by), Math.abs(bx - ax), Math.abs(by - ay));
      }
      case "circle": {
        const [cx, cy] = T(s.cx, s.cy);
        return circ(cx, cy, s.r);
      }
      case "dot": {
        const [x, y] = T(s.x, s.y);
        return dot(x, y);
      }
      case "arc": {
        const [x1, y1] = T(s.x1, s.y1);
        const [x2, y2] = T(s.x2, s.y2);
        return { ...s, x1, y1, x2, y2, sweep: flipSweep ? ((1 - s.sweep) as 0 | 1) : s.sweep };
      }
      default:
        return s;
    }
  });
/** Rotate k×90° clockwise about the grid centre. */
const rot = (shapes: Shape[], k: number) =>
  map(shapes, (x, y) => {
    for (let i = 0; i < ((k % 4) + 4) % 4; i++) [x, y] = [24 - y, x];
    return [x, y];
  });
const flipx = (shapes: Shape[]) => map(shapes, (x, y) => [24 - x, y], true);

const emit = (shapes: Shape[]): string => {
  const parts: string[] = [];
  const path: string[] = [];
  for (const s of shapes) {
    if (s.t === "poly")
      path.push(
        "M" +
          s.pts.map(([x, y], i) => (i ? "L" : "") + f(x) + " " + f(y)).join("") +
          (s.close ? "Z" : ""),
      );
    else if (s.t === "arc")
      path.push(
        `M${f(s.x1)} ${f(s.y1)}A${f(s.r)} ${f(s.r)} 0 ${s.large} ${s.sweep} ${f(s.x2)} ${f(s.y2)}`,
      );
    else if (s.t === "raw") path.push(s.d);
    else if (s.t === "rect")
      parts.push(`<rect x='${f(s.x)}' y='${f(s.y)}' width='${f(s.w)}' height='${f(s.h)}'/>`);
    else if (s.t === "circle")
      parts.push(`<circle cx='${f(s.cx)}' cy='${f(s.cy)}' r='${f(s.r)}'/>`);
    else if (s.t === "dot")
      parts.push(
        `<rect x='${f(s.x - 1)}' y='${f(s.y - 1)}' width='2' height='2' fill='black' stroke='none'/>`,
      );
  }
  if (path.length) parts.unshift(`<path d='${path.join("")}'/>`);
  return parts.join("");
};

const out: Record<string, string> = {};
const R = (name: string, body: string) => {
  out[name] = body;
};
const A = (name: string, ...shapes: Shape[]) => {
  out[name] = emit(shapes);
};
/** Four rotations of one definition: names in order up, right, down, left. */
const family = (shapes: Shape[], names: [string, string, string, string]) =>
  names.forEach((n, k) => n && A(n, ...rot(shapes, k)));

/* ---------- hand-authored ---------- */
(R("check", "<path d='M4 12l5 5L20 7'/>"),
  R("x", "<path d='M6 6l12 12M18 6L6 18'/>"),
  R("plus", "<path d='M12 5v14M5 12h14'/>"),
  R("minus", "<path d='M5 12h14'/>"),
  R("chevron-down", "<path d='M6 9l6 6 6-6'/>"),
  R("chevron-up", "<path d='M6 15l6-6 6 6'/>"),
  R("chevron-left", "<path d='M15 6l-6 6 6 6'/>"),
  R("chevron-right", "<path d='M9 6l6 6-6 6'/>"),
  R("arrow-right", "<path d='M4 12h16M14 6l6 6-6 6'/>"),
  R("arrow-left", "<path d='M20 12H4M10 6l-6 6 6 6'/>"),
  R("arrow-up", "<path d='M12 20V4M6 10l6-6 6 6'/>"),
  R("arrow-down", "<path d='M12 4v16M6 14l6 6 6-6'/>"),
  R("search", "<circle cx='11' cy='11' r='7'/><path d='M20 20l-4-4'/>"),
  R("menu", "<path d='M4 7h16M4 12h16M4 17h16'/>"),
  R(
    "more",
    "<g fill='black' stroke='none'><rect x='4' y='11' width='2' height='2'/><rect x='11' y='11' width='2' height='2'/><rect x='18' y='11' width='2' height='2'/></g>",
  ),
  R(
    "sliders",
    "<path d='M4 7h8M16 7h4M4 17h4M12 17h8'/><rect x='12' y='5' width='4' height='4'/><rect x='8' y='15' width='4' height='4'/>",
  ),
  R(
    "user",
    "<rect x='8' y='4' width='8' height='8'/><path d='M4 20v-2a3 3 0 013-3h10a3 3 0 013 3v2'/>",
  ),
  R("bell", "<path d='M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 20h4'/>"),
  R("copy", "<rect x='9' y='9' width='11' height='11'/><path d='M5 15V4h11'/>"),
  R("trash", "<path d='M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6'/>"),
  R("edit", "<path d='M4 20h4L19 9l-4-4L4 16zM13 7l4 4'/>"),
  R("external", "<path d='M14 4h6v6M20 4l-9 9M19 14v6H4V5h6'/>"),
  R("download", "<path d='M12 4v12M6 10l6 6 6-6M4 20h16'/>"),
  R("upload", "<path d='M12 16V4M6 10l6-6 6 6M4 20h16'/>"),
  R("home", "<path d='M4 11l8-7 8 7v9h-5v-6h-6v6H4z'/>"),
  R("calendar", "<rect x='4' y='6' width='16' height='14'/><path d='M4 10h16M8 4v4M16 4v4'/>"),
  R("clock", "<circle cx='12' cy='12' r='8'/><path d='M12 8v4l3 2'/>"),
  R(
    "info",
    "<rect x='4' y='4' width='16' height='16'/><path d='M12 11v5'/><rect x='11' y='6.5' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "warning",
    "<path d='M12 4l9 16H3zM12 10v4'/><rect x='11' y='16' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("mail", "<rect x='4' y='6' width='16' height='12'/><path d='M4 7l8 6 8-6'/>"),
  R("lock", "<rect x='6' y='11' width='12' height='9'/><path d='M9 11V8a3 3 0 016 0v3'/>"),
  R(
    "eye",
    "<path d='M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z'/><rect x='10' y='10' width='4' height='4'/>",
  ),
  R("filter", "<path d='M4 6h16l-6 7v6l-4-2v-4z'/>"),
  R("sort", "<path d='M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3'/>"),
  R("bookmark", "<path d='M7 4h10v16l-5-4-5 4z'/>"),
  R(
    "grid",
    "<rect x='4' y='4' width='6' height='6'/><rect x='14' y='4' width='6' height='6'/><rect x='4' y='14' width='6' height='6'/><rect x='14' y='14' width='6' height='6'/>",
  ),
  R(
    "list",
    "<path d='M9 7h11M9 12h11M9 17h11'/><g fill='black' stroke='none'><rect x='4' y='6' width='2' height='2'/><rect x='4' y='11' width='2' height='2'/><rect x='4' y='16' width='2' height='2'/></g>",
  ),
  R(
    "refresh",
    "<path d='M4 12a8 8 0 018-8 8.5 8.5 0 015.99 2.44L20 8M20 3v5h-5M20 12a8 8 0 01-8 8 8.5 8.5 0 01-5.99-2.44L4 16M4 21v-5h5'/>",
  ),
  R(
    "link",
    "<path d='M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1'/>",
  ),
  R(
    "sun",
    "<rect x='8' y='8' width='8' height='8'/><path d='M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2'/>",
  ),
  R("moon", "<path d='M21 13A9 9 0 1111 3a7 7 0 0010 10z'/>"),
  R("layout", "<rect x='4' y='4' width='16' height='16'/><path d='M9 4v16M4 10h5'/>"),
  R(
    "globe",
    "<circle cx='12' cy='12' r='8'/><path d='M4 12h16M5.5 8h13M5.5 16h13M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16'/>",
  ),
  R("star", "<path d='M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'/>"),
  R("heart", "<path d='M12 20s-7-4.6-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.4-7 10-7 10z'/>"),
  R("folder", "<path d='M3 6h6l2 2h10v11H3z'/>"),
  R("file", "<path d='M6 3h8l4 4v14H6zM14 3v4h4'/>"),
  R(
    "image",
    "<rect x='4' y='4' width='16' height='16'/><path d='M4 16l5-5 4 4 3-3 4 4'/><rect x='14' y='7' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("camera", "<path d='M4 8h4l2-2h4l2 2h4v11H4z'/><rect x='9' y='10' width='6' height='6'/>"),
  R("play", "<path d='M7 4l13 8-13 8z'/>"),
  R("pause", "<path d='M7 4h3v16H7zM14 4h3v16h-3z'/>"),
  R("stop", "<rect x='5' y='5' width='14' height='14'/>"),
  R("volume", "<path d='M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11'/>"),
  R(
    "mic",
    "<rect x='9' y='3' width='6' height='11'/><path d='M5 11a7 7 0 0014 0M12 18v3M9 21h6'/>",
  ),
  R("video", "<rect x='3' y='7' width='13' height='10'/><path d='M16 11l5-3v8l-5-3'/>"),
  R(
    "phone",
    "<path d='M5 4h4l2 5-3 2a10 10 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z'/>",
  ),
  R(
    "pin",
    "<path d='M12 21s-6-6.4-6-11a6 6 0 0112 0c0 4.6-6 11-6 11z'/><rect x='10' y='8' width='4' height='4'/>",
  ),
  R(
    "tag",
    "<path d='M3 3h9l9 9-9 9-9-9z'/><rect x='7' y='7' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("flag", "<path d='M5 21V4h13l-3 4 3 4H5'/>"),
  R("inbox", "<path d='M4 4h16v16H4zM4 14h5l1 2h4l1-2h5'/>"),
  R("archive", "<path d='M3 4h18v4H3zM5 8v12h14V8M10 12h4'/>"),
  R("send", "<path d='M21 3L3 10l8 3 3 8zM11 13l10-10'/>"),
  R("share", "<path d='M12 3v12M7 8l5-5 5 5M5 13v7h14v-7'/>"),
  R("zoom-in", "<circle cx='11' cy='11' r='7'/><path d='M20 20l-4-4M8 11h6M11 8v6'/>"),
  R("zoom-out", "<circle cx='11' cy='11' r='7'/><path d='M20 20l-4-4M8 11h6'/>"),
  R("maximize", "<path d='M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6'/>"),
  R("minimize", "<path d='M10 4v6H4M14 20v-6h6M4 4l6 6M20 20l-6-6'/>"),
  R("log-out", "<path d='M10 4H4v16h6M14 8l4 4-4 4M8 12h10'/>"),
  R("log-in", "<path d='M14 4h6v16h-6M9 8l4 4-4 4M3 12h10'/>"),
  R(
    "help",
    "<rect x='4' y='4' width='16' height='16'/><path d='M9.5 10a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4'/><rect x='11' y='16' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("code", "<path d='M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'/>"),
  R("terminal", "<rect x='3' y='4' width='18' height='16'/><path d='M7 9l3 3-3 3M12 15h5'/>"),
  R("database", "<rect x='4' y='3' width='16' height='18'/><path d='M4 9h16M4 15h16'/>"),
  R("cloud", "<path d='M7 18a4 4 0 010-8 5 5 0 019.6-1.5A3.5 3.5 0 0117 18z'/>"),
  R(
    "wifi",
    "<path d='M2 9a15 15 0 0120 0M5.5 12.5a10 10 0 0113 0M9 16a5 5 0 016 0'/><rect x='11' y='18' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "battery",
    "<rect x='3' y='8' width='16' height='8'/><path d='M19 10h2v4h-2'/><rect x='5' y='10' width='8' height='4' fill='black' stroke='none'/>",
  ),
  R(
    "paperclip",
    "<path d='M16 7l-7.5 7.5a2.5 2.5 0 003.5 3.5L19.5 10.5a4.5 4.5 0 00-6.4-6.4L5.5 11.7a6.5 6.5 0 009.2 9.2L20 15.5'/>",
  ),
  R("undo", "<path d='M8 7L4 11l4 4M4 11h10a5 5 0 010 10h-3'/>"),
  R("redo", "<path d='M16 7l4 4-4 4M20 11H10a5 5 0 000 10h3'/>"),
  R("printer", "<path d='M7 8V3h10v5M5 8h14v8h-3v4H8v-4H5zM8 13h8'/>"),
  R("shield", "<path d='M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'/>"),
  R("key", "<circle cx='8' cy='14' r='4'/><path d='M11 11l9-9M16 6l3 3M14 8l2 2'/>"),
  R("credit-card", "<rect x='3' y='5' width='18' height='14'/><path d='M3 10h18M7 15h4'/>"),
  R(
    "cart",
    "<path d='M3 4h3l2 11h11l2-8H7'/><rect x='9' y='18' width='2' height='2' fill='black' stroke='none'/><rect x='16' y='18' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("activity", "<path d='M3 12h4l3-8 4 16 3-8h4'/>"),
  R("bar-chart", "<path d='M4 20h16M6 20v-7M11 20V5M16 20v-10'/>"),
  R("trending-up", "<path d='M3 17l6-6 4 4 8-8M15 7h6v6'/>"),
  R("hash", "<path d='M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16'/>"),
  R(
    "at-sign",
    "<circle cx='12' cy='12' r='4'/><path d='M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7.1'/>",
  ),
  R(
    "percent",
    "<path d='M19 5L5 19'/><rect x='5' y='5' width='4' height='4'/><rect x='15' y='15' width='4' height='4'/>",
  ),
  R("columns", "<rect x='4' y='4' width='16' height='16'/><path d='M12 4v16'/>"),
  R("rows", "<rect x='4' y='4' width='16' height='16'/><path d='M4 12h16'/>"),
  R("table", "<rect x='4' y='4' width='16' height='16'/><path d='M4 10h16M4 15h16M10 10v10'/>"),
  R("type", "<path d='M5 7V4h14v3M12 4v16M9 20h6'/>"),
  R("bold", "<path d='M7 4h6a4 4 0 010 8H7zM7 12h7a4 4 0 010 8H7z'/>"),
  R("italic", "<path d='M10 4h8M6 20h8M14 4l-4 16'/>"),
  R("underline", "<path d='M6 4v6a6 6 0 0012 0V4M5 20h14'/>"),
  R("list-ordered", "<path d='M10 7h10M10 12h10M10 17h10M4 4h1.5v6M4 14h3v3H4v3h3'/>"),
  R("align-left", "<path d='M4 6h16M4 10h10M4 14h16M4 18h10'/>"),
  R("align-center", "<path d='M4 6h16M7 10h10M4 14h16M7 18h10'/>"),
  R("align-right", "<path d='M4 6h16M10 10h10M4 14h16M10 18h10'/>"),
  R("quote", "<path d='M5 7h6v6H5zM13 7h6v6h-6zM11 13c0 3-2 4-4 4M19 13c0 3-2 4-4 4'/>"),
  R("unlock", "<rect x='6' y='11' width='12' height='9'/><path d='M9 11V8a3 3 0 015.8-1'/>"),
  R("eye-off", "<path d='M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6zM4 4l16 16'/>"),
  R("bell-off", "<path d='M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 20h4M4 4l16 16'/>"),
  R("zap", "<path d='M13 3L4 14h7l-1 7 9-11h-7z'/>"),
  R("drop", "<path d='M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z'/>"),
  R("compass", "<circle cx='12' cy='12' r='8'/><path d='M15 9l-2 4-4 2 2-4z'/>"),
  R("navigation", "<path d='M20 4L4 11l7 2 2 7z'/>"),
  R(
    "target",
    "<rect x='4' y='4' width='16' height='16'/><rect x='8' y='8' width='8' height='8'/><rect x='11' y='11' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("crosshair", "<circle cx='12' cy='12' r='7'/><path d='M12 2v5M12 17v5M2 12h5M17 12h5'/>"),
  R(
    "wrench",
    "<path d='M6.06 20.06l7.13-7.13A5 5 0 0020.03 6.39l-2.12 2.12-2.42-2.42 2.12-2.12A5 5 0 0011.07 10.81l-7.13 7.13z'/>",
  ),
  R("brush", "<path d='M20 4L10 14M9 13l2 2M4 20c3 0 5-1 5-4a2 2 0 00-4 0c0 1-.5 3-1 4z'/>"),
  R(
    "palette",
    "<path d='M12 20a8 8 0 118-8 3 3 0 01-3 3h-2a3 3 0 00-3 3z'/><rect x='7' y='11' width='2' height='2' fill='black' stroke='none'/><rect x='9' y='7' width='2' height='2' fill='black' stroke='none'/><rect x='14' y='7' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R("layers", "<path d='M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5'/>"),
  R("box", "<path d='M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10'/>"),
  R("package", "<path d='M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M8 5l8 4'/>"),
  R(
    "anchor",
    "<circle cx='12' cy='5' r='2'/><path d='M12 7v14M5 13a7 7 0 0014 0M3 13h4M17 13h4'/>",
  ),
  R("map", "<path d='M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14'/>"),
  R("award", "<circle cx='12' cy='9' r='5'/><path d='M8.5 13L7 21l5-3 5 3-1.5-8'/>"),
  R(
    "coffee",
    "<path d='M4 8h12v6a4 4 0 01-4 4H8a4 4 0 01-4-4zM16 10h2a2 2 0 010 4h-2M6 4v2M10 4v2'/>",
  ),
  R(
    "gift",
    "<path d='M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8c-3 0-5-1-5-3a2 2 0 014 0c0 1 1 3 1 3s1-2 1-3a2 2 0 014 0c0 2-2 3-5 3'/>",
  ),
  R(
    "rocket",
    "<path d='M12 3l3.5 4v9h-7V7zM8.5 11L5 14.5V18l3.5-2M15.5 11l3.5 3.5V18l-3.5-2M12 19v2'/><rect x='11' y='9' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "smile",
    "<circle cx='12' cy='12' r='8'/><path d='M8 14s1.5 2 4 2 4-2 4-2'/><rect x='8.5' y='9' width='2' height='2' fill='black' stroke='none'/><rect x='13.5' y='9' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "flame",
    "<path d='M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 1.5-4.5 3-6 0 2.5 1 4 2.5 4.5C11 9 10.5 6 12 3z'/>",
  ),
  R("pie", "<circle cx='12' cy='12' r='8'/><path d='M12 4v8h8'/>"),
  R("bluetooth", "<path d='M7 7l10 10-5 4V3l5 4L7 17'/>"),
  R(
    "cpu",
    "<rect x='6' y='6' width='12' height='12'/><rect x='10' y='10' width='4' height='4'/><path d='M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3'/>",
  ),
  R("monitor", "<rect x='3' y='4' width='18' height='12'/><path d='M8 20h8M12 16v4'/>"),
  R(
    "smartphone",
    "<rect x='7' y='3' width='10' height='18'/><rect x='11' y='17' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "tablet",
    "<rect x='4' y='3' width='16' height='18'/><rect x='11' y='17' width='2' height='2' fill='black' stroke='none'/>",
  ),
  R(
    "headphones",
    "<path d='M4 14v-2a8 8 0 0116 0v2'/><rect x='4' y='14' width='4' height='6'/><rect x='16' y='14' width='4' height='6'/>",
  ),
  R(
    "music",
    "<path d='M9 18V5l11-2v13'/><rect x='5' y='16' width='4' height='4'/><rect x='16' y='14' width='4' height='4'/>",
  ),
  R(
    "calculator",
    "<rect x='5' y='3' width='14' height='18'/><path d='M8 7h8'/><rect x='8' y='11' width='2' height='2' fill='black' stroke='none'/><rect x='11' y='11' width='2' height='2' fill='black' stroke='none'/><rect x='14' y='11' width='2' height='2' fill='black' stroke='none'/><rect x='8' y='15' width='2' height='2' fill='black' stroke='none'/><rect x='11' y='15' width='2' height='2' fill='black' stroke='none'/><rect x='14' y='15' width='2' height='2' fill='black' stroke='none'/>",
  ),
  /* ---------- arrows ---------- */
  family(
    [rect(4, 4, 16, 16), poly([12, 17], [12, 7]), poly([8, 11], [12, 7], [16, 11])],
    ["arrow-up-square", "arrow-right-square", "arrow-down-square", "arrow-left-square"],
  ));
family(
  [circ(12, 12, 8), poly([12, 16], [12, 8]), poly([8.5, 11.5], [12, 8], [15.5, 11.5])],
  ["arrow-up-circle", "arrow-right-circle", "arrow-down-circle", "arrow-left-circle"],
);
family(
  [poly([6, 18], [18, 6]), poly([9, 6], [18, 6], [18, 15])],
  ["arrow-up-right", "arrow-down-right", "arrow-down-left", "arrow-up-left"],
);
family(
  [poly([6, 12], [12, 6], [18, 12]), poly([6, 19], [12, 13], [18, 19])],
  ["chevrons-up", "chevrons-right", "chevrons-down", "chevrons-left"],
);
family(
  [poly([5, 5], [19, 5]), poly([6, 16], [12, 10], [18, 16])],
  ["chevron-top", "chevron-last", "chevron-bottom", "chevron-first"],
);
const corner = [poly([20, 20], [20, 9], [5, 9]), poly([10, 4], [5, 9], [10, 14])];
A("corner-up-left", ...corner);
A("corner-up-right", ...flipx(corner));
A("corner-down-left", ...rot(flipx(corner), 2));
A("corner-down-right", ...rot(corner, 2));
const cl = [poly([20, 4], [9, 4], [9, 19]), poly([4, 14], [9, 19], [14, 14])];
A("corner-left-down", ...cl);
A("corner-right-down", ...flipx(cl));
A("corner-left-up", ...rot(flipx(cl), 2));
A("corner-right-up", ...rot(cl, 2));
A(
  "move",
  poly([12, 3], [12, 21]),
  poly([3, 12], [21, 12]),
  poly([9, 6], [12, 3], [15, 6]),
  poly([9, 18], [12, 21], [15, 18]),
  poly([6, 9], [3, 12], [6, 15]),
  poly([18, 9], [21, 12], [18, 15]),
);
A(
  "move-horizontal",
  poly([3, 12], [21, 12]),
  poly([6, 9], [3, 12], [6, 15]),
  poly([18, 9], [21, 12], [18, 15]),
);
A(
  "move-vertical",
  poly([12, 3], [12, 21]),
  poly([9, 6], [12, 3], [15, 6]),
  poly([9, 18], [12, 21], [15, 18]),
);
A(
  "expand",
  poly([4, 10], [4, 4], [10, 4]),
  poly([14, 4], [20, 4], [20, 10]),
  poly([20, 14], [20, 20], [14, 20]),
  poly([10, 20], [4, 20], [4, 14]),
);
A(
  "collapse",
  poly([4, 12], [20, 12]),
  poly([9, 5], [12, 8], [15, 5]),
  poly([9, 19], [12, 16], [15, 19]),
);
/* Rotation arrows share one construction: an r8 arc easing into a short run that ends in a square head. */
const ROT_CW = raw("M20 12a8 8 0 11-8-8 8.5 8.5 0 015.99 2.44L20 8M20 3v5h-5");
const ROT_CCW = raw("M4 12a8 8 0 108-8 8.5 8.5 0 00-5.99 2.44L4 8M4 3v5h5");
A("rotate-cw", ROT_CW);
A("rotate-ccw", ROT_CCW);
A(
  "repeat",
  poly([4, 10], [4, 7], [17, 7]),
  poly([14, 4], [17, 7], [14, 10]),
  poly([20, 14], [20, 17], [7, 17]),
  poly([10, 20], [7, 17], [10, 14]),
);
A(
  "shuffle",
  poly([4, 7], [8, 7], [16, 17], [20, 17]),
  poly([4, 17], [8, 17], [16, 7], [20, 7]),
  poly([17, 4], [20, 7], [17, 10]),
  poly([17, 14], [20, 17], [17, 20]),
);
const skip = [closed([19, 5], [8, 12], [19, 19]), poly([5, 5], [5, 19])];
A("skip-back", ...skip);
A("skip-forward", ...flipx(skip));
const rw = [closed([11, 5], [3, 12], [11, 19]), closed([21, 5], [13, 12], [21, 19])];
A("rewind", ...rw);
A("fast-forward", ...flipx(rw));
const rp = [poly([9, 7], [4, 12], [9, 17]), poly([4, 12], [14, 12], [20, 18])];
A("reply", ...rp);
A("forward", ...flipx(rp));
A("trending-down", poly([3, 7], [9, 13], [13, 9], [21, 17]), poly([15, 17], [21, 17], [21, 11]));
A(
  "sort-asc",
  poly([4, 6], [14, 6]),
  poly([4, 12], [11, 12]),
  poly([4, 18], [8, 18]),
  poly([18, 20], [18, 6]),
  poly([15, 9], [18, 6], [21, 9]),
);
A(
  "sort-desc",
  poly([4, 6], [8, 6]),
  poly([4, 12], [11, 12]),
  poly([4, 18], [14, 18]),
  poly([18, 4], [18, 18]),
  poly([15, 15], [18, 18], [21, 15]),
);
const ud = [
  poly([8, 20], [8, 4]),
  poly([4, 8], [8, 4], [12, 8]),
  poly([16, 4], [16, 20]),
  poly([12, 16], [16, 20], [20, 16]),
];
A("arrow-up-down", ...ud);
A("arrow-left-right", ...rot(ud, 1));
family(
  [closed([12, 3], [20, 11], [15, 11], [15, 21], [9, 21], [9, 11], [4, 11])],
  ["arrow-big-up", "arrow-big-right", "arrow-big-down", "arrow-big-left"],
);

/* ---------- shapes & marks ---------- */
A("square", rect(4, 4, 16, 16));
A("circle", circ(12, 12, 8));
A("triangle", closed([12, 4], [21, 20], [3, 20]));
A("diamond", closed([12, 3], [21, 12], [12, 21], [3, 12]));
A("hexagon", closed([12, 3], [20, 7.5], [20, 16.5], [12, 21], [4, 16.5], [4, 7.5]));
A(
  "octagon",
  closed([8.5, 3], [15.5, 3], [21, 8.5], [21, 15.5], [15.5, 21], [8.5, 21], [3, 15.5], [3, 8.5]),
);
A("check-square", rect(4, 4, 16, 16), poly([8, 12], [11, 15], [16, 9]));
A("x-square", rect(4, 4, 16, 16), poly([9, 9], [15, 15]), poly([15, 9], [9, 15]));
A("plus-square", rect(4, 4, 16, 16), poly([12, 8], [12, 16]), poly([8, 12], [16, 12]));
A("minus-square", rect(4, 4, 16, 16), poly([8, 12], [16, 12]));
A("check-circle", circ(12, 12, 8), poly([8, 12], [11, 15], [16, 9]));
A("x-circle", circ(12, 12, 8), poly([9, 9], [15, 15]), poly([15, 9], [9, 15]));
A("plus-circle", circ(12, 12, 8), poly([12, 8], [12, 16]), poly([8, 12], [16, 12]));
A("minus-circle", circ(12, 12, 8), poly([8, 12], [16, 12]));
A("alert-circle", circ(12, 12, 8), poly([12, 8], [12, 13]), dot(12, 16.5));
A("alert-square", rect(4, 4, 16, 16), poly([12, 8], [12, 13]), dot(12, 16.5));
A("ban", circ(12, 12, 8), poly([6.3, 6.3], [17.7, 17.7]));
A("power", arc(7.5, 7, 7.5, 16.5, 7, 1, 0), poly([12, 3], [12, 12]));
A(
  "plug",
  poly([9, 3], [9, 8]),
  poly([15, 3], [15, 8]),
  closed([6, 8], [18, 8], [18, 12], [12, 17], [6, 12]),
  poly([12, 17], [12, 21]),
);
A(
  "loader",
  poly([12, 3], [12, 7]),
  poly([12, 17], [12, 21]),
  poly([3, 12], [7, 12]),
  poly([17, 12], [21, 12]),
  poly([5.6, 5.6], [8.5, 8.5]),
  poly([15.5, 15.5], [18.4, 18.4]),
  poly([5.6, 18.4], [8.5, 15.5]),
  poly([15.5, 8.5], [18.4, 5.6]),
);
A("asterisk", poly([12, 4], [12, 20]), poly([5, 8], [19, 16]), poly([19, 8], [5, 16]));
A("radio-checked", circ(12, 12, 8), rect(9, 9, 6, 6));
A("toggle-left", rect(3, 7, 18, 10), rect(5.5, 9.5, 5, 5));
A("toggle-right", rect(3, 7, 18, 10), rect(13.5, 9.5, 5, 5));
A("square-dot", rect(4, 4, 16, 16), dot(12, 12));
A("circle-dot", circ(12, 12, 8), dot(12, 12));
A("equal", poly([5, 9], [19, 9]), poly([5, 15], [19, 15]));
A("divide", poly([5, 12], [19, 12]), dot(12, 6), dot(12, 18));
A("more-vertical", dot(12, 5), dot(12, 12), dot(12, 19));
A("grip", dot(9, 6), dot(15, 6), dot(9, 12), dot(15, 12), dot(9, 18), dot(15, 18));
A("circle-half", circ(12, 12, 8), poly([12, 4], [12, 20]));
A("square-half", rect(4, 4, 16, 16), poly([12, 4], [12, 20]));

/* ---------- text & editing ---------- */
A("strikethrough", poly([5, 12], [19, 12]), raw("M17 6h-7a3 3 0 000 6h4a3 3 0 010 6H7"));
A(
  "highlighter",
  closed([9, 11], [15, 5], [20, 10], [14, 16]),
  closed([9, 11], [14, 16], [11, 19], [6, 19], [5, 18]),
  poly([3, 21], [21, 21]),
);
A(
  "eraser",
  closed([3, 16], [13, 6], [20, 13], [14, 19], [6, 19]),
  poly([8, 11], [15, 18]),
  poly([14, 19], [21, 19]),
);
A(
  "indent",
  poly([10, 6], [21, 6]),
  poly([10, 12], [21, 12]),
  poly([10, 18], [21, 18]),
  poly([3, 9], [6, 12], [3, 15]),
);
A(
  "outdent",
  poly([10, 6], [21, 6]),
  poly([10, 12], [21, 12]),
  poly([10, 18], [21, 18]),
  poly([6, 9], [3, 12], [6, 15]),
);
A(
  "text-wrap",
  poly([4, 6], [20, 6]),
  raw("M4 12h13a3 3 0 010 6h-4"),
  poly([4, 18], [9, 18]),
  poly([15, 16], [13, 18], [15, 20]),
);
A(
  "text-cursor",
  poly([9, 4], [12, 6], [15, 4]),
  poly([12, 6], [12, 18]),
  poly([9, 20], [12, 18], [15, 20]),
);
A("heading", poly([5, 4], [5, 20]), poly([19, 4], [19, 20]), poly([5, 12], [19, 12]));
A(
  "align-justify",
  poly([4, 6], [20, 6]),
  poly([4, 10], [20, 10]),
  poly([4, 14], [20, 14]),
  poly([4, 18], [20, 18]),
);
A("align-top", poly([4, 4], [20, 4]), rect(6, 7, 4, 12), rect(14, 7, 4, 7));
A("align-middle", poly([4, 12], [20, 12]), rect(6, 6, 4, 12), rect(14, 8.5, 4, 7));
A("align-bottom", poly([4, 20], [20, 20]), rect(6, 5, 4, 12), rect(14, 10, 4, 7));
A("distribute-horizontal", poly([4, 3], [4, 21]), poly([20, 3], [20, 21]), rect(9, 8, 6, 8));
A("distribute-vertical", poly([3, 4], [21, 4]), poly([3, 20], [21, 20]), rect(8, 9, 8, 6));
A(
  "list-check",
  poly([11, 7], [20, 7]),
  poly([11, 12], [20, 12]),
  poly([11, 17], [20, 17]),
  poly([3, 7], [5, 9], [8, 5]),
  poly([3, 17], [5, 19], [8, 15]),
);
A(
  "list-plus",
  poly([4, 7], [14, 7]),
  poly([4, 12], [14, 12]),
  poly([4, 17], [10, 17]),
  poly([18, 14], [18, 20]),
  poly([15, 17], [21, 17]),
);
A(
  "list-x",
  poly([4, 7], [14, 7]),
  poly([4, 12], [14, 12]),
  poly([4, 17], [10, 17]),
  poly([15, 15], [20, 20]),
  poly([20, 15], [15, 20]),
);
A("pen", closed([4, 20], [5, 15], [16, 4], [20, 8], [9, 19]), poly([14, 6], [18, 10]));
A(
  "pencil",
  closed([3, 21], [4, 17], [15, 6], [18, 9], [7, 20]),
  poly([15, 6], [18, 3], [21, 6], [18, 9]),
);
A(
  "pen-tool",
  closed([12, 3], [18, 10], [16, 17], [8, 17], [6, 10]),
  poly([12, 3], [12, 9]),
  dot(12, 11.5),
  rect(8, 17, 8, 4),
);
A("crop", poly([6, 2], [6, 18], [22, 18]), poly([2, 6], [18, 6], [18, 22]));
A("pointer", closed([5, 3], [5, 19], [9.5, 14.5], [13, 21], [16, 19.5], [12.5, 13], [19, 12]));
A(
  "hand",
  /* Fingers 3.5 wide with r1.75 tips, gaps left open into the palm; the thumb leans out at 45°. */
  raw(
    "M10.5 11V6.25a1.75 1.75 0 00-3.5 0v8.25l-1.9-1.9a1.75 1.75 0 00-2.5 2.5l4.4 4.4A5.5 5.5 0 0010 21h5a5.5 5.5 0 005.5-5.5V9a1.5 1.5 0 00-3 0v2M10.5 11V4.25a1.75 1.75 0 013.5 0V11M14 11V5.75a1.75 1.75 0 013.5 0V11",
  ),
);
A(
  "pipette",
  closed([3, 21], [4, 17], [13, 8], [16, 11], [7, 20]),
  poly([13, 8], [17, 4], [20, 7], [16, 11]),
  poly([11, 6], [18, 13]),
);
A(
  "ruler",
  closed([3, 16], [16, 3], [21, 8], [8, 21]),
  poly([7, 12], [9, 14]),
  poly([10, 9], [12, 11]),
  poly([13, 6], [15, 8]),
);
A("scissors", circ(7, 7, 3), circ(7, 17, 3), poly([9, 9], [20, 20]), poly([9, 15], [20, 4]));

/* ---------- files & folders ---------- */
const FILE = [closed([6, 3], [14, 3], [18, 7], [18, 21], [6, 21]), poly([14, 3], [14, 7], [18, 7])];
A("file-text", ...FILE, poly([9, 12], [15, 12]), poly([9, 16], [15, 16]));
A("file-code", ...FILE, poly([10, 11], [8, 14], [10, 17]), poly([14, 11], [16, 14], [14, 17]));
A("file-image", ...FILE, poly([9, 18], [12, 14.5], [15, 18]), dot(14, 11));
A("file-plus", ...FILE, poly([12, 10], [12, 18]), poly([8, 14], [16, 14]));
A("file-minus", ...FILE, poly([8, 14], [16, 14]));
A("file-check", ...FILE, poly([9, 14], [11, 16], [15, 11]));
A("file-x", ...FILE, poly([9.5, 11.5], [14.5, 16.5]), poly([14.5, 11.5], [9.5, 16.5]));
A("file-search", ...FILE, circ(11.5, 13.5, 2.5), poly([13.5, 15.5], [16, 18]));
A("file-lock", ...FILE, rect(9, 13, 6, 5), raw("M10.5 13v-1.5a1.5 1.5 0 013 0V13"));
A(
  "files",
  closed([9, 3], [16, 3], [20, 7], [20, 17], [9, 17]),
  poly([16, 3], [16, 7], [20, 7]),
  poly([5, 8], [5, 21], [16, 21]),
);
A("file-audio", ...FILE, poly([10, 17], [10, 12], [15, 11], [15, 16]), dot(9, 17.5), dot(14, 16.5));
A("file-video", ...FILE, closed([9, 11], [9, 17], [14, 14]));
A(
  "file-spreadsheet",
  ...FILE,
  rect(8, 11, 8, 7),
  poly([8, 14.5], [16, 14.5]),
  poly([12, 11], [12, 18]),
);
A("file-archive", ...FILE, poly([9, 3], [9, 9]), dot(9, 11), dot(9, 14), rect(8, 16, 2, 3));
const FOLD = [closed([3, 6], [9, 6], [11, 8], [21, 8], [21, 19], [3, 19])];
A(
  "folder-open",
  poly([3, 19], [3, 6], [9, 6], [11, 8], [19, 8], [19, 11]),
  closed([3, 19], [6, 11], [22, 11], [19, 19]),
);
A("folder-plus", ...FOLD, poly([12, 11], [12, 17]), poly([9, 14], [15, 14]));
A("folder-minus", ...FOLD, poly([9, 14], [15, 14]));
A("folder-x", ...FOLD, poly([9.5, 11.5], [14.5, 16.5]), poly([14.5, 11.5], [9.5, 16.5]));
A("folder-check", ...FOLD, poly([9, 14], [11, 16], [15, 11.5]));
A("folder-lock", ...FOLD, rect(9.5, 13, 5, 4), raw("M10.75 13v-1a1.25 1.25 0 012.5 0v1"));
A("folder-search", ...FOLD, circ(11.5, 13.5, 2.5), poly([13.5, 15.5], [16, 18]));
A(
  "folders",
  closed([7, 3], [12, 3], [14, 5], [22, 5], [22, 15], [7, 15]),
  poly([2, 8], [2, 20], [17, 20]),
);
A("clipboard", rect(5, 5, 14, 16), rect(9, 3, 6, 4));
A("clipboard-check", rect(5, 5, 14, 16), rect(9, 3, 6, 4), poly([9, 14], [11, 16], [15, 11]));
A(
  "clipboard-copy",
  poly([10, 21], [5, 21], [5, 5], [19, 5], [19, 10]),
  rect(9, 3, 6, 4),
  rect(13, 13, 8, 8),
);
A(
  "clipboard-list",
  rect(5, 5, 14, 16),
  rect(9, 3, 6, 4),
  poly([11, 11], [16, 11]),
  poly([11, 15], [16, 15]),
  dot(8.5, 11),
  dot(8.5, 15),
);
A(
  "notebook",
  rect(6, 3, 13, 18),
  poly([9, 3], [9, 21]),
  poly([3, 7], [6, 7]),
  poly([3, 12], [6, 12]),
  poly([3, 17], [6, 17]),
);
A("book", raw("M5 19V4h14v17H7a2 2 0 010-4h12"));
A("book-open", raw("M12 7c-2-2-5-2-9-2v13c4 0 7 0 9 2 2-2 5-2 9-2V5c-4 0-7 0-9 2v13"));
A(
  "bookmarks",
  closed([6, 7], [16, 7], [16, 21], [11, 17], [6, 21]),
  poly([10, 3], [20, 3], [20, 18]),
);
A("library", rect(3, 4, 4, 16), rect(9, 4, 4, 16), closed([15, 5], [19, 4], [21, 19], [17, 20]));

/* ---------- users ---------- */
const BODY = raw("M3 20v-2a3 3 0 013-3h7");
A(
  "users",
  rect(5, 5, 6, 6),
  raw("M2 19v-1a3 3 0 013-3h6a3 3 0 013 3v1"),
  rect(15, 6, 5, 5),
  raw("M17 15h2a3 3 0 013 3v1"),
);
A("user-plus", rect(7, 4, 8, 8), BODY, poly([18, 14], [18, 20]), poly([15, 17], [21, 17]));
A("user-minus", rect(7, 4, 8, 8), BODY, poly([15, 17], [21, 17]));
A("user-check", rect(7, 4, 8, 8), BODY, poly([15, 17], [17, 19], [21, 15]));
A("user-x", rect(7, 4, 8, 8), BODY, poly([16, 15], [20, 19]), poly([20, 15], [16, 19]));
A("user-circle", circ(12, 12, 8), rect(9.5, 6.5, 5, 5), raw("M6.19 17.5a7 7 0 0111.62 0"));
A("user-square", rect(4, 4, 16, 16), rect(9.5, 7, 5, 5), raw("M7 20a5 5 0 0110 0"));
A(
  "contact",
  rect(3, 4, 18, 16),
  rect(7, 8, 4, 4),
  raw("M5 17a4 4 0 018 0"),
  poly([15, 9], [18, 9]),
  poly([15, 13], [18, 13]),
);
A(
  "id-card",
  rect(3, 5, 18, 14),
  rect(6, 8, 4, 4),
  raw("M5 16a3 3 0 016 0"),
  poly([13, 9], [18, 9]),
  poly([13, 13], [18, 13]),
);
A(
  "user-cog",
  rect(7, 4, 8, 8),
  raw("M3 20v-2a3 3 0 013-3h6"),
  circ(18, 18, 2.5),
  ...Array.from({ length: 8 }, (_, k) => {
    const [c, s] = [Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4)];
    return poly([18 + 2.5 * c, 18 + 2.5 * s], [18 + 4.25 * c, 18 + 4.25 * s]);
  }),
);

/* ---------- communication ---------- */
const BUBBLE = raw("M4 5h16v11H9l-5 4z");
A("message", BUBBLE);
A("message-square", closed([4, 4], [20, 4], [20, 16], [9, 16], [4, 21]));
A("messages", raw("M3 4h13v9H8l-5 3zM16 9h5v9l-4-2h-7v-3"));
A("message-plus", BUBBLE, poly([12, 8], [12, 13]), poly([9.5, 10.5], [14.5, 10.5]));
A("chat-dots", BUBBLE, dot(8.5, 10.5), dot(12, 10.5), dot(15.5, 10.5));
const PH = raw("M5 4h4l2 5-3 2a10 10 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z");
A("phone-off", PH, poly([4, 4], [20, 20]));
A("phone-call", PH, raw("M15 5a4 4 0 014 4M15 2a7 7 0 017 7"));
A("phone-incoming", PH, poly([21, 3], [15, 9]), poly([15, 4], [15, 9], [20, 9]));
A("phone-outgoing", PH, poly([15, 9], [21, 3]), poly([16, 3], [21, 3], [21, 8]));
A("voicemail", circ(6, 13, 3.5), circ(18, 13, 3.5), poly([6, 16.5], [18, 16.5]));
A("rss", raw("M4 11a9 9 0 019 9M4 5a15 15 0 0115 15"), dot(5.5, 18.5));
A(
  "megaphone",
  closed([3, 10], [3, 14], [7, 14], [18, 19], [18, 5], [7, 10]),
  poly([7, 14], [8, 20], [11, 20], [10, 15]),
);
A(
  "mail-open",
  closed([3, 9], [12, 3], [21, 9], [21, 20], [3, 20]),
  poly([3, 9], [12, 15], [21, 9]),
);
/* Badged envelope: the outline opens where the badge sits, as on user-plus. */
const MAIL = [
  poly([13, 18], [3, 18], [3, 6], [21, 6], [21, 11.5]),
  poly([3, 7], [12, 13], [21, 7]),
];
A("mail-plus", ...MAIL, poly([18, 14], [18, 20]), poly([15, 17], [21, 17]));
A("mail-check", ...MAIL, poly([15, 17], [17, 19], [21, 15]));
A("mail-x", ...MAIL, poly([16, 15], [20, 19]), poly([20, 15], [16, 19]));
A("mails", rect(3, 8, 14, 10), poly([3, 9], [10, 14], [17, 9]), poly([7, 5], [21, 5], [21, 14]));
const BELL = raw("M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 20h4");
A("bell-ring", BELL, raw("M3 8a9 9 0 013-5M21 8a9 9 0 00-3-5"));
A("bell-plus", BELL, poly([12, 8], [12, 13]), poly([9.5, 10.5], [14.5, 10.5]));

/* ---------- commerce ---------- */
A("bag", closed([5, 8], [19, 8], [20, 21], [4, 21]), raw("M9 8V6a3 3 0 016 0v2"));
A("wallet", rect(3, 6, 18, 13), poly([3, 10], [21, 10]), rect(15, 13, 4, 3));
A(
  "receipt",
  closed([5, 3], [19, 3], [19, 21], [16, 19], [13, 21], [10, 19], [7, 21], [5, 19]),
  poly([9, 8], [15, 8]),
  poly([9, 12], [15, 12]),
  poly([9, 16], [13, 16]),
);
A("ticket", raw("M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z"), poly([9, 7], [9, 17]));
A(
  "barcode",
  poly([4, 5], [4, 19]),
  poly([7, 5], [7, 19]),
  poly([10, 5], [10, 15]),
  poly([13, 5], [13, 19]),
  poly([16, 5], [16, 15]),
  poly([20, 5], [20, 19]),
  poly([10, 17], [10, 19]),
  poly([16, 17], [16, 19]),
);
A(
  "qr-code",
  rect(3, 3, 7, 7),
  rect(14, 3, 7, 7),
  rect(3, 14, 7, 7),
  dot(6.5, 6.5),
  dot(17.5, 6.5),
  dot(6.5, 17.5),
  poly([14, 14], [17, 14], [17, 17]),
  poly([21, 14], [21, 21], [14, 21], [14, 19]),
  dot(19, 19),
);
A("coins", circ(9, 9, 6), raw("M14 9.5a6 6 0 11-4.5 7.5M9 6v6M7 8h3a1 1 0 010 2H8a1 1 0 000 2h3"));
A("banknote", rect(3, 6, 18, 12), circ(12, 12, 2.5), dot(6.5, 9.5), dot(17.5, 14.5));
A("dollar", poly([12, 3], [12, 21]), raw("M17 6h-7a3 3 0 000 6h4a3 3 0 010 6H7"));
A("euro", raw("M18 6a7 7 0 100 12"), poly([4, 10], [14, 10]), poly([4, 14], [14, 14]));
A(
  "scale",
  poly([12, 3], [12, 21]),
  poly([6, 21], [18, 21]),
  poly([4, 7], [20, 7]),
  raw("M3 15a3 3 0 006 0L6 7zM15 15a3 3 0 006 0L18 7z"),
);
A(
  "shopping-basket",
  closed([3, 10], [21, 10], [19, 20], [5, 20]),
  poly([8, 10], [12, 4], [16, 10]),
  poly([10, 14], [10, 17]),
  poly([14, 14], [14, 17]),
);

/* ---------- time ---------- */
A(
  "alarm",
  circ(12, 13, 7),
  poly([12, 9], [12, 13], [15, 15]),
  poly([5, 4], [2, 7]),
  poly([19, 4], [22, 7]),
);
A(
  "timer",
  circ(12, 14, 7),
  poly([12, 10], [12, 14]),
  poly([10, 3], [14, 3]),
  poly([12, 3], [12, 7]),
);
A(
  "hourglass",
  closed([6, 3], [18, 3], [18, 7], [12, 12], [6, 7]),
  closed([6, 21], [18, 21], [18, 17], [12, 12], [6, 17]),
);
A("history", ROT_CCW, poly([12, 8], [12, 12], [15, 14]));
const CAL = [
  rect(4, 6, 16, 14),
  poly([4, 10], [20, 10]),
  poly([8, 4], [8, 8]),
  poly([16, 4], [16, 8]),
];
A("calendar-plus", ...CAL, poly([12, 12], [12, 18]), poly([9, 15], [15, 15]));
A("calendar-minus", ...CAL, poly([9, 15], [15, 15]));
A("calendar-check", ...CAL, poly([9, 15], [11, 17], [15, 13]));
A("calendar-x", ...CAL, poly([9.5, 12.5], [14.5, 17.5]), poly([14.5, 12.5], [9.5, 17.5]));
A("calendar-days", ...CAL, dot(8, 13), dot(12, 13), dot(16, 13), dot(8, 17), dot(12, 17));
A(
  "calendar-clock",
  poly([20, 10], [20, 6], [4, 6], [4, 20], [11, 20]),
  poly([4, 10], [20, 10]),
  poly([8, 4], [8, 8]),
  poly([16, 4], [16, 8]),
  circ(17, 17, 4),
  poly([17, 15], [17, 17], [18.5, 18]),
);
A(
  "watch",
  circ(12, 12, 6),
  poly([12, 9], [12, 12], [14, 13]),
  poly([9, 6], [9.5, 3], [14.5, 3], [15, 6]),
  poly([9, 18], [9.5, 21], [14.5, 21], [15, 18]),
);
A(
  "sunrise",
  raw("M6 16a6 6 0 0112 0"),
  poly([3, 16], [21, 16]),
  poly([3, 20], [21, 20]),
  poly([12, 3], [12, 8]),
  poly([9, 6], [12, 3], [15, 6]),
  poly([4, 10], [5.5, 11.5]),
  poly([20, 10], [18.5, 11.5]),
);
A(
  "sunset",
  raw("M6 16a6 6 0 0112 0"),
  poly([3, 16], [21, 16]),
  poly([3, 20], [21, 20]),
  poly([12, 8], [12, 3]),
  poly([9, 5], [12, 8], [15, 5]),
  poly([4, 10], [5.5, 11.5]),
  poly([20, 10], [18.5, 11.5]),
);

/* ---------- weather & nature ---------- */
const CL = raw("M7 16a4 4 0 010-8 5 5 0 019.6-1.5A3.5 3.5 0 0117 16z");
A("cloud-rain", CL, poly([8, 19], [7, 22]), poly([12, 19], [11, 22]), poly([16, 19], [15, 22]));
A("cloud-snow", CL, dot(8, 20), dot(12, 20), dot(16, 20));
A("cloud-lightning", CL, poly([13, 15], [10, 19], [13, 19], [11, 23]));
A(
  "cloud-sun",
  raw("M9 18a4 4 0 010-8 5 5 0 019.6-1.5A3.5 3.5 0 0119 18z"),
  raw("M5 10a4 4 0 014-6M4 4l1 1M9 2v1.5M2 9h1.5"),
);
A("cloud-off", CL, poly([3, 3], [21, 21]));
A("cloud-upload", CL, poly([12, 22], [12, 13]), poly([9, 16], [12, 13], [15, 16]));
A("cloud-download", CL, poly([12, 13], [12, 22]), poly([9, 19], [12, 22], [15, 19]));
A(
  "wind",
  raw("M3 8h11a2.5 2.5 0 10-2.5-2.5M3 12h16a2.5 2.5 0 11-2.5 2.5M3 16h8a2.5 2.5 0 11-2.5 2.5"),
);
A(
  "umbrella",
  raw("M3 12a9 9 0 0118 0z"),
  poly([12, 12], [12, 19]),
  raw("M12 19a2 2 0 004 0"),
  poly([12, 3], [12, 4]),
);
A("thermometer", raw("M10 14V5a2 2 0 014 0v9a4 4 0 11-4 0z"), poly([12, 10], [12, 16]));
A(
  "snowflake",
  poly([12, 2], [12, 22]),
  poly([3.3, 7], [20.7, 17]),
  poly([20.7, 7], [3.3, 17]),
  poly([9, 4], [12, 6], [15, 4]),
  poly([9, 20], [12, 18], [15, 20]),
);
A("leaf", raw("M4 20C4 10 10 4 20 4c0 10-6 16-16 16zM4 20l8-8"));
A(
  "tree",
  closed([12, 3], [18, 11], [15, 11], [20, 17], [4, 17], [9, 11], [6, 11]),
  poly([12, 17], [12, 21]),
);
A("mountain", closed([3, 20], [10, 7], [14, 13], [17, 9], [21, 20]));
A("waves", raw("M3 9c3 0 3 2 6 2s3-2 6-2 3 2 6 2M3 15c3 0 3 2 6 2s3-2 6-2 3 2 6 2"));
A(
  "bug",
  rect(8, 8, 8, 10),
  raw("M9 8a3 3 0 016 0"),
  poly([12, 8], [12, 18]),
  poly([4, 11], [8, 12]),
  poly([20, 11], [16, 12]),
  poly([4, 18], [8, 15]),
  poly([20, 18], [16, 15]),
  poly([9, 5], [7, 3]),
  poly([15, 5], [17, 3]),
);

/* ---------- transport & places ---------- */
A("car", raw("M4 15l2-6h12l2 6v4h-2v-2H6v2H4z"), rect(6, 12, 3, 2), rect(15, 12, 3, 2));
A(
  "bus",
  rect(4, 4, 16, 13),
  poly([4, 10], [20, 10]),
  rect(6, 13, 2, 2),
  rect(16, 13, 2, 2),
  poly([7, 17], [7, 20]),
  poly([17, 17], [17, 20]),
);
A(
  "bike",
  circ(6, 16, 4),
  circ(18, 16, 4),
  poly([6, 16], [10, 8], [15, 8], [18, 16]),
  poly([10, 8], [12, 16], [15, 8]),
  poly([13, 5], [15, 8]),
);
A(
  "plane",
  closed(
    [2, 13],
    [10, 13],
    [14, 4],
    [17, 4],
    [14, 13],
    [20, 13],
    [22, 15],
    [14, 16],
    [12, 21],
    [9, 21],
    [10, 16],
    [5, 16],
    [3, 18],
  ),
);
A(
  "train",
  rect(5, 3, 14, 15),
  poly([5, 9], [19, 9]),
  rect(8, 12, 2, 2),
  rect(14, 12, 2, 2),
  poly([8, 18], [6, 21]),
  poly([16, 18], [18, 21]),
);
A(
  "ship",
  closed([3, 14], [21, 14], [18, 20], [6, 20]),
  poly([5, 14], [5, 9], [19, 9], [19, 14]),
  poly([12, 4], [12, 9]),
  poly([9, 9], [9, 6], [15, 6], [15, 9]),
);
A(
  "truck",
  rect(2, 6, 12, 10),
  poly([14, 10], [19, 10], [22, 13], [22, 16], [14, 16]),
  rect(5, 16, 3, 3),
  rect(16, 16, 3, 3),
);
A(
  "building",
  rect(5, 3, 14, 18),
  dot(9, 7),
  dot(15, 7),
  dot(9, 12),
  dot(15, 12),
  rect(10, 16, 4, 5),
);
A(
  "store",
  /* The walls start on the outer scallops (r3 about x 6 and 18). */
  poly([4, 10 + Math.sqrt(5)], [4, 20], [20, 20], [20, 10 + Math.sqrt(5)]),
  raw("M3 10l2-6h14l2 6a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0z"),
  rect(9, 14, 6, 6),
);
A(
  "factory",
  closed([3, 20], [3, 9], [8, 12], [8, 9], [13, 12], [13, 9], [18, 12], [18, 4], [21, 4], [21, 20]),
);
A(
  "bank",
  closed([3, 9], [12, 3], [21, 9]),
  rect(5, 9, 14, 8),
  poly([3, 20], [21, 20]),
  poly([9, 9], [9, 17]),
  poly([15, 9], [15, 17]),
);
A("hospital", rect(3, 3, 18, 18), poly([12, 8], [12, 16]), poly([8, 12], [16, 12]));
A("tent", closed([2, 20], [12, 4], [22, 20]), poly([12, 20], [12, 12], [8, 20]));
A(
  "map-pinned",
  raw("M12 17s-5-5-5-9a5 5 0 0110 0c0 4-5 9-5 9z"),
  rect(10, 6, 4, 4),
  poly([5, 17], [3, 21], [21, 21], [19, 17]),
);

/* ---------- devices ---------- */
A("laptop", rect(4, 5, 16, 11), poly([2, 19], [22, 19]));
A("tv", rect(3, 6, 18, 12), poly([8, 21], [16, 21]), poly([8, 3], [12, 6], [16, 3]));
A("speaker", rect(6, 3, 12, 18), circ(12, 15, 3), dot(12, 7));
A(
  "gamepad",
  raw("M6 8h12a4 4 0 014 4v3a3 3 0 01-5 2l-2-2H9l-2 2a3 3 0 01-5-2v-3a4 4 0 014-4z"),
  poly([8, 11], [8, 15]),
  poly([6, 13], [10, 13]),
  dot(15, 12),
  dot(18, 14),
);
A(
  "keyboard",
  rect(2, 6, 20, 12),
  dot(6, 10),
  dot(10, 10),
  dot(14, 10),
  dot(18, 10),
  dot(6, 14),
  dot(18, 14),
  poly([9, 14], [15, 14]),
);
A("mouse", raw("M7 9a5 5 0 0110 0v6a5 5 0 01-10 0z"), poly([12, 7], [12, 11]));
A(
  "usb",
  poly([12, 3], [12, 21]),
  poly([10, 6], [12, 3], [14, 6]),
  poly([12, 15], [7, 12], [7, 9]),
  poly([12, 17], [17, 14], [17, 11]),
  rect(6, 8, 2, 2),
  dot(17, 10),
  rect(10, 19, 4, 2),
);
A("hard-drive", rect(3, 5, 18, 14), poly([3, 13], [21, 13]), dot(7, 17), poly([11, 17], [17, 17]));
A(
  "server",
  rect(3, 3, 18, 7),
  rect(3, 14, 18, 7),
  dot(7, 6.5),
  dot(7, 17.5),
  poly([12, 6.5], [17, 6.5]),
  poly([12, 17.5], [17, 17.5]),
);
A(
  "router",
  rect(3, 13, 18, 7),
  dot(7, 16.5),
  dot(11, 16.5),
  poly([17, 13], [17, 8]),
  raw("M14 6a4 4 0 016 0M12 3a7 7 0 0110 0"),
);
A(
  "sd-card",
  closed([6, 3], [18, 3], [18, 21], [6, 21], [6, 9]),
  poly([9, 5], [9, 9]),
  poly([12, 5], [12, 9]),
  poly([15, 5], [15, 9]),
);
A(
  "battery-low",
  rect(3, 8, 16, 8),
  poly([19, 10], [21, 10], [21, 14], [19, 14]),
  rect(5, 10, 3, 4),
);
A(
  "battery-charging",
  rect(3, 8, 16, 8),
  poly([19, 10], [21, 10], [21, 14], [19, 14]),
  poly([12, 9], [9, 12.5], [12, 12.5], [10, 15]),
);
A(
  "signal",
  poly([4, 20], [4, 17]),
  poly([8, 20], [8, 14]),
  poly([12, 20], [12, 11]),
  poly([16, 20], [16, 8]),
  poly([20, 20], [20, 4]),
);
A(
  "airplay",
  raw("M5 16a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2"),
  closed([12, 14], [17, 21], [7, 21]),
);
A(
  "cast",
  poly([3, 8], [3, 4], [21, 4], [21, 20], [15, 20]),
  raw("M3 11a9 9 0 019 9M3 15a5 5 0 015 5"),
  dot(4, 19),
);
A("webcam", circ(12, 10, 6), circ(12, 10, 2), poly([12, 16], [12, 20]), poly([7, 21], [17, 21]));

/* ---------- dev ---------- */
A(
  "git-branch",
  circ(6, 5, 2.5),
  circ(6, 19, 2.5),
  circ(18, 8, 2.5),
  poly([6, 7.5], [6, 16.5]),
  raw("M18 10.5v1a7.5 7.5 0 01-7.5 7.5h-2"),
);
A("git-commit", circ(12, 12, 4), poly([3, 12], [8, 12]), poly([16, 12], [21, 12]));
A(
  "git-merge",
  circ(6, 5, 2.5),
  circ(6, 19, 2.5),
  circ(18, 13, 2.5),
  poly([6, 7.5], [6, 16.5]),
  raw("M6 7.5a5.5 5.5 0 005.5 5.5h4"),
);
A(
  "git-pull-request",
  circ(6, 5, 2.5),
  circ(6, 19, 2.5),
  circ(18, 19, 2.5),
  poly([6, 7.5], [6, 16.5]),
  poly([18, 16.5], [18, 7], [11, 7]),
  poly([14, 4], [11, 7], [14, 10]),
);
A(
  "git-fork",
  circ(6, 5, 2.5),
  circ(18, 5, 2.5),
  circ(12, 19, 2.5),
  raw("M6 7.5a6 6 0 006 6 6 6 0 006-6M12 13.5v3"),
);
A(
  "binary",
  rect(5, 3, 5, 7),
  rect(14, 14, 5, 7),
  poly([15, 3], [17, 3], [17, 10]),
  poly([14, 10], [20, 10]),
  poly([6, 14], [8, 14], [8, 21]),
  poly([5, 21], [11, 21]),
);
A(
  "braces",
  raw(
    "M8 3a3 3 0 00-3 3v4a2 2 0 01-2 2 2 2 0 012 2v4a3 3 0 003 3M16 3a3 3 0 013 3v4a2 2 0 002 2 2 2 0 00-2 2v4a3 3 0 01-3 3",
  ),
);
A("brackets", poly([9, 3], [5, 3], [5, 21], [9, 21]), poly([15, 3], [19, 3], [19, 21], [15, 21]));
A(
  "variable",
  raw("M6 4a14 14 0 000 16M18 4a14 14 0 010 16"),
  poly([8, 9], [16, 15]),
  poly([16, 9], [8, 15]),
);
A("function", raw("M17 4a3 3 0 00-5 2v12a3 3 0 01-5 2M8 12h8"));
A(
  "bot",
  rect(4, 8, 16, 12),
  poly([12, 4], [12, 8]),
  dot(12, 3),
  dot(9, 13),
  dot(15, 13),
  poly([9, 17], [15, 17]),
  poly([2, 12], [4, 12]),
  poly([20, 12], [22, 12]),
);
A(
  "command",
  raw(
    "M15 9V6a3 3 0 113 3h-3zM9 9V6a3 3 0 10-3 3h3zM15 15v3a3 3 0 103-3h-3zM9 15v3a3 3 0 11-3-3h3z",
  ),
  rect(9, 9, 6, 6),
);
A("option", poly([3, 6], [8, 6], [16, 18], [21, 18]), poly([14, 6], [21, 6]));
A("shift", closed([12, 3], [21, 12], [16, 12], [16, 20], [8, 20], [8, 12], [3, 12]));
A("control", poly([6, 15], [12, 9], [18, 15]));
A(
  "delete-key",
  closed([8, 5], [21, 5], [21, 19], [8, 19], [2, 12]),
  poly([12, 9], [18, 15]),
  poly([18, 9], [12, 15]),
);
A("enter", poly([20, 4], [20, 12], [6, 12]), poly([10, 8], [6, 12], [10, 16]));
A("tab-key", poly([4, 12], [18, 12]), poly([14, 8], [18, 12], [14, 16]), poly([21, 6], [21, 18]));
A(
  "code-square",
  rect(4, 4, 16, 16),
  poly([10, 9], [7, 12], [10, 15]),
  poly([14, 9], [17, 12], [14, 15]),
);
/* Three rings on an equilateral triangle; each tail runs through the next ring's gap. */
const turn = (shapes: Shape[], deg: number, cx: number, cy: number) => {
  const a = (deg * Math.PI) / 180;
  return map(shapes, (x, y) => [
    cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a),
    cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a),
  ]);
};
const HOOK = (() => {
  const [gx, gy, d, r] = [12, 13.4, 6.5, 3.25];
  const at = (deg: number, rad: number, ox = gx, oy = gy): Pt => [
    ox + rad * Math.cos((deg * Math.PI) / 180),
    oy + rad * Math.sin((deg * Math.PI) / 180),
  ];
  const [lx, ly] = at(150, d);
  const [rx, ry] = at(30, d);
  const [sx, sy] = at(-120, r, lx, ly);
  return [arc(sx, sy, r, lx + r, ly, 1, 0), poly([lx + r, ly], [rx, ry])];
})();
A("webhook", ...HOOK, ...turn(HOOK, 120, 12, 13.4), ...turn(HOOK, 240, 12, 13.4));
A(
  "api",
  rect(3, 9, 6, 6),
  rect(15, 9, 6, 6),
  poly([9, 12], [15, 12]),
  poly([6, 3], [6, 9]),
  poly([18, 15], [18, 21]),
);
A(
  "package-check",
  closed([12, 3], [20, 7], [20, 17], [12, 21], [4, 17], [4, 7]),
  poly([4, 7], [12, 11], [20, 7]),
  poly([12, 11], [12, 21]),
  poly([14, 15], [15.5, 16.5], [18, 13.5]),
);
A("workflow", rect(3, 3, 7, 7), rect(14, 14, 7, 7), raw("M10 6.5h4a2 2 0 012 2V14"));
A(
  "network",
  rect(9, 3, 6, 5),
  rect(3, 16, 6, 5),
  rect(15, 16, 6, 5),
  poly([12, 8], [12, 12], [6, 12], [6, 16]),
  poly([12, 12], [18, 12], [18, 16]),
);
const DIAMOND = (cx: number, cy: number) =>
  closed([cx, cy - 3], [cx + 3, cy], [cx, cy + 3], [cx - 3, cy]);
A("component", DIAMOND(12, 6), DIAMOND(6, 12), DIAMOND(18, 12), DIAMOND(12, 18));
A(
  "blocks",
  closed([3, 7], [10, 7], [10, 14], [17, 14], [17, 21], [3, 21]),
  poly([3, 14], [10, 14], [10, 21]),
  rect(14, 3, 7, 7),
);

/* ---------- security & health ---------- */
const SH = raw("M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z");
A("shield-check", SH, poly([8.5, 12], [11, 14.5], [16, 9.5]));
A("shield-off", SH, poly([4, 4], [20, 20]));
A("shield-alert", SH, poly([12, 8], [12, 12.5]), dot(12, 15.5));
A("shield-plus", SH, poly([12, 8], [12, 16]), poly([8, 12], [16, 12]));
A("shield-x", SH, poly([9, 9], [15, 15]), poly([15, 9], [9, 15]));
A("fingerprint", raw("M4 16v-5a8 8 0 0116 0v3M8 20v-9a4 4 0 018 0v7M12 11v10"));
A(
  "scan",
  poly([3, 8], [3, 3], [8, 3]),
  poly([16, 3], [21, 3], [21, 8]),
  poly([21, 16], [21, 21], [16, 21]),
  poly([8, 21], [3, 21], [3, 16]),
);
A(
  "scan-line",
  poly([3, 8], [3, 3], [8, 3]),
  poly([16, 3], [21, 3], [21, 8]),
  poly([21, 16], [21, 21], [16, 21]),
  poly([8, 21], [3, 21], [3, 16]),
  poly([7, 12], [17, 12]),
);
A(
  "heart-pulse",
  raw("M12 20s-7-4.6-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.4-7 10-7 10z"),
  poly([5, 12], [9, 12], [11, 9], [13, 15], [15, 12], [19, 12]),
);
A(
  "cross",
  closed(
    [9, 3],
    [15, 3],
    [15, 9],
    [21, 9],
    [21, 15],
    [15, 15],
    [15, 21],
    [9, 21],
    [9, 15],
    [3, 15],
    [3, 9],
    [9, 9],
  ),
);
A(
  "bandage",
  closed([3, 9], [9, 3], [21, 15], [15, 21]),
  dot(10, 10),
  dot(14, 14),
  dot(10, 14),
  dot(14, 10),
);
A("pill", raw("M4.5 13.5l9-9a4.95 4.95 0 017 7l-9 9a4.95 4.95 0 01-7-7z"), poly([9, 9], [16, 16]));
A("stethoscope", raw("M4 3h1M13 3h1M4 3v5a5 5 0 0010 0V3M9 13v3a5 5 0 0010 0v-3"), circ(19, 11, 2));
A(
  "syringe",
  closed([7.6, 13.6], [13.6, 7.6], [16.4, 10.4], [10.4, 16.4]),
  poly([12.5, 6.5], [17.5, 11.5]),
  poly([15, 9], [19, 5]),
  poly([17.5, 3.5], [20.5, 6.5]),
  poly([9, 15], [4, 20]),
);
A("lock-open", rect(6, 11, 12, 9), raw("M9 11V8a3 3 0 016 0"));
A(
  "key-square",
  rect(4, 4, 16, 16),
  circ(9.5, 14.5, 2.5),
  poly([11.3, 12.7], [16, 8]),
  poly([14.5, 9.5], [16, 11]),
);

/* ---------- objects & layout ---------- */
A("bulb", raw("M10 21h4M8 14a6 6 0 118 0c-1 1-1.5 2-1.5 4h-5c0-2-.5-3-1.5-4z"));
A("puzzle", raw("M4 6h4.5a2.5 2.5 0 015 0H18v4.5a2.5 2.5 0 010 5V20H4z"));
A(
  "trophy",
  raw("M8 4h8v6a4 4 0 01-8 0zM8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3"),
  poly([12, 14], [12, 18]),
  poly([8, 21], [16, 21]),
  poly([9, 18], [15, 18]),
);
A(
  "medal",
  circ(12, 15, 5),
  poly([8, 10], [5, 3], [10, 3], [12, 8], [14, 3], [19, 3], [16, 10]),
  dot(12, 15),
);
A("crown", closed([3, 8], [8, 12], [12, 5], [16, 12], [21, 8], [19, 18], [5, 18]));
A("ghost", raw("M5 21V12a7 7 0 0114 0v9l-2.5-2-2.5 2-2-2-2 2-2.5-2z"), dot(9.5, 11), dot(14.5, 11));
A(
  "dice",
  rect(4, 4, 16, 16),
  dot(8.5, 8.5),
  dot(15.5, 8.5),
  dot(12, 12),
  dot(8.5, 15.5),
  dot(15.5, 15.5),
);
A(
  "gem",
  closed([7, 3], [17, 3], [21, 9], [12, 21], [3, 9]),
  poly([3, 9], [21, 9]),
  poly([7, 3], [12, 21], [17, 3]),
);
A(
  "glasses",
  circ(7, 14, 4),
  circ(17, 14, 4),
  poly([11, 14], [13, 14]),
  poly([3, 14], [5, 7]),
  poly([21, 14], [19, 7]),
);
A(
  "graduation",
  closed([2, 9], [12, 4], [22, 9], [12, 14]),
  poly([6, 11], [6, 16], [12, 19], [18, 16], [18, 11]),
  poly([22, 9], [22, 15]),
);
A(
  "hammer",
  poly([3, 20], [13, 10]),
  closed([11, 6], [15, 2], [21, 8], [17, 12]),
  poly([9, 8], [15, 14]),
);
A(
  "lamp",
  closed([8, 3], [16, 3], [19, 12], [5, 12]),
  poly([12, 12], [12, 19]),
  poly([7, 21], [17, 21]),
);
A(
  "paint-bucket",
  closed([5, 11], [12, 4], [19, 11], [12, 18]),
  poly([5, 11], [19, 11]),
  raw("M19 13s2 2 2 4a2 2 0 01-4 0c0-2 2-4 2-4z"),
  poly([12, 4], [10, 2]),
);
A(
  "sparkles",
  closed([12, 3], [14, 10], [21, 12], [14, 14], [12, 21], [10, 14], [3, 12], [10, 10]),
  poly([19, 3], [19, 7]),
  poly([17, 5], [21, 5]),
  poly([5, 17], [5, 21]),
  poly([3, 19], [7, 19]),
);
A(
  "wand",
  poly([3, 21], [15, 9]),
  poly([14, 6], [18, 10]),
  poly([16, 3], [16, 5]),
  poly([20, 7], [22, 7]),
  poly([19, 3], [21, 5]),
  poly([10, 4], [11, 6]),
);
A(
  "binoculars",
  rect(3, 11, 7, 9),
  rect(14, 11, 7, 9),
  rect(10, 13, 4, 4),
  poly([5, 11], [6, 4], [8, 4], [9, 11]),
  poly([15, 11], [16, 4], [18, 4], [19, 11]),
);
A(
  "flask",
  poly([9, 3], [15, 3]),
  poly([10, 3], [10, 9], [4, 20], [20, 20], [14, 9], [14, 3]),
  poly([6, 16], [18, 16]),
);
A("utensils", poly([7, 3], [7, 21]), raw("M4 3v5a3 3 0 006 0V3M17 3c-2 2-3 5-3 8h3v10M17 3v8"));
A(
  "telescope",
  closed([3, 13], [17, 6], [19, 10], [5, 17]),
  poly([17, 6], [20, 4], [22, 8], [19, 10]),
  poly([10, 15], [7, 21]),
  poly([12, 14], [15, 21]),
);
A(
  "toolbox",
  rect(3, 9, 18, 11),
  poly([3, 14], [21, 14]),
  poly([8, 9], [8, 5], [16, 5], [16, 9]),
  rect(10, 13, 4, 2),
);
A(
  "swatch-book",
  rect(4, 3, 7, 18),
  poly([7.5, 21], [21, 7.5], [16, 2.5], [11, 7.5]),
  raw("M7.5 21H21v-7l-6 6"),
  dot(7.5, 17),
);
A("layout-dashboard", rect(4, 4, 6, 8), rect(14, 4, 6, 4), rect(14, 12, 6, 8), rect(4, 16, 6, 4));
A(
  "layout-list",
  rect(4, 4, 6, 6),
  rect(4, 14, 6, 6),
  poly([13, 5.5], [20, 5.5]),
  poly([13, 8.5], [20, 8.5]),
  poly([13, 15.5], [20, 15.5]),
  poly([13, 18.5], [20, 18.5]),
);
const PANEL = rect(4, 4, 16, 16);
A("panel-left", PANEL, poly([9, 4], [9, 20]));
A("panel-right", PANEL, poly([15, 4], [15, 20]));
A("panel-top", PANEL, poly([4, 9], [20, 9]));
A("panel-bottom", PANEL, poly([4, 15], [20, 15]));
A("sidebar-close", PANEL, poly([9, 4], [9, 20]), poly([16, 9], [13, 12], [16, 15]));
A("sidebar-open", PANEL, poly([9, 4], [9, 20]), poly([13, 9], [16, 12], [13, 15]));
A(
  "split-horizontal",
  PANEL,
  poly([12, 4], [12, 20]),
  poly([9, 10], [7, 12], [9, 14]),
  poly([15, 10], [17, 12], [15, 14]),
);
A(
  "split-vertical",
  PANEL,
  poly([4, 12], [20, 12]),
  poly([10, 9], [12, 7], [14, 9]),
  poly([10, 15], [12, 17], [14, 15]),
);
A(
  "fullscreen",
  poly([3, 9], [3, 3], [9, 3]),
  poly([15, 3], [21, 3], [21, 9]),
  poly([21, 15], [21, 21], [15, 21]),
  poly([9, 21], [3, 21], [3, 15]),
  rect(8, 8, 8, 8),
);
A("picture-in-picture", raw("M21 11V5H3v14h8"), rect(13, 13, 8, 6));
A(
  "image-plus",
  poly([13, 4], [4, 4], [4, 20], [20, 20], [20, 11]),
  poly([4, 16], [9, 11], [13, 15], [16, 12], [20, 16]),
  poly([18, 3], [18, 9]),
  poly([15, 6], [21, 6]),
);
A(
  "images",
  rect(7, 3, 14, 14),
  poly([7, 13], [11, 9], [14, 12], [16, 10], [21, 15]),
  dot(17, 7),
  poly([3, 8], [3, 21], [16, 21]),
);
A(
  "film",
  rect(4, 4, 16, 16),
  poly([8, 4], [8, 20]),
  poly([16, 4], [16, 20]),
  poly([4, 9], [8, 9]),
  poly([4, 15], [8, 15]),
  poly([16, 9], [20, 9]),
  poly([16, 15], [20, 15]),
);
A(
  "aperture",
  circ(12, 12, 9),
  poly([12, 3], [15.5, 12]),
  poly([19.8, 7.5], [10.5, 9.5]),
  poly([19.8, 16.5], [10.5, 14.5]),
  poly([12, 21], [8.5, 12]),
  poly([4.2, 16.5], [13.5, 14.5]),
  poly([4.2, 7.5], [13.5, 9.5]),
);
A(
  "focus",
  poly([3, 8], [3, 3], [8, 3]),
  poly([16, 3], [21, 3], [21, 8]),
  poly([21, 16], [21, 21], [16, 21]),
  poly([8, 21], [3, 21], [3, 16]),
  circ(12, 12, 3),
);
A("contrast", circ(12, 12, 8), raw("M12 4v16a8 8 0 000-16z"));
A("blur", circ(12, 12, 8), raw("M12 4a8 8 0 010 16M12 7a5 5 0 010 10"));
/* Eight square teeth: outer r9, root r6.5. */
const GEAR = Array.from({ length: 8 }, (_, k) =>
  [
    [-14, 6.5],
    [-9, 9],
    [9, 9],
    [14, 6.5],
  ].map(([da, r]): Pt => {
    const a = ((k * 45 + da) * Math.PI) / 180;
    return [12 + r * Math.cos(a), 12 + r * Math.sin(a)];
  }),
).flat();
A("settings-gear", closed(...GEAR), rect(9.5, 9.5, 5, 5));
A(
  "sliders-horizontal",
  poly([4, 5], [14, 5]),
  poly([18, 5], [20, 5]),
  poly([4, 12], [6, 12]),
  poly([10, 12], [20, 12]),
  poly([4, 19], [12, 19]),
  poly([16, 19], [20, 19]),
  rect(14, 3, 4, 4),
  rect(6, 10, 4, 4),
  rect(12, 17, 4, 4),
);
A(
  "bed",
  poly([3, 19], [3, 10], [21, 10], [21, 19]),
  poly([3, 15], [21, 15]),
  rect(6, 6, 5, 4),
  poly([3, 6], [3, 10]),
  poly([21, 6], [21, 10]),
);
A(
  "cake",
  closed([4, 12], [20, 12], [20, 21], [4, 21]),
  poly([4, 16], [20, 16]),
  poly([8, 12], [8, 8]),
  poly([12, 12], [12, 7]),
  poly([16, 12], [16, 8]),
  dot(8, 6),
  dot(12, 5),
  dot(16, 6),
);
A(
  "plant-pot",
  closed([6, 13], [18, 13], [17, 21], [7, 21]),
  poly([12, 13], [12, 7]),
  raw("M12 7c0-3 2-4 5-4 0 3-2 4-5 4zM12 10c0-3-2-4-5-4 0 3 2 4 5 4"),
);

/* Trimmed to land on exactly 377. Re-enable by removing a name here. */
const DROP = [
  "car",
  "bus",
  "bike",
  "plane",
  "train",
  "ship",
  "truck",
  "factory",
  "bank",
  "hospital",
  "tent",
  "map-pinned",
  "cloud-sun",
  "cloud-off",
  "wind",
  "umbrella",
  "thermometer",
  "snowflake",
  "mountain",
  "waves",
  "tree",
  "medal",
  "crown",
  "ghost",
  "dice",
  "gem",
  "glasses",
  "graduation",
  "hammer",
  "lamp",
  "paint-bucket",
  "wand",
  "binoculars",
  "flask",
  "utensils",
  "telescope",
  "toolbox",
  "swatch-book",
  "bed",
  "cake",
  "plant-pot",
  "tv",
  "speaker",
  "gamepad",
  "usb",
  "router",
  "sd-card",
  "battery-low",
  "battery-charging",
  "airplay",
  "webcam",
  "coins",
  "banknote",
  "euro",
  "scale",
  "shopping-basket",
  "ticket",
  "watch",
  "sunrise",
  "sunset",
  "calendar-clock",
  "voicemail",
  "megaphone",
  "phone-incoming",
  "phone-outgoing",
  "mails",
  "bell-ring",
  "arrow-big-up",
  "arrow-big-right",
  "arrow-big-down",
  "arrow-big-left",
  "rewind",
  "fast-forward",
  "move-horizontal",
  "move-vertical",
  "highlighter",
  "eraser",
  "pipette",
  "ruler",
  "scissors",
  "file-audio",
  "file-video",
  "file-spreadsheet",
  "file-archive",
  "picture-in-picture",
  "aperture",
];
for (const n of DROP) delete out[n];

/* ---------- seating ---------- */
/*
 * A square cap is the stroke extended by half its width. That suits a free end, but where an end
 * lands on another stroke (a diagonal into a corner, a shaft into an arrow tip, a flap into an
 * outline) the cap's corners poke out past it. Such ends are pulled back by half the stroke width,
 * which seats them flush exactly as a butt cap would; free ends keep their square caps.
 */
const HALF = 1.75 / 2;
type Seg =
  | { k: "L"; x: number; y: number }
  | { k: "A"; rx: number; ry: number; large: number; sweep: number; x: number; y: number }
  | { k: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number };
type Sub = { x: number; y: number; segs: Seg[]; closed: boolean };

const parse = (d: string): Sub[] => {
  const subs: Sub[] = [];
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  let i = 0;
  let cmd = "";
  let [x, y, cx2, cy2] = [0, 0, 0, 0];
  let sub: Sub | undefined;
  const n = () => +tok[i++];
  /* Arc flags may be packed ("0020.03" is 0, 0, 20.03), so they are read digit by digit. */
  const flag = () => {
    const t = tok[i];
    if (t.length === 1) return (i++, +t);
    tok[i] = t.slice(1);
    return +t[0];
  };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase();
    const [ox, oy] = rel ? [x, y] : [0, 0];
    const last = sub?.segs.at(-1);
    switch (cmd.toUpperCase()) {
      case "M":
        [x, y] = [ox + n(), oy + n()];
        subs.push((sub = { x, y, segs: [], closed: false }));
        cmd = rel ? "l" : "L";
        continue;
      case "Z":
        sub!.closed = true;
        [x, y] = [sub!.x, sub!.y];
        continue;
      case "L":
        [x, y] = [ox + n(), oy + n()];
        sub!.segs.push({ k: "L", x, y });
        break;
      case "H":
        x = ox + n();
        sub!.segs.push({ k: "L", x, y });
        break;
      case "V":
        y = oy + n();
        sub!.segs.push({ k: "L", x, y });
        break;
      case "A": {
        const [rx, ry] = [n(), n()];
        if (n() !== 0) throw new Error("icons: rotated arcs are not supported");
        const [large, sweep] = [flag(), flag()];
        [x, y] = [ox + n(), oy + n()];
        sub!.segs.push({ k: "A", rx, ry, large, sweep, x, y });
        break;
      }
      case "C":
      case "S": {
        const s = cmd.toUpperCase() === "S";
        const [x1, y1] = s
          ? last?.k === "C"
            ? [2 * x - cx2, 2 * y - cy2]
            : [x, y]
          : [ox + n(), oy + n()];
        [cx2, cy2] = [ox + n(), oy + n()];
        [x, y] = [ox + n(), oy + n()];
        sub!.segs.push({ k: "C", x1, y1, x2: cx2, y2: cy2, x, y });
        break;
      }
      default:
        throw new Error(`icons: unsupported path command ${cmd}`);
    }
  }
  return subs;
};

/** SVG endpoint arc → centre form (no rotation). */
const centre = (x1: number, y1: number, s: Extract<Seg, { k: "A" }>) => {
  const [hx, hy] = [(x1 - s.x) / 2, (y1 - s.y) / 2];
  let [rx, ry] = [s.rx, s.ry];
  const lam = (hx * hx) / (rx * rx) + (hy * hy) / (ry * ry);
  if (lam > 1) [rx, ry] = [rx * Math.sqrt(lam), ry * Math.sqrt(lam)];
  const num = rx * rx * ry * ry - rx * rx * hy * hy - ry * ry * hx * hx;
  const k =
    (s.large === s.sweep ? -1 : 1) *
    Math.sqrt(Math.max(0, num / (rx * rx * hy * hy + ry * ry * hx * hx)));
  const [px, py] = [(k * rx * hy) / ry, (-k * ry * hx) / rx];
  const [cx, cy] = [px + (x1 + s.x) / 2, py + (y1 + s.y) / 2];
  const t0 = Math.atan2((hy - py) / ry, (hx - px) / rx);
  let dt = Math.atan2((-hy - py) / ry, (-hx - px) / rx) - t0;
  if (s.sweep && dt < 0) dt += 2 * Math.PI;
  if (!s.sweep && dt > 0) dt -= 2 * Math.PI;
  return { cx, cy, rx, ry, t0, dt };
};

/** A subpath as a dense polyline (for distance tests only). */
const flatten = (s: Sub): Pt[] => {
  const pts: Pt[] = [[s.x, s.y]];
  let [x, y] = [s.x, s.y];
  for (const g of s.segs) {
    if (g.k === "A") {
      const c = centre(x, y, g);
      const steps = Math.max(2, Math.ceil((Math.abs(c.dt) * Math.max(c.rx, c.ry)) / 0.2));
      for (let j = 1; j <= steps; j++) {
        const t = c.t0 + (c.dt * j) / steps;
        pts.push([c.cx + c.rx * Math.cos(t), c.cy + c.ry * Math.sin(t)]);
      }
    } else if (g.k === "C") {
      for (let j = 1; j <= 16; j++) {
        const t = j / 16;
        const u = 1 - t;
        pts.push([
          u * u * u * x + 3 * u * u * t * g.x1 + 3 * u * t * t * g.x2 + t * t * t * g.x,
          u * u * u * y + 3 * u * u * t * g.y1 + 3 * u * t * t * g.y2 + t * t * t * g.y,
        ]);
      }
    } else pts.push([g.x, g.y]);
    [x, y] = [g.x, g.y];
  }
  if (s.closed) pts.push([s.x, s.y]);
  return pts;
};

const near = (p: Pt, line: Pt[]) => {
  let best = Infinity;
  for (let j = 1; j < line.length; j++) {
    const [a, b] = [line[j - 1], line[j]];
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const t = Math.max(
      0,
      Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)),
    );
    best = Math.min(best, Math.hypot(a[0] + t * dx - p[0], a[1] + t * dy - p[1]));
  }
  return best;
};

/** Move one end of a subpath back along its own stroke by `by`; false if it is too short. */
const retract = (s: Sub, atStart: boolean, by: number): boolean => {
  const i = atStart ? 0 : s.segs.length - 1;
  const g = s.segs[i];
  const [px, py] = i === 0 ? [s.x, s.y] : [s.segs[i - 1].x, s.segs[i - 1].y];
  if (g.k === "L") {
    const len = Math.hypot(g.x - px, g.y - py);
    if (len < by * 2) return false;
    const [ux, uy] = [(g.x - px) / len, (g.y - py) / len];
    if (atStart) [s.x, s.y] = [px + ux * by, py + uy * by];
    else [g.x, g.y] = [g.x - ux * by, g.y - uy * by];
    return true;
  }
  if (g.k === "A" && g.rx === g.ry) {
    const c = centre(px, py, g);
    const da = (by / c.rx) * Math.sign(c.dt);
    if (Math.abs(c.dt) < Math.abs(da) * 2) return false;
    const t = atStart ? c.t0 + da : c.t0 + c.dt - da;
    const q: Pt = [c.cx + c.rx * Math.cos(t), c.cy + c.rx * Math.sin(t)];
    if (atStart) [s.x, s.y] = q;
    else [g.x, g.y] = q;
    g.large = Math.abs(c.dt) - Math.abs(da) > Math.PI ? 1 : 0;
    return true;
  }
  return false;
};

const serialise = (subs: Sub[]) =>
  subs
    .map(
      (s) =>
        `M${f(s.x)} ${f(s.y)}` +
        s.segs
          .map((g) =>
            g.k === "L"
              ? `L${f(g.x)} ${f(g.y)}`
              : g.k === "A"
                ? `A${f(g.rx)} ${f(g.ry)} 0 ${g.large} ${g.sweep} ${f(g.x)} ${f(g.y)}`
                : `C${[g.x1, g.y1, g.x2, g.y2, g.x, g.y].map(f).join(" ")}`,
          )
          .join("") +
        (s.closed ? "Z" : ""),
    )
    .join("");

const seat = (body: string): string => {
  const paths = [...body.matchAll(/<path d='([^']*)'\/>/g)].map((m) => parse(m[1]));
  const shapes: Pt[][] = [];
  for (const m of body.matchAll(
    /<rect x='([\d.]+)' y='([\d.]+)' width='([\d.]+)' height='([\d.]+)'\/>/g,
  )) {
    const [x, y, w, h] = m.slice(1).map(Number);
    shapes.push([
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ]);
  }
  for (const m of body.matchAll(/<circle cx='([\d.]+)' cy='([\d.]+)' r='([\d.]+)'\/>/g)) {
    const [cx, cy, r] = m.slice(1).map(Number);
    shapes.push(
      Array.from({ length: 65 }, (_, j): Pt => [
        cx + r * Math.cos((j / 32) * Math.PI),
        cy + r * Math.sin((j / 32) * Math.PI),
      ]),
    );
  }
  const subs = paths.flat();
  const lines = subs.map(flatten);
  const ends = (s: Sub): [Pt, Pt] => [
    [s.x, s.y],
    [s.segs.at(-1)!.x, s.segs.at(-1)!.y],
  ];
  /* Decide every end against the untouched geometry, then move them. */
  const moves: [Sub, boolean][] = [];
  subs.forEach((s, k) => {
    if (s.closed || !s.segs.length) return;
    ends(s).forEach((p, e) => {
      /* The end's own stroke counts too, minus the stretch it starts from. */
      const own = lines[k];
      let run = 0;
      const far = (e ? [...own].reverse() : own).filter((q, j, a) => {
        if (j) run += Math.hypot(q[0] - a[j - 1][0], q[1] - a[j - 1][1]);
        return run > 2.5;
      });
      let hit = near(p, far) <= 0.35;
      for (const [j, other] of lines.entries()) {
        if (hit || j === k || near(p, other) > 0.35) continue;
        /* Two open ends meeting form a corner between them; their caps fill it. */
        const o = subs[j];
        const meets = !o.closed && ends(o).some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.35);
        hit = !meets;
      }
      hit ||= shapes.some((sh) => near(p, sh) <= 0.35);
      if (hit) moves.push([s, e === 0]);
    });
  });
  if (!moves.length) return body;
  for (const [s, atStart] of moves) retract(s, atStart, HALF);
  let p = 0;
  return body.replace(/<path d='[^']*'\/>/g, () => `<path d='${serialise(paths[p++])}'/>`);
};
for (const n of Object.keys(out)) out[n] = seat(out[n]);

const TARGET = 377;
const names = Object.keys(out);
if (names.length !== TARGET)
  throw new Error(
    `icons: expected ${TARGET}, have ${names.length} — adjust the set in scripts/icons.ts`,
  );

export const icons: Record<string, string> = out;
