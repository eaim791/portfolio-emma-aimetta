"""
Prepara las fotos de /img (originales, no se tocan) y deja las versiones optimizadas en /public/img.
Uso:  python scripts/process-images.py
Requiere: pip install pillow numpy

Paleta de la página ("oliva y lino"): el fondo terracota de los retratos originales se recolorea a
PIEDRA (STONE), el mismo tono de los bloques de la página, conservando luces y sombras del fondo.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "img", ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)

STONE = (184, 182, 149)  # #b8b695 — debe coincidir con --stone de src/styles/tokens.css


def save(im, name, q=88):
    im.convert("RGB").save(OUT / name, quality=q, optimize=True, progressive=True)
    print("ok", name, im.size, round((OUT / name).stat().st_size / 1024), "KB")


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def connected_to_border(mask, scale=4):
    """Píxeles de `mask` conectados con el borde de la imagen (calculado a 1/scale y suavizado)."""
    h, w = mask.shape
    small = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).resize((w // scale, h // scale), Image.BILINEAR)) > 127
    reached = np.zeros_like(small)
    reached[0, :], reached[-1, :], reached[:, 0], reached[:, -1] = small[0, :], small[-1, :], small[:, 0], small[:, -1]
    while True:
        grown = reached.copy()
        grown[1:, :] |= reached[:-1, :]
        grown[:-1, :] |= reached[1:, :]
        grown[:, 1:] |= reached[:, :-1]
        grown[:, :-1] |= reached[:, 1:]
        grown &= small
        if (grown == reached).all():
            break
        reached = grown
    big = Image.fromarray((reached * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale))
    return np.clip(np.asarray(big).astype(np.float32) / 255 * 1.6, 0, 1)


def recolor_bg(im, target=STONE, debug=None):
    """Cambia el fondo terracota (saturado, tono ~15°) por `target`, sin tocar piel, pelo ni ropa."""
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255.0
    mx, mn = a.max(-1), a.min(-1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    # El fondo es más saturado (≥ 0.63) que la piel (≤ 0.52); el pelo y la ropa oscuros se excluyen por brillo.
    alpha = smoothstep(0.555, 0.625, sat) * smoothstep(0.11, 0.2, mx)
    strict = alpha * connected_to_border(alpha > 0.5)
    # Residuos rojizos poco saturados (sombras, fibras) pegados al fondo: se recolorean con un umbral más
    # laxo, pero solo a ≤ ~12 px del fondo confirmado, para no tocar la piel ni la ropa.
    near = np.asarray(
        Image.fromarray((strict > 0.5).astype(np.uint8) * 255).resize((strict.shape[1] // 4, strict.shape[0] // 4), Image.BILINEAR)
        .filter(ImageFilter.MaxFilter(7)).resize((strict.shape[1], strict.shape[0]), Image.BILINEAR)
    ).astype(np.float32) / 255
    hue = np.degrees(np.arctan2(np.sqrt(3) * (a[..., 1] - a[..., 2]), 2 * a[..., 0] - a[..., 1] - a[..., 2])) % 360
    loose = smoothstep(0.34, 0.48, sat) * smoothstep(0.08, 0.16, mx) * ((hue > 2) & (hue < 38)) * (near > 0.3)
    alpha = np.maximum(strict, loose)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))).astype(np.float32) / 255
    ref = np.median(mx[alpha > 0.95])
    shade = 1 + 0.55 * (mx / ref - 1)  # conserva la viñeta del fondo, comprimida para no quemar
    tgt = np.array(target, np.float32) / 255.0
    recolored = np.clip(tgt * shade[..., None], 0, 1)
    out = np.where(alpha[..., None] > 0, a * (1 - alpha[..., None]) + recolored * alpha[..., None], a)
    if debug:
        dbg = a.copy()
        dbg[..., 0] = np.clip(dbg[..., 0] + alpha * 0.6, 0, 1)
        Image.fromarray((dbg * 255).astype(np.uint8)).save(debug)
    return Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8))


def patch_bg(im, box):
    """Tapa una mancha con el fondo de justo encima (por columnas) + grano, con bordes suaves."""
    a = np.asarray(im).astype(np.float32)
    x0, y0, x1, y1 = box
    strip = a[y0 - 24 : y0 - 4, x0:x1].mean(0)  # (ancho, 3)
    fill = np.repeat(strip[None], y1 - y0, 0) + np.random.default_rng(7).normal(0, 1.4, (y1 - y0, x1 - x0, 3))
    m = np.zeros((y1 - y0, x1 - x0), np.float32)
    m[6:, : -2] = 1
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))).astype(np.float32)[..., None] / 255
    a[y0:y1, x0:x1] = a[y0:y1, x0:x1] * (1 - m) + fill * m
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def portrait(src, name, border, width, crop_bottom=0, q=88, debug=None, patch=None):
    """Recorta el marco oscuro de la película, recolorea el fondo y optimiza."""
    im = Image.open(SRC / src).convert("RGB")
    w, h = im.size
    im = im.crop((border, border, w - border, h - border - crop_bottom))
    im = recolor_bg(im, debug=debug)
    for box in patch or []:
        im = patch_bg(im, box)
    if im.size[0] > width:
        im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
    save(im, name, q)


if __name__ == "__main__":
    # Inicio: retrato del blazer de rayas finas (alta resolución)
    portrait("297c0c5e-5d49-49d4-9e9d-064a0808ec2e.png", "home-emma.jpg", 34, 1100)
    # Sobre mí: retrato sentado
    portrait("1c5580d5-af43-46e5-ae46-c30de9b0f315.jpg", "about-emma.jpg", 24, 820, patch=[(0, 856, 64, 976), (62, 934, 104, 976)])
    # Contacto: retrato de blazer negro
    portrait("e79d39ea-22f2-4ef8-b86a-724a637e2c3f.jpg", "contact-emma.jpg", 24, 820)
