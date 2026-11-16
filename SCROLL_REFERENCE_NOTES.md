# Scroll reference adaptation

Status: Removed from the website at the user's request on November 16, 2026. The hero now leads directly to the approach section. The notes and generated image files below are retained as design history.

Reference video: C:/Users/bosuf/Downloads/scroll-49-650.mp4
Reference source: C:/Users/bosuf/Downloads/code (19).zip
Local preview: http://127.0.0.1:5173/

This section sits between the hero and Feel Understood, Grow Stronger. Three full-viewport portraits use the original GSAP image range (-50% to +50%) and marquee scale (1.5 to 0.5), with start top/bottom and end bottom/top. Lenis uses syncTouch and the reference's mandatory snapping: 500 ms debounce, 0.9 seconds, quartic ease-out. The repeated curved headline and Ms Madi script track were reconstructed from the supplied video because the supplied HTML contains pictures but omits the SVG marquee markup. The website continues into the next section after the three images; the standalone demo's page-wide infinite loop is intentionally not applied to the whole website. Reduced-motion mode shows static images and text.

Words: THERAPIST. / Counselor; THERAPY. / Connection; SUPPORT. / Together. Colors are ivory, sand and warm stone. The site's Instrument Serif typography is retained outside this reference animation. The reference's Druk Trial and Ms Madi typefaces are locally served for the animation; Druk is a trial font asset from the reference font provider.

## Final image files and prompts

Mode: built-in image generation, editing the three supplied reference photographs individually. The supplied face photograph is the identity reference. Original compositions, poses, props, framing and lighting were requested to be preserved; the first red backdrop was recolored to taupe. PNG masters are retained, with smaller WebP copies used on the website.

### anna-reference-01

Final website asset: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-01.webp
PNG master: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-01.png
Edit target: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/Reference/scroll-parallax/infinite-scroll-with-parallax-main/assets/01.webp
Face reference: C:/Users/bosuf/AppData/Local/Temp/codex-clipboard-f2288eb8-3e0b-4ccd-affc-ea84278dfc25.png

Use case: identity-preserve, precise face swap. Image 1 is the EDIT TARGET and must remain the base photograph. Image 2 is ONLY the replacement facial identity reference, supplied as Anna. Replace ONLY the facial identity of the woman in image 1 with the recognizable face from image 2. Preserve image 1's exact camera angle, head tilt, facial expression, hairstyle, body, pose, outfit, background geometry, props, hands, crop, photographic grain, and directional lighting. Do not turn this into a new seated studio portrait. Preserve composition aggressively. Match the inserted face to the original scene's light and perspective, preserve realistic skin texture and seamless facial edges. Final aspect ratio and framing exactly match image 1. Keep the original low-angle head-and-shoulders portrait, dark jacket, loose blonde hair, serious expression, and its dramatic side lighting. The ONLY additional change is palette: replace the saturated red backdrop and red/orange light with muted warm stone and taupe lighting, within ivory, cream, sand, taupe and stone. Keep all scene detail and shading. No new objects or text.

### anna-reference-02

Final website asset: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-02.webp
PNG master: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-02.png
Edit target: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/Reference/scroll-parallax/infinite-scroll-with-parallax-main/assets/02.webp
Face reference: C:/Users/bosuf/AppData/Local/Temp/codex-clipboard-f2288eb8-3e0b-4ccd-affc-ea84278dfc25.png

Use case: identity-preserve, precise face swap. Image 1 is the EDIT TARGET and must remain the base photograph. Image 2 is ONLY the replacement facial identity reference, supplied as Anna. Replace ONLY the facial identity of the woman in image 1 with the recognizable face from image 2. Preserve image 1's exact camera angle, head tilt, facial expression, hairstyle, body, pose, outfit, background geometry, props, hands, crop, photographic grain, and directional lighting. Do not turn this into a new seated studio portrait. Preserve composition aggressively. Match the inserted face to the original scene's light and perspective, preserve realistic skin texture and seamless facial edges. Final aspect ratio and framing exactly match image 1. Keep the original very tight close-up, joyful winking expression, smile with teeth, diagonal film clapperboard occluding the left half of the face, both hands and exact finger placement, all existing clapperboard lettering and lines, hair, framing, and grain. Retain the monochrome photograph, with only the very faintest warm stone/ivory toning. Do not remove or redesign the clapperboard. No new objects or text.

### anna-reference-03

Final website asset: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-03.webp
PNG master: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/sanctuary/public/media/anna-reference-03.png
Edit target: C:/Users/bosuf/OneDrive/Desktop/pyschologist website/Reference/scroll-parallax/infinite-scroll-with-parallax-main/assets/03.webp
Face reference: C:/Users/bosuf/AppData/Local/Temp/codex-clipboard-f2288eb8-3e0b-4ccd-affc-ea84278dfc25.png

Use case: identity-preserve, precise face swap. Image 1 is the EDIT TARGET and must remain the base photograph. Image 2 is ONLY the replacement facial identity reference, supplied as Anna. Replace ONLY the facial identity of the woman in image 1 with the recognizable face from image 2. Preserve image 1's exact camera angle, head tilt, facial expression, hairstyle, body, pose, outfit, background geometry, props, hands, crop, photographic grain, and directional lighting. Do not turn this into a new seated studio portrait. Preserve composition aggressively. Match the inserted face to the original scene's light and perspective, preserve realistic skin texture and seamless facial edges. Final aspect ratio and framing exactly match image 1. Keep the original extreme close-up, crystal prism held in front of one eye, multiple reflected eyes within the facets, exact hand pose, black nail polish, drawn eye symbols on the hand, bracelet, dark lipstick and photographic scratch/grain texture. Replace the visible facial features AND the facial features reflected in the crystal with the identity from image 2. Keep the original hair and makeup styling. Color grade only toward subdued stone, warm taupe and ivory; preserve existing contrast and light. Do not remove any props or symbols. No new objects or text.


## Verification

TypeScript and production build passed. Browser checks passed at 1132×650, 1440×1000, 768×1024, 390×844 and 320×568. Verified matching image/text transforms, both moving text tracks, forward and reverse mandatory snapping, a mobile touch swipe, scroll exit into the approach section, navigation bypassing sequence snapping, menu background locking, consultation/Escape, reduced-motion mode, and no horizontal overflow or browser errors. WebP images total approximately 702 KiB. Detailed measurements: ../.review/reference-match-checks.json. Build reports one 519 kB application chunk (173 kB gzip).
