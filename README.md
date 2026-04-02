# An Evening of Coming Home

An interactive nine-panel digital comic in the mystery/horror genre, created as a Communications Lab project at NYU Abu Dhabi.

**Team:** Daria, Mariam, Prakrati, Sudiksha  
**Course:** Communications Lab — Project #2

## About

*An Evening of Coming Home* follows a mysterious figure returning to a house that feels eerily empty. Rather than telling its story linearly, the experience unfolds through user interaction — every panel contains at least one interactive element, and the narrative is discovered through exploration.

The story gradually shifts from ordinary domestic unease to something much darker, culminating in the revelation that the figure never made it home at all. The ending is intentionally open: the blurred line between observer and inhabitant is part of the experience.

## Panels & Interactions

| Panel | Scene | Key Interaction |
|-------|-------|-----------------|
| 1 | Front of the house | 3D door swing animation → zoom transition inside |
| 2 | Living room | Dust-cleaning on portrait, readable note, hallway door |
| 3 | Staircase *(Dasha)* | Light flicker on load, lock panel with code input |
| 4 | Basement *(Mariam)* | Hover reveal on cardboard box |
| 5–6 | Basement / Hospital clue | Drag-and-drop puzzle assembly |
| 7 | Hospital room | Scroll-driven monitor animation: heartbeat → flatline |
| 8 | Hospital room | GSAP zoom-in on monitor |
| 9 | Darkness | Final text reveal |

## Technical Highlights

**Panel 1 & 2 (Sudiksha):** The door uses CSS `perspective` on the parent and `rotateY` on the child with `transform-origin: left center` to create a 3D inward swing. Interactive hotspots glow using `filter: drop-shadow` with a `@keyframes` pulse — `box-shadow` was abandoned because it draws a rectangle around the element rather than tracing its shape. The dust-cleaning portrait uses `destination-out` compositing with a radial gradient brush for a natural smearing feel, with an auto-sweep triggered at 40% completion.

**Panel 3 (Dasha):** A `flicker()` function fires on page load, toggling canvas opacity between `0.15` and `1` four times at 120ms intervals to simulate an old lightbulb. The lock panel checks a six-digit code by concatenating individual input values, highlights fields red on failure, and fades to the next panel on success. Cross-panel navigation used `localStorage` to preserve the correct starting panel when navigating back from Panel 3 to Panel 2 (which shares an HTML file with Panel 1).

**Panel 4 (Mariam):** An SVG of an open box overlays the background image and appears on hover. Transparent SVG backgrounds were causing the hover to trigger anywhere on the canvas; the fix was targeting `#IDName svg *{}` to restrict pointer events to drawn SVG elements only.

**Panels 5–8 (Prakrati):** The puzzle uses a click-to-pick, click-to-place model with bounding box calculations to validate placement by quadrant. Pieces snap, deactivate, and increment a counter; all four correct placements trigger narrative progression. The hospital monitor transition uses [GSAP](https://gsap.com/) for synchronized zoom and state-change animations that simpler CSS libraries couldn't achieve.

## Visual Assets

Assets were created using a combination of Figma, Adobe Illustrator, Adobe Photoshop, Procreate, Canva, and Nano Banana AI for image generation. SVG elements were built from scratch in Illustrator.

## Built With

- HTML / CSS / JavaScript
- [GSAP](https://gsap.com/) — advanced animation sequencing
- [AOS](https://michalsnik.github.io/aos/) — scroll animations
- [Rellax](https://dixonandmoe.com/rellax/) — parallax
- Figma, Adobe Illustrator, Adobe Photoshop, Procreate, Canva

## References

- [Pixabay](https://pixabay.com/) — sound effects
- [CodePen — door animation](https://codepen.io/Deemo/pen/nXqyoa)
- [CodePen — glow effect](https://codepen.io/am_eu/pen/EgedaQ)
- [GSAP docs](https://gsap.com/docs/v3/)
- [Procreate](https://procreate.com/)
- W3Schools — HTML, CSS, browser JavaScript reference
