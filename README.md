# Clubhouse Co. — landing page

A static, dependency-free landing page for Clubhouse Co. No build step: open `index.html`
or serve the folder.

```bash
python -m http.server 5173 --directory clubhouse-co
```

## Files

| File | What's in it |
| --- | --- |
| `index.html` | All page markup: header/mega-nav, hero, collection, story, dozen builder, gifting, corporate, reviews, signup, footer |
| `assets/css/styles.css` | Design tokens, the 3D box, and every section. Sections are numbered in the file header |
| `assets/js/data.js` | **Edit this first.** The 12 balls (in tray order) and the 6 shop products |
| `assets/img/SOURCES.md` | Which product photo belongs in which tray slot |
| `assets/js/main.js` | Nav, hero scroll animation, ball explorer, dozen builder, cart counter, forms |

## The hero

`#heroTrack` is 360vh tall and `#heroStage` sticks inside it. Scroll position maps to a
0–1 progress value which `apply()` in `main.js` writes to CSS custom properties on `:root`:

| Var | Range | Effect |
| --- | --- | --- |
| `--open` | 0 -> 104deg | lid swings up and out on its hinge |
| `--zoom` | -520 -> 500px | camera pulls back, then pushes into the tray |
| `--rise` | 0.18h -> 0 (or -0.12h small) | box drops for the opening shot, then centres |
| `--tilt` | 26 -> 4deg | box flattens to face the viewer |
| `--spin` | -16 -> 0deg | box squares up |
| `--shift` | 110 -> -135px | slides left to clear the info card (0 on small screens) |
| `--copyfade` | 1 -> 0 by p=0.20 | headline clears before the lid sweeps through it |
| `--wallfade` / `--lidfade` | 1 -> 0.18 | walls and lid recede to a faint presence, never to zero |

### Two things that will bite you

**Which lid face shows is switched explicitly, not by `backface-visibility`.**
`.lid__top` is the navy exterior, `.lid__in` the gold interior with navy print.
Relying on `backface-visibility: hidden` did not hold here - the navy face stayed
painted past edge-on and showed through vertically mirrored. `apply()` now toggles
`.is-flipped` on the lid and the faces swap with `visibility`, so a hidden face
genuinely cannot bleed through.

The threshold is `tilt + open > 90`, **not** 90deg of lid opening. The box itself is
tilted 26deg at that point in the animation, so the lid plane goes edge-on when the two
rotations sum to 90 - around 64deg of opening, not 90. Using the opening angle alone
leaves the lid navy through the first third of its swing. Both rotations are about X so
they add; the swap lands exactly where the lid is edge-on and has no projected area, so
it is invisible.

**`--lidfade` floors at 0.18, and it is applied to the faces, not to `.lid`.** The lid
settles to a faint presence above the tray instead of vanishing - roughly a quarter of
it is still in frame at full zoom. The fade sits on `.lid__top` / `.lid__in` /
`.lid__lip` rather than on `.lid`, because an opacity below 1 on the element that
establishes the 3-D context can flatten it, which would land the gold face's
`rotateX(180deg)` as a plain vertical mirror.

**The back face must flip about the SAME axis the lid swings on.** `.lid__in` uses
`rotateX(180deg)`. `rotateY(180deg)` - the usual flip-card idiom, which assumes a
Y-axis swing - composes with the lid's X rotation into a 180deg turn in the plane, and
the print comes out upside down and reversed. Measured: with `rotateY` the face's
top-left-to-bottom-right vector was (-415, -39); with `rotateX` it is (+415, +39),
matching the front face.

**The lid must rotate a POSITIVE angle.** The hinge (`.lidhinge`) is parked on the
box's top-front lip and the lid pivots on that edge. A positive `rotateX` swings it
out through the opening (local +Z, toward the camera) and up. A negative angle sends
it to local -Z which, after the box's tilt, is *down and behind* - the lid opens into
the box. Putting a `translateZ` in the same transform as the rotation is also wrong:
that pivots the lid about the box's mid-depth centre instead of its lip.

**The 3-D rig must not eat pointer events.** `.box` sits at z=0 with the tray behind
it at z=-29, so the transparent container would otherwise swallow every hover before
it reached a ball. `.box` is `pointer-events: none` and only `.ball__sphere` opts back
in - the sphere, not its grid cell, because the sphere is pushed 30px toward the
camera and no longer lines up with the cell. The decorative overlays
(`.hero__explorehead`, `.hero__scroll`, and `.hero__copy` once `.is-lifting`) are
`pointer-events: none` for the same reason.

Also note the box is sized in `vh`, not fixed pixels: an open lid stands ~400px proud
of its hinge, so a fixed-size box clips off the top of a short viewport.

Past progress `0.62` the stage gets `.is-open`: the tray becomes interactive, the info card
slides in, and the headline fades out. Hovering (or tapping, or tabbing to) a ball calls
`setActive()`, which renders the card and draws the SVG leader line from the ball's edge to
the card. The line is recomputed on every animation frame while a ball is active, so it
stays attached while the box is still moving.

The tray fills **column-major** (`grid-auto-flow: column`): entries 1-3 of `BALLS`
are the left column top to bottom, 4-6 the second, and so on, so each brand occupies
its own column. Reordering the array reorders the tray.

Each ball may carry an `img`. The photo is layered over the drawn sphere and only
reveals itself on a successful `load`, so a missing or blocked file leaves the drawn
ball in place rather than a broken image. `assets/img/SOURCES.md` lists the filename
and source URL for every slot.

