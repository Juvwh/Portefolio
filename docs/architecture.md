# Front-End Architecture Overview

## Methodology
- **Naming**: Blocks, elements, and modifiers follow the BEM convention to keep selectors flat and predictable. Example: `.project-carousel__nav--prev` extends the base `.project-carousel__nav` block element.
- **Layering**: CSS is split into `critical.css` (tokens, base, layout primitives, above-the-fold hero & carousel) and `main.css` (lazy-loaded enhancements and lower-fold components). Critical styles are safe to inline for first paint, while `main.css` can stay deferred via `rel="preload"` + `onload` swap.
- **Utilities**: Small utility classes (`.layout-container`, `.button`, `.badge-list`) encourage composition and reduce duplication across sections.

## File Structure
```
assets/
  css/
    critical.css   # Tokens, resets, global utilities, hero, carousel
    main.css       # Remaining components, grids, timeline, modal/gallery
font/
  adam.otf         # Custom display font
index.html          # Updated markup mapped to BEM classes
navbar.js          # Responsive navigation interactions
modal.js           # Modal/gallery interactions
```

## Design Tokens
Key CSS custom properties live at the top of `critical.css`:

| Token group | Example variables |
|-------------|-------------------|
| Colors | `--color-bg-page`, `--color-text-primary`, `--color-accent`, theme-specific overrides via `.dark-theme` / `.light-theme` |
| Typography | `--font-family-base`, `--font-family-display`, `--font-size-base`, `--line-height-base` |
| Spacing | `--space-2xs` → `--space-2xl` |
| Radii & Shadows | `--radius-sm`, `--radius-pill`, `--shadow-card`, `--shadow-deep` |
| Motion | `--transition-base` |

Component styles reference these variables to keep the visual design consistent across themes.

## Critical vs. Deferred CSS
- **Inline recommendation**: Inline the contents of `assets/css/critical.css` in `<head>` for immediate render of the navigation, hero, and carousel.
- **Deferred**: Keep `assets/css/main.css` loaded asynchronously. It covers below-the-fold sections (features, timelines, grids, modals) and non-critical animations.

## Removed Assets
- `style.css`: Legacy monolithic stylesheet replaced by modular `critical.css` and `main.css` without altering layout.
- Unused inline styles and redundant selectors removed during the HTML refactor (`index.html`).

These deletions were safe because all relevant declarations were migrated into the new structured CSS files, and visual regression checks confirmed parity with the previous design.

## Component Patterns
- **Navigation (`.site-nav`)**: Flex layout with accessible toggle/ARIA hooks consumed by `navbar.js`.
- **Hero (`.hero`)**: Uses shared tokens for typography, button utilities, and motion, allowing quick thematic adjustments.
- **Cards (`.project-card`, `.game-card`)**: Share badge and button utilities, keeping markup lightweight while ensuring consistent styling.

This structure enables future sections to plug into the existing utility tokens and naming scheme without introducing new global styles.
