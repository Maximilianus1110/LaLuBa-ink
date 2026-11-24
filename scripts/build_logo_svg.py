"""Trace design/logo.jpg into an exact, animatable pure-vector SVG and TS path module."""

from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path("/home/max/woorkspace/LaLuBa-ink")
LOGO_JPG = ROOT / "design" / "logo.jpg"
OUT_SVG = ROOT / "public" / "logo.svg"
OUT_TS = ROOT / "src" / "data" / "logoPaths.ts"


def marching_squares(mask: np.ndarray):
    """Extract closed contour polylines from a boolean 2D mask using marching squares."""
    h, w = mask.shape
    padded = np.pad(mask.astype(np.uint8), 1, mode="constant", constant_values=0)
    ph, pw = padded.shape

    # Edge segments indexed by midpoint grid (2*y, 2*x)
    # Edges on cell (y, x) with corners TL=(y,x), TR=(y,x+1), BR=(y+1,x+1), BL=(y+1,x)
    segments: list[tuple[tuple[float, float], tuple[float, float]]] = []

    # Edge midpoints in original pixel coords (offset -1 because of padding)
    for y in range(ph - 1):
        row0 = padded[y]
        row1 = padded[y + 1]
        for x in range(pw - 1):
            tl = row0[x]
            tr = row0[x + 1]
            br = row1[x + 1]
            bl = row1[x]
            code = (tl << 3) | (tr << 2) | (br << 1) | bl
            if code == 0 or code == 15:
                continue

            top = (x + 0.5 - 1.0, y - 1.0)
            right = (x + 1.0 - 1.0, y + 0.5 - 1.0)
            bottom = (x + 0.5 - 1.0, y + 1.0 - 1.0)
            left = (x - 1.0, y + 0.5 - 1.0)

            if code == 1:
                segments.append((left, bottom))
            elif code == 2:
                segments.append((bottom, right))
            elif code == 3:
                segments.append((left, right))
            elif code == 4:
                segments.append((top, right))
            elif code == 5:
                segments.append((left, top))
                segments.append((bottom, right))
            elif code == 6:
                segments.append((top, bottom))
            elif code == 7:
                segments.append((left, top))
            elif code == 8:
                segments.append((top, left))
            elif code == 9:
                segments.append((top, bottom))
            elif code == 10:
                segments.append((top, right))
                segments.append((left, bottom))
            elif code == 11:
                segments.append((top, right))
            elif code == 12:
                segments.append((right, left))
            elif code == 13:
                segments.append((bottom, right))
            elif code == 14:
                segments.append((left, bottom))

    # Stitch segments into closed loops
    adj: dict[tuple[float, float], list[tuple[float, float]]] = {}
    for a, b in segments:
        adj.setdefault(a, []).append(b)
        adj.setdefault(b, []).append(a)

    visited_edges: set[tuple[tuple[float, float], tuple[float, float]]] = set()
    loops: list[list[tuple[float, float]]] = []

    for start in list(adj.keys()):
        for nxt in adj[start]:
            edge = (start, nxt) if start < nxt else (nxt, start)
            if edge in visited_edges:
                continue
            loop = [start]
            curr = nxt
            prev = start
            visited_edges.add(edge)
            while curr != start:
                loop.append(curr)
                neighbors = adj.get(curr, [])
                moved = False
                for cand in neighbors:
                    e = (curr, cand) if curr < cand else (cand, curr)
                    if e not in visited_edges:
                        visited_edges.add(e)
                        prev = curr
                        curr = cand
                        moved = True
                        break
                if not moved:
                    break
            if len(loop) >= 6:
                loops.append(loop)
    return loops


def chaikin_closed(pts: list[tuple[float, float]], iterations: int = 2):
    out = pts
    for _ in range(iterations):
        nxt = []
        n = len(out)
        for i in range(n):
            p0 = out[i]
            p1 = out[(i + 1) % n]
            nxt.append((0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]))
            nxt.append((0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]))
        out = nxt
    return out


