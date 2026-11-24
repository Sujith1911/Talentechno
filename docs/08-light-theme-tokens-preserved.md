# Preserved Light Theme Design Tokens & Color Palette

This document permanently preserves the complete color template, gradients, and specular effects of the Executive Luxury Light Theme, ensuring 100% fidelity when implementing the dual-theme system (Translucent Glossy Purple Dark Theme + Preserved Light Theme).

---

## 🎨 1. Core Color System

| Token | Hex / Value | Description |
|:---|:---|:---|
| `--bg-primary` | `#FAFAF8` | Alabaster White primary canvas |
| `--bg-secondary` | `#F4F5F7` | Pearl subtle tinted container |
| `--bg-card` | `rgba(255, 255, 255, 0.88)` | Frosted glass card backdrop |
| `--bg-card-hover` | `rgba(255, 255, 255, 0.98)` | Hover illuminated card surface |
| `--text-main` | `#0B1329` | Deep obsidian contrast text |
| `--text-secondary`| `#475569` | Slate neutral secondary text |
| `--text-muted` | `#94A3B8` | Subtle grey muted labels |
| `--text-gold` | `#9E700F` | Warm metallic gold highlighted copy |

---

## 🌟 2. Luxury Gold Hierarchy

| Token | Hex / Value | Role |
|:---|:---|:---|
| `--gold-primary` | `#C5A059` | Balanced luxury satin gold |
| `--gold-light` | `#F5DE98` | Champagne ambient gold glow |
| `--gold-dark` | `#8C6514` | High-contrast readable gold text & borders |
| `--gold-champagne`| `#F8EED6` | Soft champagne silk tint |
| `--gold-accent` | `#D4AF37` | Vivid metallic gold badge & active accent |

---

## 💫 3. Metallic Gradients & Specular Highlights

* **Liquid Gold Multi-Stop Metallic Gradient:**
  ```css
  --grad-gold: linear-gradient(135deg, #FFF6D6 0%, #F5D77F 22%, #D4AF37 55%, #B8860B 82%, #8C6212 100%);
  ```
* **Soft Champagne Glass Glow:**
  ```css
  --grad-gold-soft: linear-gradient(135deg, rgba(245, 222, 152, 0.35) 0%, rgba(212, 175, 55, 0.08) 100%);
  ```
* **Pearl Surface Fill:**
  ```css
  --grad-pearl: linear-gradient(180deg, #FFFFFF 0%, #F7F8F9 100%);
  ```
* **Borders & Shadows:**
  ```css
  --border-gold: rgba(212, 175, 55, 0.32);
  --border-gold-glow: rgba(212, 175, 55, 0.6);
  --border-subtle: rgba(226, 232, 240, 0.85);
  --shadow-gold-sm: 0 4px 16px rgba(197, 160, 89, 0.15);
  --shadow-gold-md: 0 12px 36px rgba(197, 160, 89, 0.22);
  --shadow-gold-lg: 0 24px 60px rgba(197, 160, 89, 0.28);
  --shadow-glass: 0 16px 40px rgba(15, 23, 42, 0.05);
  ```

---

## 🔘 4. 3D Liquid-Gloss Button Formula

```css
/* Multi-stop liquid gradient with dual specular highlights */
background: linear-gradient(180deg, #FDF4D4 0%, #E8C86A 32%, #D4AF37 58%, #BA8514 84%, #8B6109 100%);
box-shadow: 
  0 12px 28px -4px rgba(186, 133, 20, 0.44),
  0 4px 12px rgba(0, 0, 0, 0.04),
  inset 0 1.5px 1px rgba(255, 255, 255, 0.95),
  inset 0 -2px 3px rgba(139, 97, 9, 0.45);
```
