#!/usr/bin/env python3
"""Vérifie les contrastes WCAG 2.1 des paires texte/fond de chaque thème.

Usage : python3 docs/design/contrast.py  (sortie Markdown, reprise dans README.md)
Les fonds semi-transparents (cartes « glass » d'Azur) sont composés sur le fond de page.
"""

THEMES = {
    "ring": {
        "pairs": [
            ("ink / bg", "#f5f3ef", "#0b0b0c"),
            ("ink-soft / bg", "#c9c4bc", "#0b0b0c"),
            ("muted / bg", "#9b958c", "#0b0b0c"),
            ("ink / card", "#f5f3ef", "#18181b"),
            ("muted / card", "#9b958c", "#18181b"),
            ("primary-ink / primary (bouton)", "#ffffff", "#d81424"),
            ("primary-ink / primary-hover", "#ffffff", "#b50f1d"),
            ("link (rouge éclairci) / bg", "#ff4a4f", "#0b0b0c"),
            ("accent-ink / accent (os)", "#0b0b0c", "#e8e2d6"),
            ("ink / primary-soft (composé sur bg)", "#f5f3ef", "#2a0d10"),
            ("link / card", "#ff4a4f", "#18181b"),
            ("dark-ink / dark", "#ffffff", "#000000"),
            ("footer-ink / footer-bg", "#bdb8b0", "#050505"),
        ],
    },
    "azur": {
        "pairs": [
            ("ink / bg", "#0c1b2e", "#eef4fb"),
            ("ink-soft / bg", "#2f4560", "#eef4fb"),
            ("muted / bg", "#56677c", "#eef4fb"),
            ("ink / card (glass 72 % sur bg)", "#0c1b2e", ("#ffffff", 0.72, "#eef4fb")),
            ("muted / card (glass)", "#56677c", ("#ffffff", 0.72, "#eef4fb")),
            ("primary-ink / primary (bouton)", "#ffffff", "#1667c2"),
            ("primary-ink / primary-hover", "#ffffff", "#0f56a8"),
            ("primary (liens) / bg", "#1667c2", "#eef4fb"),
            ("primary (liens) / card", "#1667c2", "#ffffff"),
            ("dark-ink / dark", "#ffffff", "#0a2342"),
            ("accent-ink / accent", "#0c1b2e", "#8fbbea"),
            ("dark-muted / dark", "#a9bdd6", "#0a2342"),
            ("footer-ink / footer-bg", "#c4d3e6", "#0a2342"),
        ],
    },
    "club": {
        "pairs": [
            ("ink / bg", "#111111", "#f7f7f5"),
            ("ink-soft / bg", "#2b2b2b", "#f7f7f5"),
            ("muted / bg", "#595959", "#f7f7f5"),
            ("ink / card", "#111111", "#ffffff"),
            ("muted / card", "#595959", "#ffffff"),
            ("primary-ink / primary (bouton noir)", "#ffffff", "#111111"),
            ("accent-ink / accent (jaune)", "#111111", "#ffd700"),
            ("liens (ink souligné or) / bg", "#111111", "#f7f7f5"),
            ("dark-ink / dark", "#ffffff", "#111111"),
            ("accent / dark (titres jaunes sur noir)", "#ffd700", "#111111"),
            ("footer-ink / footer-bg", "#c8c8c8", "#111111"),
            ("gris charte #808080 / noir (texte secondaire sur sombre)", "#808080", "#000000"),
            ("or sur blanc (INTERDIT en texte, décor seul)", "#ffd700", "#ffffff"),
            ("dark-muted / dark", "#b3b3b3", "#111111"),
            ("ink / surface (gris charte clair)", "#111111", "#e9e9e7"),
            ("muted / surface (gris charte clair)", "#595959", "#e9e9e7"),
        ],
    },
}


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))


def blend(fg, alpha, bg):
    f, b = hex_rgb(fg), hex_rgb(bg)
    return "#" + "".join(f"{round((alpha * x + (1 - alpha) * y) * 255):02x}" for x, y in zip(f, b))


def lum(h):
    def ch(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (ch(c) for c in hex_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


if __name__ == "__main__":
    for name, t in THEMES.items():
        print(f"\n### {name}\n\n| Paire | Texte | Fond | Ratio | AA normal (4.5) | AA grand (3) |\n|---|---|---|---|---|---|")
        for label, fg, bg in t["pairs"]:
            if isinstance(bg, tuple):
                bg = blend(*bg)
            r = ratio(fg, bg)
            print(f"| {label} | `{fg}` | `{bg}` | {r:.2f} | {'oui' if r >= 4.5 else 'NON'} | {'oui' if r >= 3 else 'NON'} |")