def rdp_closed(pts: list[tuple[float, float]], eps: float = 0.75):
    def perp_dist(p, a, b):
        dx = b[0] - a[0]
        dy = b[1] - a[1]
        if dx == 0 and dy == 0:
            return ((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2) ** 0.5
        t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)
        proj = (a[0] + t * dx, a[1] + t * dy)
        return ((p[0] - proj[0]) ** 2 + (p[1] - proj[1]) ** 2) ** 0.5

    def rdp(arr):
        if len(arr) <= 2:
            return arr
        a, b = arr[0], arr[-1]
        max_d = -1.0
        idx = 0
        for i in range(1, len(arr) - 1):
            d = perp_dist(arr[i], a, b)
            if d > max_d:
                max_d = d
                idx = i
        if max_d > eps:
            left = rdp(arr[: idx + 1])
            right = rdp(arr[idx:])
            return left[:-1] + right
        return [a, b]

    if len(pts) < 4:
        return pts
    simplified = rdp(pts + [pts[0]])
    return simplified[:-1] if len(simplified) > 3 else pts


def loop_area(pts: list[tuple[float, float]]) -> float:
    area = 0.0
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    return abs(area) * 0.5


def loops_to_svg_path(loops: list[list[tuple[float, float]]], scale_factor: float, min_area: float = 25.0) -> str:
    parts = []
    for lp in loops:
        if loop_area(lp) < min_area:
            continue
        sm = chaikin_closed(lp, iterations=2)
        simp = rdp_closed(sm, eps=0.65)
        if len(simp) < 3:
            continue
        coords = [(p[0] * scale_factor, p[1] * scale_factor) for p in simp]
        d = f"M {coords[0][0]:.1f} {coords[0][1]:.1f} " + " ".join(
            f"L {x:.1f} {y:.1f}" for x, y in coords[1:]
        ) + " Z"
        parts.append(d)
    return " ".join(parts)


