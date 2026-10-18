export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value);
}

/** Parses #rgb, #rgba, #rrggbb and #rrggbbaa into 0–255 channels and 0–1 alpha. */
export function parseHex(hex: string): Rgba {
  if (!isHexColor(hex)) throw new Error(`Invalid hex color "${hex}"`);
  let digits = hex.slice(1);
  if (digits.length <= 4) {
    digits = [...digits].map((d) => d + d).join("");
  }
  const channel = (i: number) => parseInt(digits.slice(i, i + 2), 16);
  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: digits.length === 8 ? Math.round((channel(6) / 255) * 1000) / 1000 : 1,
  };
}

export function toHex({ r, g, b }: Rgba): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

export function toRgbString({ r, g, b, a }: Rgba): string {
  return a === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${a})`;
}

export function toHslString({ r, g, b, a }: Rgba): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  const fmt = (n: number) => Math.round(n * 10) / 10;
  const body = `${fmt(h)} ${fmt(s * 100)}% ${fmt(l * 100)}%`;
  return a === 1 ? `hsl(${body})` : `hsl(${body} / ${a})`;
}

/** Alpha-composites `top` over an opaque `bottom`. */
export function composite(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a;
  return {
    r: top.r * a + bottom.r * (1 - a),
    g: top.g * a + bottom.g * (1 - a),
    b: top.b * a + bottom.b * (1 - a),
    a: 1,
  };
}

function relativeLuminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG 2.x contrast ratio between two opaque colors, rounded to two decimals. */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  return Math.round(ratio * 100) / 100;
}

/** DTCG 2025.10 color object for spec-conformant exports. */
export function toDtcgColor(hex: string) {
  const { r, g, b, a } = parseHex(hex);
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return {
    colorSpace: "srgb",
    components: [round(r / 255), round(g / 255), round(b / 255)],
    ...(a === 1 ? {} : { alpha: a }),
    hex: toHex({ r, g, b, a }),
  };
}
