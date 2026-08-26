/* ------------------------------------------------------------------
   Clubhouse Co - product data

   BALLS is listed in TRAY ORDER, which is column-major: entries 1-3 fill
   the first column top to bottom, 4-6 the second, and so on. The tray uses
   grid-auto-flow: column to match. Reordering this array reorders the tray.

   `img` points at assets/img/. If the file is missing the ball falls back to
   the drawn sphere, so the tray never breaks. See assets/img/SOURCES.md for
   which product photo belongs in each slot.

   Specs are manufacturer-published figures - verify before launch.
------------------------------------------------------------------- */

const BRANDS = {
  titleist:    { name: 'Titleist',    accent: '#A8172B' },
  callaway:    { name: 'Callaway',    accent: '#16345E' },
  taylormade:  { name: 'TaylorMade',  accent: '#2E2E2E' },
  bridgestone: { name: 'Bridgestone', accent: '#B26A22' },
  srixon:      { name: 'Srixon',      accent: '#D8232A' }
};

const BALLS = [
  /* ---------------- column 1 - Titleist ---------------- */
  {
    id: 'prov1-white', brand: 'titleist', name: 'Pro V1', colour: 'White', line: 'Tour',
    img: 'assets/img/prov1-white.png',
    tagline: 'The most played ball in golf.',
    blurb: 'Penetrating flight, drop-and-stop greenside control and the consistency that has defined tour golf for two decades.',
    layers: '3-piece', compression: 87, cover: 'Cast Urethane Elastomer',
    feel: 'Soft', spin: 'Mid', launch: 'Mid', dimples: 388,
    bestFor: 'Players who want total control without giving up distance.',
    price: 5.75
  },
  {
    id: 'prov1-green', brand: 'titleist', name: 'Pro V1', colour: 'Green', line: 'Tour',
    img: 'assets/img/prov1-green.png',
    tagline: 'The same ball, easier to find.',
    blurb: 'Identical construction and performance to the white Pro V1, finished in a high-visibility green that stands out against fairway and rough.',
    layers: '3-piece', compression: 87, cover: 'Cast Urethane Elastomer',
    feel: 'Soft', spin: 'Mid', launch: 'Mid', dimples: 388,
    bestFor: 'Pro V1 players who lose sight of a white ball in flight.',
    price: 5.75
  },
  {
    id: 'prov1x-left-dash', brand: 'titleist', name: 'Pro V1x Left Dash', colour: 'White', line: 'Tour',
    img: 'assets/img/prov1x-left-dash.png',
    tagline: 'The tour-only ball, released.',
    blurb: 'Highest flight and lowest long-game spin of the family, with a notably firm feel. Built originally as a tour custom request.',
    layers: '4-piece', compression: 108, cover: 'Cast Urethane Elastomer',
    feel: 'Firm', spin: 'Low', launch: 'High', dimples: 348,
    bestFor: 'High speed players fighting too much driver spin.',
    price: 5.75
  },

  /* ---------------- column 2 - Callaway ---------------- */
  {
    id: 'chrome-tour-trutrack-usa', brand: 'callaway', name: 'Chrome Tour TruTrack', colour: 'USA', line: 'Tour',
    img: 'assets/img/chrome-tour-trutrack-usa.png',
    tagline: 'Alignment you can read at speed.',
    blurb: 'The Chrome Tour with a full TruTrack alignment wrap in a stars-and-stripes USA finish - easy to line up, easy to spot.',
    layers: '4-piece', compression: 75, cover: 'Urethane',
    feel: 'Soft', spin: 'Mid-High', launch: 'Mid', dimples: 332,
    bestFor: 'Players who line up putts with the ball.',
    price: 5.50
  },
  {
    id: 'chrome-tour-triple-track', brand: 'callaway', name: 'Chrome Tour Triple Track', colour: 'White', line: 'Tour',
    img: 'assets/img/chrome-tour-triple-track.png',
    tagline: 'Three lines, one target.',
    blurb: 'Chrome Tour performance with Triple Track markings, which use Vernier visual acuity to sharpen alignment on the green.',
    layers: '4-piece', compression: 75, cover: 'Urethane',
    feel: 'Soft', spin: 'Mid-High', launch: 'Mid', dimples: 332,
    bestFor: 'Anyone who wants more help aiming the putter face.',
    price: 5.50
  },
  {
    id: 'chrome-tour', brand: 'callaway', name: 'Chrome Tour', colour: 'White', line: 'Tour',
    img: 'assets/img/chrome-tour.png',
    tagline: 'Soft feel, tour control.',
    blurb: 'A hyper-fast core wrapped in a seamless urethane cover - exceptionally soft off the face with genuine tour-level greenside spin.',
    layers: '4-piece', compression: 75, cover: 'Urethane',
    feel: 'Soft', spin: 'Mid-High', launch: 'Mid', dimples: 332,
    bestFor: 'Golfers who chase feel without losing bite.',
    price: 5.50
  },

  /* ---------------- column 3 - TaylorMade ---------------- */
  {
    id: 'tp5x', brand: 'taylormade', name: 'TP5x', colour: 'White', line: 'Tour',
    img: 'assets/img/tp5x.png',
    tagline: 'The fastest of the five.',
    blurb: 'A firmer, higher-launching five-layer tour ball built for speed - longer off the tee with a flatter, more penetrating flight.',
    layers: '5-piece', compression: 97, cover: 'Cast Urethane',
    feel: 'Firm', spin: 'Mid-High', launch: 'High', dimples: 322,
    bestFor: 'High swing speeds chasing every last yard.',
    price: 5.50
  },
  {
    id: 'tp5x-pix', brand: 'taylormade', name: 'TP5x pix', colour: 'Pix', line: 'Tour',
    img: 'assets/img/tp5x-pix.png',
    tagline: 'See the spin.',
    blurb: 'TP5x carrying the ClearPath pix pattern - high-contrast markings that make ball flight and roll far easier to read.',
    layers: '5-piece', compression: 97, cover: 'Cast Urethane',
    feel: 'Firm', spin: 'Mid-High', launch: 'High', dimples: 322,
    bestFor: 'Players who want visual feedback on strike and roll.',
    price: 5.50
  },
  {
    id: 'tp5x-stripe', brand: 'taylormade', name: 'TP5x Stripe', colour: 'Stripe', line: 'Tour',
    img: 'assets/img/tp5x-stripe.png',
    tagline: 'A full band to aim with.',
    blurb: 'TP5x finished with a continuous stripe around the ball, giving a long alignment reference from any angle on the green.',
    layers: '5-piece', compression: 97, cover: 'Cast Urethane',
    feel: 'Firm', spin: 'Mid-High', launch: 'High', dimples: 322,
    bestFor: 'Putters who line up along a full equator line.',
    price: 5.50
  },

  /* ---------------- column 4 - Bridgestone + Srixon ---------------- */
  {
    id: 'tour-b-x', brand: 'bridgestone', name: 'Tour B X', colour: 'White', line: 'Tour',
    img: 'assets/img/tour-b-x.png',
    tagline: 'Straight distance, engineered.',
    blurb: 'A reactive cover that reads impact - resisting on the tee for distance, absorbing on wedges for spin.',
    layers: '3-piece', compression: 85, cover: 'Reactive Urethane',
    feel: 'Mid', spin: 'Mid', launch: 'Mid', dimples: 338,
    bestFor: 'Swing speeds over 105 mph wanting tighter dispersion.',
    price: 5.25
  },
  {
    id: 'tour-b-x-2', brand: 'bridgestone', name: 'Tour B X', colour: 'White', line: 'Tour',
    img: 'assets/img/tour-b-x.png',
    tagline: 'Straight distance, engineered.',
    blurb: 'A reactive cover that reads impact - resisting on the tee for distance, absorbing on wedges for spin.',
    layers: '3-piece', compression: 85, cover: 'Reactive Urethane',
    feel: 'Mid', spin: 'Mid', launch: 'Mid', dimples: 338,
    bestFor: 'Swing speeds over 105 mph wanting tighter dispersion.',
    price: 5.25
  },
  {
    id: 'z-star-diamond', brand: 'srixon', name: 'Z-Star Diamond', colour: 'White', line: 'Tour',
    img: 'assets/img/z-star-diamond.png',
    tagline: 'Born from a major win.',
    blurb: 'A tour prototype turned retail ball - Z-Star flight with extra greenside bite from the Spin Skin coating.',
    layers: '3-piece', compression: 102, cover: 'Urethane with Spin Skin',
    feel: 'Mid-Firm', spin: 'High', launch: 'Mid-High', dimples: 338,
    bestFor: 'Wedge players who want maximum stopping power.',
    price: 5.00
  }
];

