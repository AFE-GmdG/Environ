/* eslint-disable no-param-reassign */
export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export function isRGB(rgbOrHsl: RGB | HSL): rgbOrHsl is RGB {
  return "r" in rgbOrHsl;
}

export function isHSL(rgbOrHsl: RGB | HSL): rgbOrHsl is HSL {
  return "h" in rgbOrHsl;
}

export class Color {
  private _rgb: RGB;

  private _hsl: HSL;

  private _mode: "RGB" | "HSL";

  get r(): number {
    return this._rgb.r;
  }

  get g(): number {
    return this._rgb.g;
  }

  get b(): number {
    return this._rgb.b;
  }

  get h(): number {
    return this._hsl.h;
  }

  get s(): number {
    return this._hsl.s;
  }

  get l(): number {
    return this._hsl.l;
  }

  get mode(): "RGB" | "HSL" {
    return this._mode;
  }

  set mode(value: "RGB" | "HSL") {
    if (this._mode === value) {
      return;
    }
    this._mode = value;
    if (value === "RGB") {
      this._hsl = Color.toHSL(this._rgb);
    } else {
      this._rgb = Color.toRGB(this._hsl);
    }
  }

  constructor(rgb: RGB);
  constructor(hsl: HSL);
  constructor(rgbOrHsl: RGB | HSL) {
    if (isRGB(rgbOrHsl)) {
      this._mode = "RGB";
      this._rgb = {
        r: Math.max(0, Math.min(255, Math.floor(rgbOrHsl.r))),
        g: Math.max(0, Math.min(255, Math.floor(rgbOrHsl.g))),
        b: Math.max(0, Math.min(255, Math.floor(rgbOrHsl.b))),
      };
      this._hsl = Color.toHSL(rgbOrHsl);
    } else {
      this._mode = "HSL";
      this._hsl = {
        h: (360 + (rgbOrHsl.h % 360)) % 360,
        s: Math.max(0, Math.min(100, rgbOrHsl.s)),
        l: Math.max(0, Math.min(100, rgbOrHsl.l)),
      };
      this._rgb = Color.toRGB(rgbOrHsl);
    }
  }

  static toHSL(rgb: RGB): HSL {
    const r = Math.max(0, Math.min(255, Math.floor(rgb.r))) / 255;
    const g = Math.max(0, Math.min(255, Math.floor(rgb.g))) / 255;
    const b = Math.max(0, Math.min(255, Math.floor(rgb.b))) / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    let h: number;
    let s: number;
    const l = (min + max) / 2;
    if (min === max) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
    };
  }

  static toRGB(_hsl: HSL): RGB {
    const s = Math.max(0, Math.min(1, _hsl.s / 100));
    const l = Math.max(0, Math.min(1, _hsl.l / 100));

    if (s === 0) {
      const v = Math.min(255, Math.floor(l * 256));
      return { r: v, g: v, b: v };
    }

    const h = ((360 + (_hsl.h % 360)) % 360) / 360;

    const q = l < 0.5
      ? l * (1 + s)
      : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.max(0, Math.min(255, Math.floor(hue2rgb(p, q, h + 1 / 3) * 256))),
      g: Math.max(0, Math.min(255, Math.floor(hue2rgb(p, q, h) * 256))),
      b: Math.max(0, Math.min(255, Math.floor(hue2rgb(p, q, h - 1 / 3) * 256))),
    };
  }
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
