"""
Prepara las fotos de /img (originales, no se tocan) y deja las versiones optimizadas en /public/img.
Uso:  python scripts/process-images.py
Requiere: pip install pillow numpy
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "img", ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)

HERO_BG = (166, 76, 46)       # #a64c2e — nuevo fondo terracota de la foto del hero


def save(im, name, q=88):
    im.convert("RGB").save(OUT / name, quality=q, optimize=True, progressive=True)
    print("ok", name, im.size, round((OUT / name).stat().st_size / 1024), "KB")


# ── 1 · Hero: quita la firma, recolorea el fondo rojo → terracota, y amplía suavemente ──────────
def hero():
    im = Image.open(SRC / "51ca2332-0fe2-4aa1-bd43-ad159d656764.jpg").convert("RGB")
    # (a) tapar la firma "HAMM kumo / Photography aesthetic space": el fondo es liso, así que se
    #     rellena cada fila interpolando entre el color de la izquierda y de la derecha + grano.
    arr = np.asarray(im).astype(np.float32)
    x0, x1, y0, y1 = 268, 552, 22, 128
    left = arr[y0:y1, x0 - 22:x0 - 4].mean(1)           # (filas, 3)
    right = arr[y0:y1, x1 + 4:x1 + 22].mean(1)
    t = np.linspace(0, 1, x1 - x0)[None, :, None]
    fill = left[:, None, :] * (1 - t) + right[:, None, :] * t
    fill += np.random.default_rng(3).normal(0, 1.6, fill.shape)
    m = np.zeros((y1 - y0, x1 - x0), np.float32)
    m[10:-10, 10:-10] = 1
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32)[..., None] / 255
    arr[y0:y1, x0:x1] = arr[y0:y1, x0:x1] * (1 - m) + fill * m
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    # (b) recolor: pixeles muy saturados y rojizos → terracota, conservando la luz/sombra de cada píxel
    a = np.asarray(im).astype(np.float32) / 255.0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    # tono en grados
    d = np.maximum(mx - mn, 1e-6)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    reddish = (hue < 14) | (hue > 340)
    alpha = np.clip((sat - 0.50) / 0.22, 0, 1) * reddish * np.clip((mx - 0.20) / 0.15, 0, 1)
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    alpha = np.asarray(alpha_img).astype(np.float32)[..., None] / 255.0
    ref_v = np.median(mx[alpha[..., 0] > 0.95])            # brillo típico del fondo original
    target = np.array(HERO_BG, np.float32) / 255.0
    shade = (mx / ref_v)[..., None]                          # conserva degradados y sombras
    recolored = np.clip(target * shade, 0, 1)
    out = a * (1 - alpha) + recolored * alpha
    res = Image.fromarray((out * 255).round().astype(np.uint8))

    # (c) 1.5× con Lanczos + un toque de nitidez (la fuente es de 768 px)
    res = res.resize((1152, 1536), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
    save(res, "home-emma.jpg", 88)


# ── 2 · Retratos terracota: recorta el marco oscuro de la película y optimiza ───────────────────
def crop_save(src, name, border, width):
    im = Image.open(SRC / src).convert("RGB")
    w, h = im.size
    im = im.crop((border, border, w - border, h - border))
    if im.size[0] > width:
        im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
    save(im, name, 86)


hero()
crop_save("297c0c5e-5d49-49d4-9e9d-064a0808ec2e.png", "about-emma.jpg", 34, 1000)
crop_save("1c5580d5-af43-46e5-ae46-c30de9b0f315.jpg", "about-emma-2.jpg", 24, 720)
# Retrato de la sección Contacto: resolución nativa (772 px de ancho), sin reescalar
crop_save("e79d39ea-22f2-4ef8-b86a-724a637e2c3f.jpg", "contact-emma.jpg", 24, 800)
