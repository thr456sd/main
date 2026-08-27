/* ==================================================================
   Clubhouse Co. — interactions
================================================================== */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  /* progress of x through [a,b], eased */
  const seg = (x, a, b) => clamp((x - a) / (b - a), 0, 1);
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const money = n => '$' + n.toFixed(2);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll range over which the lid swings open. Shared so the "Open the box"
     sequence and apply() can never drift out of sync. */
  const LID_P0 = 0.02, LID_P1 = 0.55;

  /* ---------------------------------------------------------------
     Header state
  --------------------------------------------------------------- */
  const header = $('#header');
  const heroTrack = $('#heroTrack');
  const topbar = $('#topbar');
  const root = document.documentElement;

  const docTop = el => el.getBoundingClientRect().top + window.scrollY;
  const topbarH = () => (topbar ? topbar.offsetHeight : 0);

  /* The banner + header bar is always on screen, so the hero sits below it. */
  function syncTopH() {
    root.style.setProperty('--topH', topbarH() + 'px');
  }

  function headerState() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  /* ---------------------------------------------------------------
     Navigation (desktop hover menus + mobile drawer)
  --------------------------------------------------------------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const items = $$('.nav__item');
  const isMobileNav = () => window.matchMedia('(max-width:1000px)').matches;

  function closeMenus(except) {
    items.forEach(i => { if (i !== except) i.classList.remove('is-open'); });
    items.forEach(i => {
      const b = $('.nav__link', i);
      if (b) b.setAttribute('aria-expanded', i.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  items.forEach(item => {
    const link = $('.nav__link', item);

    link.addEventListener('click', e => {
      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeMenus(item);
      item.classList.toggle('is-open', willOpen);
      link.setAttribute('aria-expanded', String(willOpen));
    });

    item.addEventListener('mouseenter', () => {
      if (isMobileNav()) return;
      closeMenus(item);
      item.classList.add('is-open');
      link.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', () => {
      if (isMobileNav()) return;
      item.classList.remove('is-open');
      link.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenus(); closeDrawer(); } });
  document.addEventListener('click', e => {
    if (!isMobileNav() && !e.target.closest('.nav')) closeMenus();
  });

  function openDrawer()  { nav.classList.add('is-open');  burger.setAttribute('aria-expanded', 'true');  document.body.style.overflow = 'hidden'; }
  function closeDrawer() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  burger.addEventListener('click', () => nav.classList.contains('is-open') ? closeDrawer() : openDrawer());
  $$('.mega a, .nav a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------------------------------------------------------------
     Build the tray of twelve balls
  --------------------------------------------------------------- */
  const tray = $('#tray');
  const stage = $('#heroStage');
  const lidEl = $('#lid');
  const boxEl = $('#box');
  const heroCopy = $('#heroCopy');

  /* Stacked layout = copy above, box below (portrait phones and tablets).
     Short landscape puts them side by side instead and needs no clearance. */
  const isStacked = () =>
    window.matchMedia('(max-width:1000px)').matches &&
    !window.matchMedia('(max-height:520px)').matches;

  /* How far the box must drop to clear the copy. It depends on the copy's
     RENDERED height, which moves with viewport width, font loading and Safari's
     collapsing URL bar - a fixed fraction of the viewport gets this wrong on
     real phones (the lid was landing on the buttons at ~660px tall). The lid
     extends past the box's own box, so the union of the two is what matters. */
  let stackedRise = 0;
  function measureStack() {
    if (!isStacked()) { stackedRise = 0; return; }
    const prev = root.style.getPropertyValue('--rise');
    root.style.setProperty('--rise', '0px');
    const stageR = stage.getBoundingClientRect();
    const boxR = boxEl.getBoundingClientRect();
    const lidR = lidEl.getBoundingClientRect();
    const top = Math.min(boxR.top, lidR.top) - stageR.top;
    const bottom = Math.max(boxR.bottom, lidR.bottom) - stageR.top;
    const copyBottom = heroCopy.getBoundingClientRect().bottom - stageR.top;
    // Centre the box in the space left below the copy rather than just clearing
    // it, so the whitespace above and below the box is balanced.
    const stageH = stage.offsetHeight;
    const region = stageH - copyBottom;
    const desiredTop = copyBottom + Math.max(16, (region - (bottom - top)) / 2);
    const room = stageH - bottom - 10;              // never push it off-screen
    stackedRise = Math.max(0, Math.min(desiredTop - top, room));
    root.style.setProperty('--rise', prev);
  }
  const leader = $('#leader');
  const card = $('#ballcard');
  const cardEmpty = $('#ballcardEmpty');
  const cardBody = $('#ballcardBody');

  /* Only worth naming the colourway when it is not White and not already part
     of the product name ("TP5x pix" should not read "TP5x pix - Pix"). */
  const extraColour = ball =>
    ball.colour &&
    ball.colour !== 'White' &&
    ball.name.toLowerCase().indexOf(ball.colour.toLowerCase()) === -1;

  BALLS.forEach((ball, i) => {
    const b = document.createElement('button');
    b.className = 'ball';
    b.type = 'button';
    b.dataset.idx = i;
    b.style.setProperty('--bcolor', BRANDS[ball.brand].accent);
    b.setAttribute('aria-label', BRANDS[ball.brand].name + ' ' + ball.name +
      (extraColour(ball) ? ' - ' + ball.colour : ''));
    b.innerHTML =
      '<span class="ball__well"></span>' +
      '<span class="ball__ring"></span>' +
      '<span class="ball__sphere">' +
        '<span class="ball__mark">' + BRANDS[ball.brand].name + '</span>' +
        (ball.img ? '<img class="ball__photo" src="' + ball.img + '" alt="" loading="lazy" decoding="async">' : '') +
      '</span>' +
      '<span class="ball__no">' + String(i + 1).padStart(2, '0') + '</span>';
    tray.appendChild(b);

    // The photo only reveals itself once it has actually decoded, so a missing
    // or blocked file leaves the drawn sphere in place instead of a broken box.
    const photo = b.querySelector('.ball__photo');
    if (photo) {
      const show = () => b.classList.add('has-photo');
      if (photo.complete && photo.naturalWidth > 0) show();
      else photo.addEventListener('load', show, { once: true });
    }
  });

  const ballEls = $$('.ball', tray);
  let activeIdx = -1;

  const SPIN_SCALE = { 'Low': 34, 'Mid': 58, 'Mid-High': 76, 'High': 92 };

  function renderCard(ball) {
    const brand = BRANDS[ball.brand];
    const spin = SPIN_SCALE[ball.spin] || 60;
    cardBody.innerHTML =
      '<div class="bc__brandrow" style="--bcolor:' + brand.accent + '">' +
        '<span class="bc__swatch"></span>' +
        '<span class="bc__brand">' + brand.name + '</span>' +
        '<span class="bc__line">' + (extraColour(ball) ? ball.colour : ball.line) + '</span>' +
      '</div>' +
      '<h3 class="bc__name">' + ball.name + '</h3>' +
      '<p class="bc__tagline">' + ball.tagline + '</p>' +
      '<p class="bc__blurb">' + ball.blurb + '</p>' +
      '<div class="bc__specs">' +
        spec('Construction', ball.layers) +
        spec('Compression', ball.compression) +
        spec('Feel', ball.feel) +
        spec('Launch', ball.launch) +
      '</div>' +
      '<p class="bc__meta">' + ball.cover + ' cover &middot; ' + ball.dimples + ' dimples</p>' +
      '<div class="bc__meter">' +
        '<div class="bc__meterhead"><span>Greenside spin</span><span>' + ball.spin + '</span></div>' +
        '<div class="bc__meterbar"><i style="width:' + spin + '%"></i></div>' +
      '</div>' +
      '<p class="bc__best">' + ball.bestFor + '</p>' +
      '<div class="bc__foot">' +
        '<span class="bc__price">' + money(ball.price) + ' <span>/ ball</span></span>' +
        '<button class="btn btn--gold bc__add" data-add="' + ball.id + '">Add to dozen</button>' +
      '</div>';
    cardEmpty.hidden = true;
    cardBody.hidden = false;
  }

  function spec(k, v) {
    return '<dl class="bc__spec"><dt>' + k + '</dt><dd>' + v + '</dd></dl>';
  }

  function setActive(i) {
    if (i === activeIdx) return;
    activeIdx = i;
    ballEls.forEach((el, n) => el.classList.toggle('is-active', n === i));
    tray.classList.toggle('has-active', i > -1);
    if (i > -1) {
      renderCard(BALLS[i]);
      drawLeader();
    } else {
      leader.classList.remove('is-on');
      cardBody.hidden = true;
      cardEmpty.hidden = false;
    }
  }

  ballEls.forEach(el => {
    const i = +el.dataset.idx;
    el.addEventListener('pointerenter', () => setActive(i));
    el.addEventListener('focus', () => setActive(i));
    el.addEventListener('click', () => setActive(i));
  });

  /* Drop the highlight as soon as the pointer is not on one of the twelve.
     Hovering the info card counts as staying, so "Add to dozen" is reachable. */
  stage.addEventListener('pointermove', e => {
    if (activeIdx < 0) return;
    const t = e.target;
    if (t.closest && (t.closest('.ball') || t.closest('.ballcard'))) return;
    setActive(-1);
  });
  stage.addEventListener('pointerleave', () => setActive(-1));
  tray.addEventListener('focusout', () => {
    if (!tray.contains(document.relatedTarget)) setActive(-1);
  });

  cardBody.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (btn) addToDozen(btn.dataset.add);
  });

  /* ---------------------------------------------------------------
     Leader line: ball -> card
  --------------------------------------------------------------- */
  function drawLeader() {
    if (activeIdx < 0 || !stage.classList.contains('is-open') || window.innerWidth <= 1000) {
      leader.classList.remove('is-on');
      return;
    }
    const s = stage.getBoundingClientRect();
    const sphere = $('.ball__sphere', ballEls[activeIdx]);
    const b = sphere.getBoundingClientRect();
    const c = card.getBoundingClientRect();

    const bx = b.left + b.width / 2 - s.left;
    const by = b.top + b.height / 2 - s.top;
    const ax = c.left - s.left - 10;
    const ay = c.top - s.top + Math.min(c.height * 0.5, 130);
    const r  = Math.max(b.width, b.height) / 2 + 6;

    // start the line at the edge of the ball, not its centre
    const ang = Math.atan2(ay - by, ax - bx);
    const sx = bx + Math.cos(ang) * r;
    const sy = by + Math.sin(ang) * r;
    const dx = Math.max(60, (ax - sx) * 0.5);

    leader.setAttribute('viewBox', '0 0 ' + s.width + ' ' + s.height);
    leader.innerHTML =
      '<path d="M ' + sx + ' ' + sy + ' C ' + (sx + dx) + ' ' + sy + ', ' + (ax - dx) + ' ' + ay + ', ' + ax + ' ' + ay + '" opacity=".85"/>' +
      '<circle cx="' + sx + '" cy="' + sy + '" r="2.5"/>' +
      '<circle cx="' + ax + '" cy="' + ay + '" r="2.5"/>' +
      '<circle cx="' + bx + '" cy="' + by + '" r="' + r + '" fill="none" stroke="var(--gold)" stroke-width="1" opacity=".45"/>';
    leader.classList.add('is-on');
  }

  /* ---------------------------------------------------------------
     Scroll-driven box: open the lid, then fly into the tray
  --------------------------------------------------------------- */
  let target = 0, current = 0, ticking = false;

  function readProgress() {
    if (!heroTrack) return 0;
    const total = heroTrack.offsetHeight - stage.offsetHeight;
    if (total <= 0) return 0;
    return clamp((topbarH() - heroTrack.getBoundingClientRect().top) / total, 0, 1);
  }

  function apply(p) {
    /* Lid and camera run CONCURRENTLY and LINEARLY in scroll progress. They
       used to be sequential (lid 0.03-0.30, camera from 0.32) with an in-out
       ease on the lid; after "Open the box" that meant 1.6s of a small distant
       lid tilting while the camera sat still - which read as nothing happening.
       Now the camera starts pushing in almost as soon as the lid starts moving,
       and linear mapping keeps the pace consistent instead of flat-then-snap. */
    const lift  = seg(p, LID_P0, LID_P1);                  // lid swings up and out
    const fly   = seg(p, 0.08, 0.86);                      // camera pushes in
    const drift = ease(seg(p, 0.40, 0.86));                // slide left for the card

    root.style.setProperty('--p', p.toFixed(4));
    const openDeg = lift * 104;
    root.style.setProperty('--open', openDeg.toFixed(2) + 'deg');
    // Starts pulled back and dropped down the frame: an open lid stands ~400px
    // proud of its hinge, so box plus lid does not fit at full scale or centred.
    root.style.setProperty('--zoom', lerp(-520, 500, fly).toFixed(1) + 'px');
    // Small screens put the info card in a bottom sheet instead of beside the
    // box, so the tray ends up higher and never slides sideways -- the desktop
    // slide would push half the balls off a phone screen.
    const small = window.matchMedia('(max-width:1000px)').matches;
    const startRise = isStacked() ? stackedRise : 0.18 * window.innerHeight;
    const endRise = (small ? -0.12 : 0) * window.innerHeight;
    root.style.setProperty('--rise', lerp(startRise, endRise, fly).toFixed(1) + 'px');
    const tiltDeg = lerp(26, 4, fly);
    root.style.setProperty('--tilt', tiltDeg.toFixed(2) + 'deg');
    // The lid plane faces away once the box's tilt plus the lid's own opening
    // passes edge-on, and from then on we are looking at its gold interior.
    // The threshold is the SUM, not 90deg of opening: the box is tilted too.
    lidEl.classList.toggle('is-flipped', tiltDeg + openDeg > 90);
    root.style.setProperty('--spin', lerp(-16, 0, fly).toFixed(2) + 'deg');
    root.style.setProperty('--shift', (small ? 0 : lerp(110, -135, drift)).toFixed(1) + 'px');
    // Fades begin only after the lid finishes its swing at p=0.55 - fading a
    // lid that is still opening undercuts the reveal.
    root.style.setProperty('--wallfade', lerp(1, 0.18, seg(p, 0.58, 0.85)).toFixed(3));
    // The lid never vanishes -- it settles to a faint presence above the tray
    // rather than going to zero. ~25% of it is still in frame at full zoom.
    root.style.setProperty('--lidfade', lerp(1, 0.18, seg(p, 0.56, 0.78)).toFixed(3));
    // Headline clears out before the lid sweeps up through it.
    root.style.setProperty('--copyfade', (1 - ease(seg(p, 0.02, 0.20))).toFixed(3));

    stage.classList.toggle('is-lifting', p > 0.18);
    const open2 = p > 0.62;
    if (open2 !== stage.classList.contains('is-open')) {
      stage.classList.toggle('is-open', open2);
      if (!open2) leader.classList.remove('is-on');
    }
    if (activeIdx > -1) drawLeader();
  }

  let lastFrameAt = 0;

  function frame() {
    lastFrameAt = performance.now();
    current = reduced ? target : lerp(current, target, 0.14);
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    if (Math.abs(target - current) > 0.0002) requestAnimationFrame(frame);
    else ticking = false;
  }

  function onScroll() {
    target = readProgress();
    headerState();
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    // If animation frames are not being serviced (background tab, frozen
    // compositor), skip the smoothing and land the state directly - a stuck
    // hero is worse than an unsmoothed one.
    if (performance.now() - lastFrameAt > 250) { current = target; apply(current); }
  }

  /* Scroll can be reported different ways (window, an inner scroller caught at
     document in the capture phase, or only the visual viewport on some mobile
     browsers) - and some environments move scrollY without firing any of them.
     Listen everywhere, and keep a one-comparison-per-frame watchdog as the
     backstop so the hero can never freeze at p=0 while the page scrolls. */
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  if (window.visualViewport) visualViewport.addEventListener('scroll', onScroll, { passive: true });
  let lastY = -1;
  (function watchdog() {
    if (window.scrollY !== lastY) { lastY = window.scrollY; onScroll(); }
    requestAnimationFrame(watchdog);
  })();
  window.addEventListener('resize', () => { syncTopH(); measureStack(); onScroll(); drawLeader(); });
  /* Safari changes innerHeight as the URL bar collapses; re-measure then too. */
  if (window.visualViewport) visualViewport.addEventListener('resize', () => { measureStack(); onScroll(); });

  /* "Open the box": one continuous motion at constant rate. The lid opens and
     the camera pushes in together (the phases overlap in apply() now), so there
     is visible motion from the very first frame - no beat where only a small
     distant lid moves. Progress is applied DIRECTLY each frame rather than left
     to the scroll listeners, whose smoothing lerp would add its own lag on top. */
  const SEQ_MS = 2200;    // full reveal from a standing start
  const END_P  = 0.80;
  let scrollAnimToken = 0;

  function openBoxSequence() {
    const myToken = ++scrollAnimToken;
    const total = heroTrack.offsetHeight - stage.offsetHeight;
    const trackTop = docTop(heroTrack) - topbarH();
    const p0 = Math.min(readProgress(), END_P);
    /* Same rate regardless of starting point: a click halfway down the hero
       covers half the distance in half the time, not the same time. */
    const duration = Math.max(1, SEQ_MS * (END_P - p0) / END_P);
    const startTime = performance.now();

    (function step(now) {
      if (myToken !== scrollAnimToken) return;   // superseded by a newer click
      const t = clamp((now - startTime) / duration, 0, 1);
      const p = lerp(p0, END_P, t);
      window.scrollTo(0, trackTop + total * p);
      /* Drive the animation state synchronously - do not wait for scroll
         events plus the smoothing lerp to catch up. */
      target = current = readProgress();
      apply(current);
      headerState();
      if (t < 1) requestAnimationFrame(step);
    })(startTime);
  }

  $('#openBoxBtn').addEventListener('click', () => {
    const total = heroTrack.offsetHeight - stage.offsetHeight;
    if (reduced) {
      window.scrollTo(0, docTop(heroTrack) - topbarH() + total * END_P);
    } else {
      openBoxSequence();
    }
  });

  /* ---------------------------------------------------------------
     Product grid
  --------------------------------------------------------------- */
  const grid = $('#productGrid');
  grid.innerHTML = PRODUCTS.map(p =>
    '<article class="pcard reveal">' +
      '<div class="pcard__media art--' + p.art + '">' +
        (p.badge ? '<span class="pcard__badge">' + p.badge + '</span>' : '') +
      '</div>' +
      '<p class="pcard__kicker">' + p.kicker + '</p>' +
      '<h3 class="pcard__name">' + p.name + '</h3>' +
      '<p class="pcard__desc">' + p.desc + '</p>' +
      '<div class="pcard__foot">' +
        '<span class="pcard__price">' + (p.from ? 'From $' : '$') + p.price + '</span>' +
        (p.compare ? '<span class="pcard__compare">$' + p.compare + '</span>' : '') +
        '<button class="pcard__add" data-product="' + p.id + '">Add to bag</button>' +
      '</div>' +
    '</article>'
  ).join('');

  /* ---------------------------------------------------------------
     Cart counter
  --------------------------------------------------------------- */
  const cartCount = $('#cartCount');
  let cart = 0;
  function bumpCart(n) {
    cart += n;
    cartCount.textContent = cart;
    cartCount.classList.toggle('is-on', cart > 0);
    cartCount.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }],
      { duration: 340, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  }
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-product]');
    if (!btn) return;
    bumpCart(1);
    btn.textContent = 'Added';
    setTimeout(() => { btn.textContent = 'Add to bag'; }, 1400);
  });
  $('#cartBtn').addEventListener('click', () => {
    document.getElementById('collection').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------
     Create your own dozen
  --------------------------------------------------------------- */
  const BOX_FEE = 20;   // keepsake box, tray card and wrapping
  const picker  = $('#picker');
  const dozenList = $('#dozenList');
  const dozenCount = $('#dozenCount');
  const dozenBar = $('#dozenBar');
  const dozenPrice = $('#dozenPrice');
  const dozenAdd = $('#dozenAdd');
  let dozen = [];

  picker.innerHTML = BALLS.map(b =>
    '<button class="pick" type="button" data-pick="' + b.id + '">' +
      '<span class="pick__count" data-count="' + b.id + '">0</span>' +
      '<span class="pick__brand">' + BRANDS[b.brand].name + '</span>' +
      '<span class="pick__name">' + b.name + '</span>' +
      '<span class="pick__meta">' + b.layers + ' &middot; ' + b.compression + ' comp &middot; ' + money(b.price) + '</span>' +
    '</button>'
  ).join('');

  function ballById(id) { return BALLS.find(b => b.id === id); }

  function addToDozen(id) {
    if (dozen.length >= 12) { flashFull(); return; }
    dozen.push(id);
    renderDozen();
  }

  function flashFull() {
    dozenCount.animate(
      [{ color: '#C0A062' }, { color: '#F7F3EA' }],
      { duration: 500 }
    );
  }

  function renderDozen() {
    dozenCount.textContent = dozen.length;
    dozenBar.style.width = (dozen.length / 12 * 100) + '%';

    const total = dozen.reduce((s, id) => s + ballById(id).price, 0) + (dozen.length ? BOX_FEE : 0);
    dozenPrice.textContent = money(total);
    dozenAdd.disabled = dozen.length !== 12;
    dozenAdd.textContent = dozen.length === 12 ? 'Add dozen to bag' : 'Choose ' + (12 - dozen.length) + ' more';

    if (!dozen.length) {
      dozenList.innerHTML = '<li class="builder__placeholder">Your dozen is empty. Choose from the left, or start from the Tour Twelve.</li>';
    } else {
      dozenList.innerHTML = dozen.map((id, i) => {
        const b = ballById(id);
        return '<li><span>' + String(i + 1).padStart(2, '0') + '</span>' +
               '<b>' + BRANDS[b.brand].name + ' ' + b.name + '</b>' +
               '<button class="rm" data-rm="' + i + '" aria-label="Remove">&times;</button></li>';
      }).join('');
    }

    const counts = {};
    dozen.forEach(id => counts[id] = (counts[id] || 0) + 1);
    $$('[data-pick]', picker).forEach(el => {
      const n = counts[el.dataset.pick] || 0;
      el.classList.toggle('has-count', n > 0);
      $('[data-count="' + el.dataset.pick + '"]', el).textContent = n;
    });
  }

  picker.addEventListener('click', e => {
    const btn = e.target.closest('[data-pick]');
    if (btn) addToDozen(btn.dataset.pick);
  });
  dozenList.addEventListener('click', e => {
    const btn = e.target.closest('[data-rm]');
    if (btn) { dozen.splice(+btn.dataset.rm, 1); renderDozen(); }
  });
  $('#dozenFill').addEventListener('click', () => { dozen = BALLS.map(b => b.id); renderDozen(); });
  $('#dozenClear').addEventListener('click', () => { dozen = []; renderDozen(); });
  dozenAdd.addEventListener('click', () => {
    bumpCart(1);
    dozen = [];
    renderDozen();
    dozenAdd.textContent = 'Added to bag';
    setTimeout(renderDozen, 1600);
  });
  renderDozen();

  /* ---------------------------------------------------------------
     Forms (front-end only — wire to your backend / Shopify)
  --------------------------------------------------------------- */
  $('#quoteForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#qName').value.trim().split(' ')[0] || 'there';
    $('#quoteNote').textContent = 'Thank you, ' + name + '. Our gifting team will be in touch within one business day.';
    e.target.reset();
  });
  $('#signupForm').addEventListener('submit', e => {
    e.preventDefault();
    $('#signupNote').textContent = 'You are on the list. Watch your inbox.';
    e.target.reset();
  });

  /* ---------------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------------- */
  $$('.sectionhead, .pcard, .pillars li, .card3, .story__art, .gifting__art, .reviews blockquote, .trust__grid > div, .quote, .signup__inner > *')
    .forEach(el => el.classList.add('reveal'));

  const revealAll = () => $$('.reveal').forEach(el => el.classList.add('is-in'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    $$('.reveal').forEach(el => io.observe(el));

    // Safety net: reveal-on-scroll is decoration, never a reason for the page to
    // stay blank. If the observer has not fired at all shortly after load, drop
    // the effect entirely rather than leaving sections at opacity 0.
    setTimeout(() => {
      if (!document.querySelector('.reveal.is-in')) revealAll();
    }, 2000);
  } else {
    revealAll();
  }

  /* ---------------------------------------------------------------
     Boot
  --------------------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();
  syncTopH();
  measureStack();
  /* Web fonts land after first paint and change the copy's height. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { measureStack(); onScroll(); });
  }
  target = current = readProgress();   // no jump when the page loads part-scrolled
  apply(current);
  headerState();
})();
