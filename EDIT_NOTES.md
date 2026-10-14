# Edit notes

## Intro (loading → video reveal)

- Matches Reference/Loading.zip: a strip grows with real loading progress, holds at 100, opens to full height,
  and the video spins in from the centre: scale 0 → 1, rotation −20° → 0, inset 20% → 0 over 1.25s
  with the reference's `.87,0,.13,1` ease. Text then rises out of masks from 0.75s with a 0.125s stagger.
- Runs on CSS transitions keyed on `data-intro` (src/useIntro.ts, index.css), so the browser compositor
  drives the motion. The video plays hidden during loading, so it is already moving when it appears.
- The reveal's animations are created during a 0.3s hold (`--intro-hold`) while the full strip stands still;
  setting them up costs the browser a few frames, and this keeps that off the visible motion.
- Waits for fonts and playable video; falls back to the poster after 6s. Skip intro is available;
  reduced-motion users skip the intro.

## Video

- `public/media/hero.mp4` — 1920×1080, desktop and tablets.
- `public/media/hero-mobile.mp4` — 720×1280 portrait crop of the 4K source for phones in portrait
  (8 MB instead of 17.6 MB). Same framing as the desktop file on a phone; switches if the phone is rotated.

## Logo

- `therapy-office-logo-light.png` — ivory type with a wheat-gold O, used over the video.
- `therapy-office-logo-dark.png` — charcoal type with a deeper olive O, used on the menu, dialogs and loading screen.
- Both are recoloured and trimmed from `therapy-office-logo-green.png` (unchanged original).
  The header crossfades from the light to the dark logo as the menu opens.

## Menu

- Warm beige background (`--menu-bg: #ebe0cb`).
- Hover: the link eases right as a fine olive line draws in beneath it; the other links fade back.

## Mobile

- Hero is a flex column (min-height 100svh), so content never overflows on short screens.
- Title sizes to the screen width so "Healing Starts / Here" always breaks into two lines.
- Dedicated layouts for short phones (e.g. iPhone SE) and phones held sideways (2×2 menu).
- Soft shade at the bottom of the video on phones keeps text readable when the moons pass behind it.
- Hover effects only apply on devices that can hover, so taps don't leave them stuck.