The highlight clears the moment the pointer is not on a ball - a `pointermove` listener
on the stage calls `setActive(-1)` unless the target is inside a `.ball` or the
`.ballcard`. The card is excluded so you can move onto it and press "Add to dozen"
without the selection evaporating on the way.

To retune the animation, change the numbers in `apply()`. To change the box proportions,
change `--bw` / `--bh` / `--bd` in `:root`.

## Palette

Taken from the keepsake box. All of it lives in `:root` in `styles.css`.

| Token | Value | Where it comes from |
| --- | --- | --- |
| `--ink` | `#101736` | deepest navy — hero, footer, dark sections |
| `--navy` | `#232F56` | the box exterior |
| `--gold` | `#C4A463` | foil stamping |
| `--gold-2` | `#E2CE9C` | foil highlight |
| `--gold-3` | `#DCC17E` | the printed gold interior |
| `--bone` | `#F6F4EF` | page background |

The hero box mirrors the real thing: navy outside, gold-printed interior walls,
navy insert under the balls. The lid has two faces — `.lid__top` (navy, gold foil)
and `.lid__in` (gold, navy print) — swapped by `backface-visibility` as it opens.

## A gotcha worth keeping

`overflow-x` belongs on `<html>` only, never on `<body>` as well. Setting it on both
makes body compute to `overflow-y: auto`, which turns it into a scroll container and
silently kills `position: sticky` in the hero — the box pins forever and everything
below reads as blank. There is a comment marking this in `styles.css`.

## Swapping in real assets

Product imagery is currently drawn in CSS — the `art--*` classes near the bottom of the
"Sections" block. Replace each `.pcard__media` div with an `<img>` and delete the matching
`art--*` rule. The lid faces in the hero (`.lid__top` and `.lid__in`) are the place to drop in your
real packaging shots: both accept a `background-image` at 640x460.

## "Open the box" button

`window.scrollTo({behavior:'smooth'})` has no duration control, so `smoothScrollTo()`
in main.js drives it by hand over 1300ms.

The curve is **linear, deliberately**. The box's phases are keyed to scroll progress,
so the scroll curve decides how long each phase gets. An ease-in-out here spent
~380ms barely moving before the lid started, then raced the middle. Measured against
the real page geometry:

| curve | motion starts | lid opening | zoom |
| --- | --- | --- | --- |
| ease-in-out @1800 | 380ms | 438ms | 965ms |
| ease-in-out @1300 | 274ms | 317ms | 697ms |
| **linear @1300** | **49ms** | **439ms** | **779ms** |

Note the middle row: shortening the duration while keeping the ease makes the lid
*faster*, not slower. Linear starts almost immediately and still gives the opening
the same time the old 1800ms version did. The frame lerp in `frame()` supplies the
ease-in and settle, so the input does not need its own.

A token guards a rapid double-click: a second click bumps it and the first loop's
`step()` stops. `prefers-reduced-motion` still jumps straight there.

## Mobile

The page is built mobile-first below 1000px: the nav collapses to a drawer, the info
card becomes a bottom sheet, the box neither slides sideways nor drops (it would leave
the screen), and search/account icons fold into the drawer below 640px, leaving
burger + logo + cart. Tap targets are >=40px, form inputs are 16px (anything smaller
makes iOS Safari zoom the page on focus), heights use `dvh` where the collapsing
Safari URL bar matters, and safe-area insets pad the top bar and footer.

The hero has three layouts, not two. Desktop puts the copy left and slides the box
right. Portrait phones/tablets put the copy at the TOP of the stage with the box
below it - centring both, as desktop does vertically, stacked the headline directly
on top of the box. Short landscape (`max-height:520px`) has no room to stack at any
type size, so it returns to copy-left / box-right and drops the supporting paragraph.

On the stacked layout the box's drop is MEASURED, not a fraction of the viewport
(`measureStack()` in main.js). The copy's rendered height moves with viewport width,
font loading and Safari's collapsing URL bar, so a fixed fraction put the lid on top
of the buttons at ~660px tall while looking fine at 812. It measures the union of
`#box` and `#lid` - the lid extends past the box's own border box - and centres the
box in whatever space is left below the copy. Re-run on resize, on visualViewport
resize, and after `document.fonts.ready`.

The explorer heading (`.hero__explorehead`) is hidden below 1000px: once the box is
open it fills the stage, so the heading sat directly on top of the ball grid.

Watch out for circular custom properties in the box tokens: above 640px `--bw` is
derived from `--bh`, so a media query defining `--bh` from `--bw` resolves to invalid
and the box collapses to zero height. Derive from `vh` in those blocks.

Scroll detection is quadruple-redundant (window, document capture, visualViewport,
and a per-frame scrollY watchdog), and if animation frames stop being serviced -
background tab, frozen compositor - `onScroll` lands the state directly instead of
waiting for a frame that may never come. Asset links in `index.html` carry a `?v=N`
query: bump it whenever you edit CSS/JS, or browsers (and GitHub Pages' CDN) will
serve the stale file.

## Wiring up commerce

`main.js` keeps cart state in memory only — `bumpCart()`, the `dozen` array, and both form
handlers are the integration points. Swap them for your Shopify / Stripe / backend calls;
nothing else in the page depends on how they work.

## Notes

- Balls are real current-model specs from public manufacturer figures. Check them before launch.
- Brand names are used descriptively; the footer carries a trademark line.
- `prefers-reduced-motion` disables the scroll smoothing and transitions.
