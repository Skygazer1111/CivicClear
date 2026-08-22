# CampusClean UI

Luminous lagoon daylight — soft aurora, frosted panels, smooth motion. Not dark, not sterile, not neon purple.

## Type

- Display: **Fraunces** (brand + page titles)
- Body: **Plus Jakarta Sans**
- Brand mark: gradient “CC” tile + wordmark; brand should read as the hero on the landing page

## Color

| Token | Hex | Use |
|---|---|---|
| Canvas | `#EEF6F3` | Soft mint base |
| Ink | `#10241F` | Primary text |
| Ink muted | `#4D675E` | Secondary text |
| Line | `#C9DDD4` | Soft borders |
| Accent | `#0F8F78` | Primary actions / links |
| Accent soft | `#D4F3EA` | Active nav, chips |
| Sky / mint / sand / coral soft | ambient aurora blobs |

No dark theme. No purple neon. Soft daylight palette only.

## Motion

- Floating ambient blobs + slow aurora meshes (~14–22s)
- Rise-in on first paint (~0.85s, slight blur → clear)
- Button lift / press scale; interactive glass sheen on hover
- Active nav pills
- Respect `prefers-reduced-motion`

## Surfaces

- Frosted panels (`glass-panel`): translucent white, blur + saturate, inset highlight
- Shared form control class: `.field`
- Large soft radii (~1.5–2rem)
- Subtle film grain over the ambient field

## Mobile (citizens first)

- Sticky bottom tabs: Home · Report · Profile (`md+` keeps top nav)
- 44px+ tap targets, 16px inputs (no iOS zoom), safe-area insets
- Camera-first photo picker, taller map, sticky submit above the tab bar
- Compact titles/stats; footer hidden on small citizen screens