/* ---------------------------- Shop products ---------------------------- */

const PRODUCTS = [
  {
    id: 'tour-twelve',
    name: 'The Tour Twelve',
    kicker: 'Signature Variety Pack',
    desc: 'Twelve tour balls from Titleist, Callaway, TaylorMade, Bridgestone and Srixon, presented in the Clubhouse keepsake box.',
    price: 79, compare: 92, badge: 'Best Seller', art: 'box-navy'
  },
  {
    id: 'the-six',
    name: 'The Sleeve Six',
    kicker: 'Half Dozen Sampler',
    desc: 'Six premium balls, two sleeves, one beautifully small box. The go-to for a thank-you or a stocking.',
    price: 44, compare: null, badge: null, art: 'box-bone'
  },
  {
    id: 'greenskeeper',
    name: 'The Greenskeeper Set',
    kicker: 'Accessory Trio',
    desc: 'Milled brass divot tool, magnetic ball marker and a waffle-weave caddie towel in Clubhouse navy.',
    price: 96, compare: null, badge: 'New', art: 'tools'
  },
  {
    id: 'own-dozen',
    name: 'Create Your Own Dozen',
    kicker: 'Build to Order',
    desc: 'Choose any twelve from our full range. Packed in the same keepsake box, with an optional foil-stamped card.',
    price: 79, compare: null, badge: null, art: 'grid', from: true
  },
  {
    id: 'corporate-12',
    name: 'The Corporate Twelve',
    kicker: 'Client Gifting',
    desc: 'The Tour Twelve with your logo foil-stamped on the lid. Minimum ten boxes, four-week lead time.',
    price: 89, compare: null, badge: null, art: 'foil'
  },
  {
    id: 'tee-set',
    name: 'Hardwood Tee Set',
    kicker: 'Accessories',
    desc: 'One hundred lacquered birch tees in a reusable brass-clasped tin. Two lengths, one very good tin.',
    price: 32, compare: null, badge: null, art: 'tin'
  }
];