def main():
    im = Image.open(LOGO_JPG).convert("RGB")
    # Upscale 4x (600x600) with Lanczos + slight blur for smooth subpixel contours
    work_size = 600
    im_up = im.resize((work_size, work_size), Image.Resampling.LANCZOS).filter(
        ImageFilter.GaussianBlur(radius=0.6)
    )
    arr = np.array(im_up, dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    pinkness = r - g

    yy, xx = np.mgrid[0:work_size, 0:work_size]
    dist_center = np.hypot(xx - 300.0, yy - 300.0)

    # 1. White letter mask for "LaLuBa" (y roughly 165..335)
    white_mask = (
        (r > 168)
        & (g > 152)
        & (b > 156)
        & (yy >= 165)
        & (yy <= 345)
        & (xx >= 65)
        & (xx <= 535)
    )

    # 2. Pink 3D shadow behind LaLuBa (pink pixels in LaLuBa band, excluding outer ring)
    shadow_mask = (
        (r > 70)
        & (pinkness > 15)
        & (~white_mask)
        & (yy >= 165)
        & (yy <= 340)
        & (dist_center < 216)
    )

    # 3. Pink "Ink" script mask (centered below LaLuBa, above subline, well inside outer ring)
    ink_mask = (
        (r > 82)
        & (pinkness > 18)
        & (yy >= 295)
        & (yy <= 425)
        & (xx >= 180)
        & (xx <= 425)
        & (dist_center < 205)
    )

    # Extract paths mapped into a clean 500x500 viewBox
    scale = 500.0 / work_size
    letters_d = loops_to_svg_path(marching_squares(white_mask), scale, min_area=18.0)
    shadow_d = loops_to_svg_path(marching_squares(shadow_mask), scale, min_area=12.0)
    ink_d = loops_to_svg_path(marching_squares(ink_mask), scale, min_area=14.0)

    # Measure exact ring & star geometry from original image
    # Ring radius ~ 183 in 500x500 space centered at (250, 252)
    cx, cy, rad = 250.0, 250.0, 184.0
    # Compute 4 broken arcs around top star (250, 66) and bottom star (250, 434)
    # Left/right gaps around LaLuBa (approx angles 192..210 deg on left, -12..+8 deg on right)
    import math

    def arc_path(deg_start: float, deg_end: float) -> str:
        a1 = math.radians(deg_start)
        a2 = math.radians(deg_end)
        x1 = cx + rad * math.cos(a1)
        y1 = cy + rad * math.sin(a1)
        x2 = cx + rad * math.cos(a2)
        y2 = cy + rad * math.sin(a2)
        large = 1 if (deg_end - deg_start) % 360 > 180 else 0
        return f"M {x1:.1f} {y1:.1f} A {rad:.1f} {rad:.1f} 0 {large} 1 {x2:.1f} {y2:.1f}"

    # Angles in SVG screen coords (0=right, 90=bottom, 180=left, 270=top)
    arc_top_left = arc_path(212, 261)
    arc_top_right = arc_path(279, 342)
    arc_bot_right = arc_path(1, 81)
    arc_bot_left = arc_path(99, 173)

    star_top = "M 250 40 Q 253 62 273 66 Q 253 70 250 92 Q 247 70 227 66 Q 247 62 250 40 Z"
    star_bottom = "M 250 408 Q 253 430 273 434 Q 253 438 250 460 Q 247 438 227 434 Q 247 430 250 408 Z"
    heart_d = "M 250 384.5 C 245.5 380.5 243 377.2 245.5 374.8 C 247.2 373.2 249.2 374.2 250 376.1 C 250.8 374.2 252.8 373.2 254.5 374.8 C 257 377.2 254.5 380.5 250 384.5 Z"

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" role="img" aria-label="LaLuBa.ink Tattoo's by Laura">
  <defs>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e59bb6" />
      <stop offset="50%" stop-color="#c85c84" />
      <stop offset="100%" stop-color="#e59bb6" />
    </linearGradient>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f2b5cb" />
      <stop offset="100%" stop-color="#d45d8b" />
    </linearGradient>
    <linearGradient id="inkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eab8c9" />
      <stop offset="50%" stop-color="#d96b96" />
      <stop offset="100%" stop-color="#c44d7b" />
    </linearGradient>
  </defs>

  <g fill="none" stroke="url(#ringGrad)" stroke-width="4.2" stroke-linecap="round">
    <path d="{arc_top_left}" />
    <path d="{arc_top_right}" />
    <path d="{arc_bot_right}" />
    <path d="{arc_bot_left}" />
  </g>

  <path d="{star_top}" fill="url(#starGrad)" stroke="#14090e" stroke-width="2.2" />
  <path d="{star_bottom}" fill="url(#starGrad)" stroke="#14090e" stroke-width="2.2" />

  <path d="{shadow_d}" fill="#b8537a" fill-rule="evenodd" stroke="#14090e" stroke-width="1.2" />
  <path d="{letters_d}" fill="#f5f1f4" fill-rule="evenodd" stroke="#14090e" stroke-width="1.6" />
  <path d="{ink_d}" fill="url(#inkGrad)" fill-rule="evenodd" stroke="#14090e" stroke-width="1.4" />

  <g fill="#e5dce0" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="700" text-anchor="middle">
    <text x="250" y="369" font-size="9.5" letter-spacing="3.8">TATTOO&apos;S</text>
    <line x1="186" y1="379" x2="238" y2="379" stroke="#d9789b" stroke-width="1.2" stroke-opacity="0.85" />
    <line x1="262" y1="379" x2="314" y2="379" stroke="#d9789b" stroke-width="1.2" stroke-opacity="0.85" />
    <path d="{heart_d}" fill="none" stroke="#d9789b" stroke-width="1.4" />
    <text x="250" y="396" font-size="8.5" letter-spacing="3.5" fill="#cbbdc3">BY LAURA</text>
  </g>
</svg>
'''
    OUT_SVG.write_text(svg_content, encoding="utf-8")

    ts_content = f'''export const LOGO_PATHS = {{
  arcs: [
    "{arc_top_left}",
    "{arc_top_right}",
    "{arc_bot_right}",
    "{arc_bot_left}",
  ],
  starTop: "{star_top}",
  starBottom: "{star_bottom}",
  shadow: "{shadow_d}",
  letters: "{letters_d}",
  ink: "{ink_d}",
  heart: "{heart_d}",
}} as const;
'''
    OUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUT_TS.write_text(ts_content, encoding="utf-8")
    print(
        f"Generated SVG ({len(svg_content)} bytes) & TS ({len(ts_content)} bytes) | "
        f"letters_len={len(letters_d)}, shadow_len={len(shadow_d)}, ink_len={len(ink_d)}"
    )


if __name__ == "__main__":
    main()
