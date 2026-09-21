/* ══════════════════════════════════════════════════════════════
   KIPRUN Run Store — motion.
   Built on the Utopia Tokyo recreation: same scroll mechanics, eases
   and scramble language; masks replaced with the KIPRUN range from
   "Running Store Page.xlsx". Names, prices and images are the live
   decathlon.in listings for each model code.
   ══════════════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = matchMedia('(max-width: 760px)');
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ── catalogue ──────────────────────────────────────────────── */
const CDN = 'https://contents.mediadecathlon.com/';
const pic = (p, w = 800) => `${CDN}${p}?format=auto&quality=85&f=${w}x0`;
const shopUrl = (code) => `https://www.decathlon.in/p/${code}`;
const inr = (n) => (n == null ? null : '₹' + n.toLocaleString('en-IN'));

const USP_KIPRIDE_MAX = [
  ['Fitting comfort', 'Ultra-comfy 360° shoe: breathable mesh, 3D-knit tongue and reinforced collar.'],
  ['Light weight', '6% lighter than the KS900.2 (271g in size 42) for a lighter stride.'],
  ['Cushioning', 'Softech+ foam with 69% energy return to boost your stride.'],
];
const USP_KIPSTORM = [
  ['Fitting comfort', 'Knitted upper and minimalist tongue for friction-free comfort.'],
  ['Light weight', 'Its featherweight of 215g (size 8) reduces fatigue and boosts performance.'],
  ['Cushioning', 'Fastech+ foam for optimal protection, even over marathon distances.'],
  ['Energy return', 'Fastech+ foam: propulsion and maximum energy return during the race.'],
];
const KIPSTORM_IMG = 'p3039130/a9108581efb940d3901787f9fedfef94/p3039130.jpg';

/* shoes: the five series, in the sheet's order; then the two women's kit shoes */
const PRODUCTS = [
  { code: '8985695', cat: 'shoes', series: true, name: 'Kipcore', tag: 'Everyday cushion', price: 4999,
    full: 'Men Running Shoes Kipcore 500 - Yellow', img: 'p3031050/56722f8fb07cc19155f6bf6c8bb72a48/p3031050.jpg',
    usps: [['Fitting comfort', 'Supple mesh with foam inserts in the heel and tongue.'],
           ['Foot support', 'Reinforced support at the heel and in the tightening area.'],
           ['Cushioning', 'The Mfoam sole provides softness and energy return.']] },
  { code: '8960614', cat: 'shoes', series: true, name: 'Kipride', tag: 'Soft cushion', price: 9999,
    full: 'Men Road Running Soft Cushion Shoes, Kiprun Kipride - Blue', img: 'p3159449/247d5e0d25707b890ea28afce137d267/p3159449.jpg',
    usps: [['Fitting comfort', 'Immediate and optimal comfort with every stride.'],
           ['Light weight', 'Just 243g in size 8.5 for a lightweight feel in every stride.'],
           ['Cushioning', 'Optimum shock absorption thanks to Fastech foam for running comfort.']] },
  { code: '8960547', cat: 'shoes', series: true, name: 'Kipride Max', tag: 'Max cushion', price: 12999,
    full: 'Men Road Running Max Cushion Breathable Shoes, Kiprun Kipride Max - Teal Blue', img: 'p3038861/5a07a9636806d196b3c2f26c8f0d1df3/p3038861.jpg',
    usps: USP_KIPRIDE_MAX },
  { code: '8961381', cat: 'shoes', series: true, name: 'Kipstorm', tag: 'Carbon race shoe', price: 19999,
    full: 'Kiprun Kipstorm', img: KIPSTORM_IMG, link: shopUrl('8970785'),
    note: 'Model 8961381 is not listed on decathlon.in yet: priced and linked as the live Kipstorm (8970785, ₹19,999).',
    usps: USP_KIPSTORM },
  { code: '8990034', cat: 'shoes', series: true, name: 'Kipride Gravel', tag: 'Road to trail', price: null, status: 'Discontinued',   // decathlon.in lists it as discontinued, no price
    full: 'Men Road and Trail Gravel Grip Cushion Shoes, Kiprun Kipride Gravel - Beige', img: 'p3159391/f7dc6f0f11010cc714c76b316616d2a9/p3159391.jpg',
    usps: [['Impact protection', 'Lightweight protection to shield your feet from obstacles on the trail.'],
           ['Traction', '3mm studs for the perfect balance between grip and traction.'],
           ['Cushioning', 'Fastech foam for superior shock absorption and energy return.']] },
  { code: '8960640', cat: 'shoes', name: 'Kipride Max', tag: 'Women · Max cushion', price: 12999,
    full: 'Women Road Running Max Cushion Shoes, Kiprun Kipride Max - Powder Blue', img: 'p3159612/0b3b0199aa1df39c241071843f3536af/p3159612.jpg',
    usps: USP_KIPRIDE_MAX },
  { code: '8970785', cat: 'shoes', name: 'Kipstorm', tag: 'Women · Carbon race shoe', price: 19999,
    full: 'Women Running Carbon Plate Speed Shoes, Kiprun Kipstorm - Light Yellow', img: KIPSTORM_IMG,
    usps: USP_KIPSTORM },

  /* apparel */
  { code: '8978072', cat: 'apparel', name: 'Run 900 Light T-shirt', tag: 'Men · Light blue', price: 1999,
    full: "Men's Running T-shirt Kiprun Run 900 Light Blue", img: 'p3024603/141328d72603a9e2afd0ec1d419949dd/p3024603.jpg',
    desc: 'Short-sleeved running T-shirt that reduces irritation, developed for running in hot weather.' },
  { code: '8957969', cat: 'apparel', name: 'Run 500 Trail T-shirt', tag: 'Men · Blue', price: 1499,
    full: "Men's trail running T-shirt, Kiprun Run 500 blue", img: 'p3013916/c0a98694432f1bae8c3d2d35b2c4b181/p3013916.jpg',
    desc: 'Lightweight trail T-shirt that resists friction from your backpack and keeps you dry.' },
  { code: '8970795', cat: 'apparel', name: 'Run 500 Comfort Shorts', tag: 'Men · Teal', price: 999,
    full: "Men's running shorts - KIPRUN Run 500 Comfort - Teal", img: 'p3014321/5194ab4a25603a3f301e7c35775a9b12/p3014321.jpg',
    desc: 'Lightweight running shorts developed for running in hot weather.' },
  { code: '8970013', cat: 'apparel', name: 'Run 900 Light Tank', tag: 'Men · White', price: 1699,
    full: "Men's Kiprun 900 light running tank top-White", img: 'p3014183/9d56f30935e0323dfd6d7b82c01ae24e/p3014183.jpg',
    desc: 'Ultra-light, breathable tank top with a micro-perforated component for intense sessions.' },
  { code: '8861551', cat: 'apparel', name: 'Run 500 Comfort Split Shorts', tag: 'Men · Black', price: 1499,
    full: "Men's KIPRUN Run 500 Comfort Split Running Shorts - Black", img: 'p2841949/894eb6ff5bcb1770d08d8d89b15ac6f5/p2841949.jpg',
    desc: 'For runners who want freedom of movement and lightness.' },
  { code: '8968585', cat: 'apparel', name: 'Run 900 Light T-shirt', tag: 'Women · Purple', price: 1999,
    full: "KIPRUN Run 900 Light Women's Lightweight Running T-shirt - Purple", img: 'p3133119/425ea177959365bb3463960f2f53d7ff/p3133119.jpg',
    desc: 'Excellent moisture management and a lightweight design, for road and trail runs.' },
  { code: '8959586', cat: 'apparel', name: 'Run 500 Comfort 2-in-1 Shorts', tag: 'Women · Black', price: 1499,
    full: "Women's 2-in-1 running & trail running shorts, Kiprun Run 500 Comfort - Black", img: 'p3012523/27d9298ed0d1cc0251325267286b02a1/p3012523.jpg',
    desc: '2-in-1 shorts for everyday runs and training sessions, combining style and comfort.' },
  { code: '8968849', cat: 'apparel', name: 'Run 900 Tank Top', tag: 'Women · White', price: 1699,
    full: "Women's lightweight running tank top, Kiprun Run 900 - White", img: 'p3012975/2d60998d47e854b952ca3d179548abdd/p3012975.jpg',
    desc: 'A lightweight tank top made for competitions and intense training sessions.' },
  { code: '8831042', cat: 'apparel', name: 'Run 900 Light Shorts', tag: 'Women · Light purple', price: 799,
    full: "Women's Lightweight Running & Trail Shorts-KIPRUN Run 900 Light purple", img: 'p2600185/8735b9856a2ced1ea7d3aee722cb55e7/p2600185.jpg',
    desc: 'Ultra-light shorts for your running and trail running sessions.' },

  /* accessories */
  { code: '8911422', cat: 'accessories', name: 'Run 900 10L Hydration Bag', tag: 'Hydration · 1L bladder', price: 4999,
    full: 'Unisex Trail Running 10L Bag with 1L Water Bladder, KIPRUN 900 - Black', img: 'p3025443/872fc74b527b24654681cf708053e327/p3025443.jpg',
    desc: '10-litre bag sold with a 1-litre water pouch, for training and races up to 120 km.' },
  { code: '8871357', cat: 'accessories', name: 'Running Cap', tag: 'Cap · Unisex, adjustable', price: 399,
    full: 'Unisex Adjustable Running Cap - Smoked Black', img: 'p2889002/7f596269a14fd484658171e6d70c1845/p2889002.jpg',
    desc: 'Running cap designed for warm weather, for training or competition at any distance.' },
  { code: '8648869', cat: 'accessories', name: 'Basic 2 Running Belt', tag: 'Belt · Phone waistband', price: 499,
    full: 'KIPRUN Basic 2 Unisex Smartphone Running Waistband - Black', img: 'p2713505/52559f7a50ab8921bbe8ae205e98744c/p2713505.jpg',
    desc: 'Carries your phone, keys and card so your hands stay free while you run.' },
  { code: '8939251', cat: 'accessories', name: 'Run 900 Mid Socks', tag: 'Socks · Mid-length, fine', price: 499,
    full: 'Mid fine running socks run900 - Blue', img: 'p3057293/88df9a7070e315ba7ca24c28c679100c/p3057293.jpg',
    desc: 'Fine, mid-length running socks for runners who want a snug feel.' },
];
const byCode = Object.fromEntries(PRODUCTS.map((p) => [p.code, p]));
const SERIES = PRODUCTS.filter((p) => p.series);
const FEATURE = byCode['8960547'];

/* the panoplies: each kit is shoes + top(s) + shorts */
const KITS = [
  { who: 'man',   day: 'practice', label: 'Man · Practice Day',   shoes: '8960547', tops: ['8978072', '8957969'], shorts: '8970795' },
  { who: 'man',   day: 'race',     label: 'Man · Race Day',       shoes: '8961381', tops: ['8970013'],            shorts: '8861551' },
  { who: 'woman', day: 'practice', label: 'Woman · Practice Day', shoes: '8960640', tops: ['8968585'],            shorts: '8959586' },
  { who: 'woman', day: 'race',     label: 'Woman · Race Day',     shoes: '8970785', tops: ['8968849'],            shorts: '8831042' },
];
const kitCodes = (k) => [k.shoes, ...k.tops, k.shorts];
const kitsFor = (code) => KITS.filter((k) => kitCodes(k).includes(code));
const linkFor = (p) => p.link || shopUrl(p.code);

/* ── cut-out shoes ────────────────────────────────────────────
   Packshots ship on a flat light plate. Flood-fill it away from the
   corners at the tightest tolerance that lifts it (so white midsoles
   survive), then drop detached specks such as the cast shadow.      */
function knockout(im) {
  const w = im.naturalWidth, h = im.naturalHeight, N = w * h;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(im, 0, 0);
  const base = ctx.getImageData(0, 0, w, h);
  for (const TOL of [8, 11, 14, 18, 24]) {
    const d = new ImageData(new Uint8ClampedArray(base.data), w, h), p = d.data;
    const r0 = p[0], g0 = p[1], b0 = p[2];
    const seen = new Uint8Array(N), st = [0, w - 1, N - w, N - 1]; let cleared = 0;
    while (st.length) {
      const q = st.pop(); if (seen[q]) continue; seen[q] = 1;
      const i = q * 4;
      if (Math.abs(p[i] - r0) + Math.abs(p[i + 1] - g0) + Math.abs(p[i + 2] - b0) > TOL * 3) continue;
      p[i + 3] = 0; cleared++;
      const x = q % w;
      if (x > 0) st.push(q - 1); if (x < w - 1) st.push(q + 1); if (q >= w) st.push(q - w); if (q < N - w) st.push(q + w);
    }
    if (cleared < N * 0.55) continue;
    /* the cast shadow touches the outsole, so the blob cull below cannot see it. In the
       bottom band it is the only thing that is light, neutral and no brighter than the
       plate; white midsoles sit brighter and coloured uppers fail the saturation gate */
    const lum = (i) => (p[i] * 299 + p[i + 1] * 587 + p[i + 2] * 114) / 1000;
    const plateL = (r0 * 299 + g0 * 587 + b0 * 114) / 1000, floor = Math.round(h * 0.68) * w;
    const seen2 = new Uint8Array(N), st2 = [];
    for (let q = floor; q < N; q++) if (!p[q * 4 + 3]) { seen2[q] = 1; st2.push(q); }
    while (st2.length) {
      const q = st2.pop(), x = q % w;
      for (const m of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q - w >= floor ? q - w : -1, q < N - w ? q + w : -1]) {
        if (m < 0 || seen2[m]) continue;
        const i = m * 4, L = lum(i), sat = Math.max(p[i], p[i + 1], p[i + 2]) - Math.min(p[i], p[i + 1], p[i + 2]);
        if (L > plateL + 3 || L < 170 || sat > 16) continue;
        seen2[m] = 1; p[i + 3] = 0; st2.push(m);
      }
    }
    const lab = new Int32Array(N).fill(-1), size = [];
    for (let q0 = 0; q0 < N; q0++) {
      if (lab[q0] !== -1 || !p[q0 * 4 + 3]) continue;
      const id = size.length, s = [q0]; let n = 0; lab[q0] = id;
      while (s.length) {
        const q = s.pop(); n++; const x = q % w;
        for (const m of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q >= w ? q - w : -1, q < N - w ? q + w : -1])
          if (m >= 0 && lab[m] === -1 && p[m * 4 + 3]) { lab[m] = id; s.push(m); }
      }
      size.push(n);
    }
    let big = 0; for (const n of size) if (n > big) big = n;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let q = 0; q < N; q++) {
      if (lab[q] < 0) continue;
      if (size[lab[q]] < big * 0.25) { p[q * 4 + 3] = 0; continue; }
      const x = q % w, y = (q - x) / w;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    ctx.putImageData(d, 0, 0);
    const pad = 12, t = document.createElement('canvas');
    t.width = x1 - x0 + 1 + pad * 2; t.height = y1 - y0 + 1 + pad * 2;
    t.getContext('2d').drawImage(c, pad - x0, pad - y0);
    return t;
  }
  return null;
}
const cutCache = new Map();
function cutout(src) {
  if (cutCache.has(src)) return cutCache.get(src);
  const job = new Promise((res) => {
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => {
      let c = null;
      try { c = knockout(im); } catch (e) { /* tainted or odd plate: fall back to the packshot */ }
      if (!c) return res({ src, cut: false });
      c.toBlob((b) => res(b ? { src: URL.createObjectURL(b), cut: true } : { src, cut: false }), 'image/png');
    };
    im.onerror = () => res({ src, cut: false });
    im.src = src;
  });
  cutCache.set(src, job);
  return job;
}
/* shoes float as cut-outs; apparel is on-model and accessories sit on their plate */
/* cut-outs the user supplied (transparent already), used instead of the packshot.
   They skip the knockout: flood-filling a transparent plate eats black sole lines */
const LOCAL = { '8961381': 'assets/shoes/kipstorm-8961381.webp' };
/* every product photo goes through here, so a supplied image replaces the packshot everywhere */
const photo = (p, w) => LOCAL[p.code] || pic(p.img, w);
const imageFor = (p, w = 1200) => (LOCAL[p.code] ? Promise.resolve({ src: LOCAL[p.code], cut: true })
  : p.cat === 'shoes' ? cutout(pic(p.img, w)) : Promise.resolve({ src: pic(p.img, w), cut: false }));
const decoded = (src) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = src; });

/* ── 0. scramble helper ────────────────────────────────────────
   the site drives every bracketed label through GSAP's
   ScrambleTextPlugin; .3s / power2.out is its most common pairing. */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/<>[]';
function scramble(el, dur = 0.6) {
  if (REDUCED || !el) return;
  const text = el.dataset.final || (el.dataset.final = el.textContent);
  gsap.to(el, { duration: dur, ease: 'none', scrambleText: { text, chars: CHARS, speed: 0.5, revealDelay: dur * 0.25 } });
}
const setScrambled = (el, text, dur = 0.5) => { el.textContent = text; el.dataset.final = text; scramble(el, dur); };
function initScrambleFX() {
  $$('[data-scramble]').forEach((el) => {
    el.dataset.final = el.textContent;
    const host = el.closest('button,a') || el;
    host.addEventListener('mouseenter', () => scramble(el, 0.4));
  });
}

/* ── 1. custom cursor ───────────────────────────────────────── */
function initCustomCursor() {
  const c = $('#cursor');
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) { c.remove(); return; }
  const qx = gsap.quickTo(c, 'x', { duration: 0.3, ease: 'power3.out' });
  const qy = gsap.quickTo(c, 'y', { duration: 0.3, ease: 'power3.out' });
  addEventListener('pointermove', (e) => { qx(e.clientX); qy(e.clientY); });
  document.addEventListener('pointerover', (e) => {
    c.classList.toggle('is-hot', !!e.target.closest('a,button,.range__list li,.kit-card,.hero__series li,.panel__kit li'));
  });
}

/* ── 3. preloader ─────────────────────────────────────────────
   A reel of shoe photos plays like a short film, zooms out into a
   card, DECATHLON / KIPRUN rises on it, then the whole panel slides
   up to hand over to the hero. Click (or Skip) jumps to the end. */
const REEL = Array.from({ length: 14 }, (_, i) => `assets/preloader/${String(i + 1).padStart(2, '0')}.webp`);
const REEL_CUT = 0.11;      // seconds per photo while the reel runs full-bleed

function runPreloader() {
  const pre = $('#preloader'), reel = $('#plReel');
  document.body.classList.add('is-locked');

  const shots = REEL.map((src, i) => {
    const im = document.createElement('img');
    im.src = src; im.alt = ''; im.decoding = 'async';
    if (i === 0) im.fetchPriority = 'high';
    reel.appendChild(im);
    return im;
  });

  const done = () => {
    document.body.classList.remove('is-locked');
    pre.remove();
    ScrollTrigger.refresh();
    runHeroIntro();
  };
  if (REDUCED) { done(); return; }

  const tl = gsap.timeline({ onComplete: done, paused: true });
  gsap.set(shots[0], { autoAlpha: 1 });
  gsap.set(reel, { scale: 1.12 });
  // hard cuts, like a reel
  shots.forEach((im, i) => {
    if (i) tl.set(shots[i - 1], { autoAlpha: 0 }, i * REEL_CUT).set(im, { autoAlpha: 1 }, i * REEL_CUT);
  });
  const reelEnd = shots.length * REEL_CUT;
  tl.to(reel, { scale: 1, ease: 'none', duration: reelEnd }, 0)
    .to('#plBar', { width: '100%', ease: 'none', duration: reelEnd + 0.5 }, 0)
    .to('.pl__scrim', { opacity: 1, duration: 0.5 }, reelEnd + 0.15)
    // DECATHLON over KIPRUN rises on the card, holds, then leaves
    .fromTo('#plLogo', { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }, reelEnd + 0.45)
    .to('#plLogo', { autoAlpha: 0, y: -70, duration: 0.4, ease: 'power2.in' }, reelEnd + 1.5)
    .to(['#plBar', '#plSkip'], { autoAlpha: 0, duration: 0.3 }, reelEnd + 1.5)
    // and the panel hands over to the hero
    .to(pre, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, reelEnd + 1.75);

  // zoom out into a card. Scaling the full-screen reel keeps the screen's shape, which on a
  // phone is a 180px sliver the logos spill out of, so portrait screens clip to a 4:5 card
  if (innerHeight > innerWidth) {
    const cw = Math.round(innerWidth * 0.8), ch = Math.round(Math.min(innerHeight * 0.62, cw * 1.25));
    const x = Math.round((innerWidth - cw) / 2), y = Math.round((innerHeight - ch) / 2);
    tl.fromTo([reel, '.pl__scrim'], { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
      { clipPath: `inset(${y}px ${x}px ${y}px ${x}px round 10px)`, duration: 0.7, ease: 'expo.inOut' }, reelEnd);
  } else {
    tl.to([reel, '.pl__scrim'], { scale: 0.46, borderRadius: 10, duration: 0.7, ease: 'expo.inOut' }, reelEnd);
  }

  // hold the first cut until the reel can paint: on mobile data it used to flick through blank frames.
  // capped, so a slow link still gets into the site
  const ready = Promise.all(shots.map((im) => (im.decode ? im.decode().catch(() => {}) : null)));
  Promise.race([ready, new Promise((r) => setTimeout(r, 3000))]).then(() => tl.play());

  const skip = () => { tl.play(); tl.timeScale(6); };
  $('#plSkip').addEventListener('click', skip);
  pre.addEventListener('click', skip);
}

/* ── 4. hero: the whole series ─────────────────────────────── */
let heroIndex = 0;
function buildHero() {
  const slider = $('#heroSlider');
  const list = $('#heroSeries');
  SERIES.forEach((p, i) => {
    const s = document.createElement('div');
    s.className = 'slide';
    const im = document.createElement('img');
    im.alt = `Kiprun ${p.name} running shoe`;
    imageFor(p, 1600).then(({ src }) => { im.src = src; });
    s.appendChild(im);
    slider.appendChild(s);

    const li = document.createElement('li');
    li.dataset.track = `Series: ${p.name}`;
    li.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span> ${p.name}`;
    li.addEventListener('click', () => { goHero(i); });
    list.appendChild(li);
  });
  gsap.set('.hero-slider .slide', { opacity: 0 });
  gsap.set('.hero-slider .slide:nth-child(1)', { opacity: 1 });
  list.children[0].classList.add('is-active');
}

function goHero(next) {
  const slides = $$('.hero-slider .slide');
  if (next === heroIndex || !slides.length) return;
  gsap.to(slides[heroIndex], { opacity: 0, duration: 0.37, ease: 'power2.in' });
  gsap.fromTo(slides[next], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.08 });
  // the cut carries a short glitch, like the reel skipping a frame
  const slider = $('#heroSlider');
  slider.classList.remove('is-glitch');
  void slider.offsetWidth;                       // restart the keyframes
  slider.classList.add('is-glitch');
  gsap.delayedCall(0.53, () => slider.classList.remove('is-glitch'));
  $$('#heroSeries li').forEach((li, i) => li.classList.toggle('is-active', i === next));
  setScrambled($('#heroSliderLabel'), SERIES[next].name, 0.3);
  setScrambled($('#heroCount'), `Series ${String(next + 1).padStart(2, '0')} / ${String(SERIES.length).padStart(2, '0')}`, 0.3);
  heroIndex = next;
}

function runHeroIntro() {
  if (REDUCED) return;
  // the lockup is two svg marks now, so they rise as whole shapes
  gsap.fromTo('.hero__title .logo', { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out' });
  gsap.fromTo('.hero__caption', { y: 24, opacity: 0 },
    { y: 0, opacity: 0.75, duration: 0.8, ease: 'power2.out', delay: 0.1 });
  gsap.fromTo('.cc-hero-cta, .hero__series, .hero__foot > *, .hero__nav > *', { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out', delay: 0.25 });
  gsap.fromTo('.hero__gallery', { opacity: 0, scale: 1.08 },
    { opacity: 1, scale: 1, duration: 1, ease: 'expo.out', delay: 0.2 });
  $$('.hero [data-scramble]').forEach((el, i) => gsap.delayedCall(0.4 + i * 0.06, () => scramble(el, 0.5)));
}

function initHeroSlider() {
  if (REDUCED || SERIES.length < 2) return;
  setInterval(() => goHero((heroIndex + 1) % SERIES.length), 4270);   // 0.75x of the old 3.2s pace
}

/* ── 4b. film: the clip opens out of the hero, then cuts colourway ── */
let filmIndex = 0;
// portrait screens get the 9:16 cuts: a 16:9 clip covered onto a phone used a 405px sliver of it
const PORTRAIT = matchMedia('(max-aspect-ratio: 1/1)');
const filmSrc = (v) => (PORTRAIT.matches ? v.dataset.port : v.dataset.land);

function setFilm(next) {
  if (next === filmIndex) return;
  const vids = $$('.film__video');
  vids[filmIndex].pause();
  vids[filmIndex].classList.remove('is-on');
  const v = vids[next];
  v.preload = 'auto';
  v.classList.add('is-on');                       // a plain cross-fade: no glitch on the footage
  v.currentTime = 0;
  if (!REDUCED) v.play().catch(() => {});
  $$('#filmDots li').forEach((li, i) => li.classList.toggle('is-on', i === next));
  filmIndex = next;
}

function initFilm() {
  const frame = $('#filmFrame');
  if (!frame) return;
  const vids = $$('.film__video');
  const load = () => vids.forEach((v, i) => {
    const base = filmSrc(v);
    if (v.dataset.base === base) return;
    v.dataset.base = base;
    v.poster = base + '.jpg';
    v.src = base + '.mp4';
    if (i === filmIndex) { v.preload = 'auto'; if (!REDUCED) v.play().catch(() => {}); }
  });
  vids.forEach((v) => { v.muted = true; });
  load();
  PORTRAIT.addEventListener('change', load);

  // only run while the section is on screen, so three clips never decode at once
  new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = vids[filmIndex];
    if (e.isIntersecting && !REDUCED) v.play().catch(() => {}); else vids.forEach((x) => x.pause());
  }), { threshold: 0.05 }).observe(frame);

  $('#filmDots').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) setFilm(Number(b.dataset.i));
  });

  if (REDUCED) return;

  // the frame opens from a centred card to full bleed over the first screen of scroll
  gsap.timeline({ scrollTrigger: { trigger: '#film', start: 'top top', end: '+=70%', scrub: 0.6 } })
    .fromTo(frame, { clipPath: 'inset(15% 26% 15% 26%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
    .fromTo(vids, { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
    .fromTo('.film__ui', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 0.4);

  // the rest of the section cuts through the colourways
  ScrollTrigger.create({
    trigger: '#film', start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => {
      if (self.progress < 0.3) return setFilm(0);
      const p = (self.progress - 0.3) / 0.7;
      setFilm(Math.min(vids.length - 1, Math.floor(p * vids.length)));
    },
  });
}

/* ── 5. main shoe: pinned, floating, features call out on scroll ── */
/* where each callout lands on the shoe, as % of its box: upper/collar, mid-upper, midsole */

/* the three USPs read as a spec bar under the shoe: number, the figure that
   matters, then the claim — the same data the callout cards carried */
const FEATURE_METRICS = ['360°', '271 g', '69 %'];

function buildFeature() {
  $('#featureSpecs').innerHTML = FEATURE.usps.map(([title, text], i) => `
    <li class="spec" data-i="${i}">
      <span class="eyebrow spec__n">${String(i + 1).padStart(2, '0')} / ${String(FEATURE.usps.length).padStart(2, '0')}</span>
      <b class="spec__metric">${FEATURE_METRICS[i] || ''}</b>
      <span class="spec__title">${title}</span>
      <p class="spec__text">${text}</p>
    </li>`).join('');
  imageFor(FEATURE, 1600).then(({ src }) => { $('#featureImg').src = src; initFeatureGl(src); });
  $('#featurePrice').textContent = inr(FEATURE.price);
  $('#featureLink').href = linkFor(FEATURE);
}

/* ── 5b. the feature shoe on a canvas: it ripples under the pointer ──
   A quad, the cut-out as its texture, and a fragment shader that bends the
   UVs around the cursor. If WebGL is missing the <img> underneath stays. */
const FEATURE_VERT = `
attribute vec2 p; varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
const FEATURE_FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;    // pointer in uv space
uniform float uTime;
uniform float uForce;   // 0 at rest, 1 right after the pointer moves
void main(){
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 d = uv - uMouse;
  float r = length(d);
  vec2 dir = d / max(r, 0.0001);
  // one ring travelling out of the cursor, fading with distance
  float ring = sin(r * 22.0 - uTime * 3.2) * exp(-r * 5.0);
  uv += dir * ring * 0.03 * (0.22 + uForce);
  // a slow idle sway so it is alive before anyone touches it
  uv.x += sin(uv.y * 7.0 + uTime * 0.6) * 0.0022;
  vec2 shift = dir * 0.005 * uForce;
  vec4 c = texture2D(uTex, clamp(uv, 0.001, 0.999));
  float rr = texture2D(uTex, clamp(uv + shift, 0.001, 0.999)).r;
  float bb = texture2D(uTex, clamp(uv - shift, 0.001, 0.999)).b;
  gl_FragColor = vec4(rr, c.g, bb, c.a);
}`;

function initFeatureGl(src) {
  const cv = $('#featureGl');
  const img = $('#featureImg');
  if (!cv || REDUCED) return;
  const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
  if (!gl) return;                                   // no WebGL: the <img> is already showing

  const sh = (type, srcTxt) => { const o = gl.createShader(type); gl.shaderSource(o, srcTxt); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, FEATURE_VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FEATURE_FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uForce = gl.getUniformLocation(prog, 'uForce');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const tex = gl.createTexture();
  const im = new Image();
  im.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    cv.style.aspectRatio = `${im.naturalWidth} / ${im.naturalHeight}`;
    img.classList.add('is-hidden');                  // hand over from the fallback
    size();
    start();
  };
  im.src = src;

  const size = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
    if (w && h && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
  };
  addEventListener('resize', size);

  let mx = 0.5, my = 0.4, force = 0, raf = 0, t0 = performance.now();
  addEventListener('pointermove', (e) => {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
    force = Math.min(1, force + 0.35);
  }, { passive: true });

  const frame = () => {
    raf = requestAnimationFrame(frame);
    size();
    force *= 0.96;
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);
    gl.uniform1f(uForce, force);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const start = () => { if (!raf) frame(); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  // only draw while the section is on screen
  new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0 }).observe($('.cc-feature'));
}

function initFeature() {
  gsap.fromTo('#featureShoe', { scale: 0.88, rotate: -10 }, {
    scale: 1.12, rotate: 5, ease: 'none',
    scrollTrigger: { trigger: '.cc-feature', start: 'top top', end: 'bottom bottom', scrub: 1,
},
  });
  if (!REDUCED) gsap.to('.feature__bob', { y: -20, rotate: 1.6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.feature__shadow', { scaleX: 0.82, opacity: 0.6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.feature__kanji', {
    yPercent: -16, ease: 'none',
    scrollTrigger: { trigger: '.cc-feature', start: 'top bottom', end: 'bottom top', scrub: 0 },
  });

  const specs = $$('.spec');
  const setSpec = (i) => specs.forEach((c, k) => c.classList.toggle('is-on', k === i));
  setSpec(0);
  if (!REDUCED) {
    // no entrance tween here: the bar lives in the sticky stage, where a from()
    // tween can be left at its start state if you jump past the trigger
    // the words block is pulled up by -100vh, which throws off the trigger's own
    // progress here, so read how far the pinned stage has travelled directly
    ScrollTrigger.create({
      trigger: '.cc-feature', start: 'top top', end: 'bottom bottom',
      onUpdate: () => {
        const r = $('.cc-feature').getBoundingClientRect();
        const travel = Math.max(1, r.height - innerHeight);
        const p = Math.min(1, Math.max(0, -r.top / travel));
        setSpec(Math.min(specs.length - 1, Math.floor(p * specs.length)));
      },
    });
  }

  $$('.feature__w').forEach((w) => {
    gsap.from(w, { opacity: 0, yPercent: 40, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: w, start: 'top 92%' } });
  });
  $$('.feature__data i').forEach((d) => {
    gsap.to(d, { yPercent: -60, ease: 'none', scrollTrigger: { trigger: '.cc-feature', start: 'top bottom', end: 'bottom top', scrub: 0 } });
    d.dataset.final = d.textContent;
    ScrollTrigger.create({ trigger: d, start: 'top 85%', onEnter: () => scramble(d, 0.5) });
  });
}

/* ── 6. range: popping product + list ───────────────────────── */
let rangeCat = null, current = null, popTl = null, hoverTimer = 0;
const listFor = (cat) => (cat === 'shoes' ? SERIES : PRODUCTS.filter((p) => p.cat === cat));

function uspRows(p) {
  if (p.usps) return p.usps;
  const rows = [['About', p.desc]];
  const kits = kitsFor(p.code);
  if (kits.length) rows.push(['In the kit', kits.map((k) => k.label).join(' / ')]);
  return rows;
}
const uspHTML = (rows) => rows.map(([t, d], i) =>
  `<li><span class="eyebrow">${String(i + 1).padStart(2, '0')}</span><b>${t}</b><p>${d}</p></li>`).join('');

function buildRange() {
  $('#countShoes').textContent = listFor('shoes').length;
  $('#countApparel').textContent = listFor('apparel').length;
  $('#countAccessories').textContent = listFor('accessories').length;
  $$('.range__tab').forEach((tab) => tab.addEventListener('click', () => setCat(tab.dataset.cat)));
  $$('[data-cat-link]').forEach((a) => a.addEventListener('click', () => setCat(a.dataset.catLink)));
  $('#stageMore').addEventListener('click', () => current && openPanel(current.code));

  const frame = $('#stageFrame');
  const rx = gsap.quickTo('.stage__tilt', 'rotationX', { duration: 0.6, ease: 'power3.out' });
  const ry = gsap.quickTo('.stage__tilt', 'rotationY', { duration: 0.6, ease: 'power3.out' });
  if (!REDUCED) {
    frame.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 26);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 18);
    });
    frame.addEventListener('pointerleave', () => { rx(0); ry(0); });
    gsap.to('.stage__float', { y: -14, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }
  setCat('shoes');

  ScrollTrigger.batch('.range__list li', {
    start: 'top 94%',
    onEnter: (els) => gsap.from(els, { opacity: 0, yPercent: 30, duration: 0.6, stagger: 0.04, ease: 'power2.out', overwrite: true }),
  });
}

function setCat(cat) {
  if (cat === rangeCat) return;
  rangeCat = cat;
  $$('.range__tab').forEach((t) => {
    const on = t.dataset.cat === cat;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
  });
  const list = $('#rangeList');
  const items = listFor(cat);
  list.innerHTML = items.map((p, i) => `
    <li class="pcard" data-code="${p.code}" data-track="Range: ${p.name}" tabindex="0">
      <span class="pcard__n eyebrow">${String(i + 1).padStart(2, '0')}</span>
      <span class="pcard__img"><img src="${photo(p, 400)}" alt="" loading="lazy"></span>
      <span class="pcard__tag eyebrow">${p.tag}</span>
      <span class="pcard__name">${p.name}</span>
      <span class="pcard__foot"><b>${inr(p.price) || p.status || 'On decathlon.in'}</b><i class="eyebrow">${p.code}</i></span>
    </li>`).join('');
  $$('li', list).forEach((li) => {
    const p = byCode[li.dataset.code];
    li.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(() => showProduct(p), 90); });
    li.addEventListener('focus', () => showProduct(p));
    li.addEventListener('click', () => { showProduct(p); openPanel(p.code); });
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPanel(p.code); });
  });
  gsap.fromTo('#rangeList li', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' });
  current = null;
  showProduct(items[0]);
  items.forEach((p) => imageFor(p));   // warm the cut-outs so hovering stays instant
  ScrollTrigger.refresh();
}

/* the "3D pop": the product spins out of the frame and the next one
   springs in from depth, then keeps floating and follows the pointer */
async function showProduct(p) {
  if (!p || current === p) return;
  current = p;
  $$('#rangeList li').forEach((li) => li.classList.toggle('is-active', li.dataset.code === p.code));
  const { src } = await imageFor(p);
  await decoded(src);
  if (current !== p) return;              // the pointer has already moved on
  window.kt?.('preview', p.name);

  const shoe = p.cat === 'shoes';
  const pop = $('#stagePop'), im = $('#stageImg');
  if (popTl) popTl.kill();
  popTl = gsap.timeline()
    .to(pop, { rotationY: -70, rotationX: 10, scale: 0.6, autoAlpha: 0, filter: 'blur(6px)', duration: REDUCED ? 0 : 0.22, ease: 'power2.in' })
    .add(() => {
      im.src = src;
      im.alt = p.full;
      $('#stageFrame').classList.toggle('is-plate', !shoe);
      setScrambled($('#stageTag'), p.tag, 0.4);
      setScrambled($('#stageCode'), `MODEL ${p.code}`, 0.4);
      $('#stageName').textContent = p.name;
      $('#stageUsps').innerHTML = uspHTML(uspRows(p));
      gsap.fromTo('#stageUsps li', { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', delay: REDUCED ? 0 : 0.2 });
      $('#stagePrice').textContent = inr(p.price) || p.status || 'Price on decathlon.in';
      $('#stageLink').href = linkFor(p);
      const note = $('#stageNote');
      note.hidden = !p.note; note.textContent = p.note || '';
    })
    .fromTo(pop,
      { rotationY: 75, rotationX: -14, scale: 0.5, z: -240, autoAlpha: 0, filter: 'blur(10px)' },
      { rotationY: shoe ? -14 : 0, rotationX: shoe ? 6 : 0, scale: 1, z: 0, autoAlpha: 1, filter: 'blur(0px)',
        duration: REDUCED ? 0 : 1, ease: 'back.out(1.5)' })
    .fromTo('#stageName', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, '<');
}

/* ── 7. product detail (with the rest of its kit, this item pinned first) ── */
function openPanel(code, kit) {
  const p = byCode[code];
  if (!p) return;
  kit = kit || kitsFor(code)[0] || null;
  const panel = $('#panel');
  $('#panelImg').src = photo(p, 900);
  $('#panelImg').alt = p.full;
  $('#panelName').textContent = p.name;
  $('#panelCode').textContent = `Model ${p.code} · ${p.tag}`;
  $('#panelDesc').textContent = p.desc || p.full;
  $('#panelUsps').innerHTML = p.usps ? uspHTML(p.usps) : '';
  $('#panelPrice').textContent = inr(p.price) || p.status || 'Price on decathlon.in';
  $('#panelLink').href = linkFor(p);
  $('#panelNote').hidden = !p.note;
  $('#panelNote').textContent = p.note || '';

  const box = $('#panelKit');
  box.hidden = !kit;
  if (kit) {
    const order = [code, ...kitCodes(kit).filter((c) => c !== code)];
    $('#panelKitTitle').textContent = `${kit.label} kit · ${order.length} pieces`;
    $('#panelKitList').innerHTML = order.map((c, i) => {
      const k = byCode[c];
      return `<li data-code="${c}" data-track="Panel kit: ${k.name}" class="${i === 0 ? 'is-pinned' : ''}" tabindex="0">
        <img src="${photo(k, 300)}" alt="">
        <span class="eyebrow">${i === 0 ? 'Pinned · ' : ''}${c}</span>
        <span>${k.name}</span></li>`;
    }).join('');
    $$('#panelKitList li').forEach((li) => {
      const go = () => openPanel(li.dataset.code, kit);
      li.addEventListener('click', go);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    });
  }

  window.kt?.('open', `${p.name} · ${p.code}`);
  const wasOpen = !panel.hidden;
  panel.hidden = false;
  lockScroll(true);
  if (!wasOpen) gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' });
  gsap.fromTo('.panel__img', { scale: 0.94, opacity: 0, rotationY: 20 }, { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: 'expo.out' });
  gsap.fromTo('.panel__body > *:not([hidden])', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' });
  scramble($('#panelCode'), 0.5);
  $('#panelClose').focus({ preventScroll: true });
}
/* the gate's is-locked collapses body to 100vh, which throws the reader back to the top;
   the panel only needs the page to stop moving underneath it */
function lockScroll(on) {
  document.documentElement.classList.toggle('is-panel', on);
  if (lenis) { if (on) lenis.stop(); else lenis.start(); }
}
function closePanel() {
  const panel = $('#panel');
  lockScroll(false);
  gsap.to(panel, { opacity: 0, duration: 0.25, ease: 'none', onComplete: () => { panel.hidden = true; } });
}

/* ── 8. breaker: sticky circles + scramble + reversing marquee ─ */
function initBreaker() {
  const A = $('#circleA'), B = $('#circleB');
  // three copies of the text: base (blue on white), one clipped to the blue circle (white),
  // one clipped to the closing white circle (blue again), so it always reads
  const base = $('.breaker__inner');
  const onA = base.cloneNode(true), onB = base.cloneNode(true);
  onA.classList.add('is-on-a'); onB.classList.add('is-on-b');
  [onA, onB].forEach((n) => n.setAttribute('aria-hidden', 'true'));
  base.after(onA, onB);
  // circle scale 1.25 of a 100vmax disc = a 62.5vmax radius
  gsap.timeline({
    scrollTrigger: { trigger: '.cc-breaker', start: 'top top', end: 'bottom bottom', scrub: 1 },
  })
    .fromTo(A, { scale: 0 }, { scale: 1.25, ease: 'none', duration: 1 })
    .fromTo(onA, { clipPath: 'circle(0vmax at 50% 50%)' }, { clipPath: 'circle(62.5vmax at 50% 50%)', ease: 'none', duration: 1 }, 0)
    .fromTo(B, { scale: 0 }, { scale: 1.25, ease: 'none', duration: 1 }, 1)
    .fromTo(onB, { clipPath: 'circle(0vmax at 50% 50%)' }, { clipPath: 'circle(62.5vmax at 50% 50%)', ease: 'none', duration: 1 }, 1);

  // every copy's words rise in the same order, so the layers stay in register
  const rows = $$('.breaker__inner');
  const perLayer = $$('[data-word]', base).length;
  gsap.from(rows.flatMap((r) => $$('[data-word]', r)), {
    opacity: 0, y: 12, duration: 0.6, ease: 'power2.out', stagger: (i) => (i % perLayer) * 0.04,
    scrollTrigger: { trigger: '.cc-breaker', start: 'top 60%' },
  });
  gsap.from(rows.map((r) => $('.breaker__kanji', r)), {
    scale: 0.8, opacity: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.cc-breaker', start: 'top 70%' },
  });
  initMarqueeScrollDirection();
}

/* base drift, flipped and sped up by scroll direction */
function initMarqueeScrollDirection() {
  const track = $('#marqueeTrack');
  const TEXT = `${SERIES.map((p) => p.name).join(' • ')} • Run 900 • Run 500 • Built for every kilometre`;
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    s.textContent = `${TEXT} •`;
    track.appendChild(s);
  }
  let x = 0, dir = 1, speed = 0.6;
  gsap.ticker.add(() => {
    if (REDUCED) return;
    x -= speed * dir;
    const w = track.scrollWidth / 2;
    if (w) { if (x <= -w) x += w; if (x > 0) x -= w; }
    track.style.transform = `translateX(${x}px)`;
  });
  ScrollTrigger.create({
    onUpdate: (self) => { dir = self.direction; speed = 0.6 + Math.min(6, Math.abs(self.getVelocity()) / 260); },
  });

  // the footer product strip rides the same clock
  const strip = $('#footerStripTrack');
  const all = PRODUCTS.filter((p) => p.code !== '8970785');     // one Kipstorm image is enough
  all.concat(all).forEach((p) => {
    const im = document.createElement('img');
    im.src = photo(p, 300); im.alt = '';   // eager: lazy images in a clipped, transformed strip load late
    strip.appendChild(im);
  });
  let sx = 0;
  gsap.ticker.add(() => {
    if (REDUCED) return;
    sx -= 0.45 * dir;
    const w = strip.scrollWidth / 2;
    if (w) { if (sx <= -w) sx += w; if (sx > 0) sx -= w; }
    strip.style.transform = `translateX(${sx}px)`;
  });
}

/* ── 9. kit builder: the panoplies ──────────────────────────── */
const kitState = { who: 'man', day: 'practice', top: 0 };
const currentKit = () => KITS.find((k) => k.who === kitState.who && k.day === kitState.day);

function kitCard(role, code, extra = '') {
  const p = byCode[code];
  return `<div class="kit-card" role="button" tabindex="0" data-code="${code}" data-track="Kit: ${p.name}">
    <b></b><b></b><i></i><i></i>
    <span class="kit-card__role eyebrow">${role}</span>
    <span class="kit-card__img"><img src="${photo(p, 600)}" alt="${p.full}"></span>
    <span class="kit-card__name">${p.name}</span>
    <span class="kit-card__meta eyebrow">${code} · ${inr(p.price) || p.status || 'price on decathlon.in'}</span>
    ${extra}
  </div>`;
}

function renderKit(animate = true) {
  const k = currentKit();
  const topCode = k.tops[kitState.top % k.tops.length];
  const swap = k.tops.length > 1
    ? `<button class="kit-card__swap button cc-sm" aria-label="Show the other top"><span>${(kitState.top % k.tops.length) + 1}/${k.tops.length} ↻</span></button>`
    : '';
  $('#kitLeft').innerHTML = kitCard('Shoes', k.shoes);
  $('#kitRight').innerHTML = kitCard('Top', topCode, swap) + kitCard('Shorts', k.shorts);

  $$('.kit-card').forEach((card) => {
    const go = () => openPanel(card.dataset.code, k);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
  const sw = $('.kit-card__swap');
  if (sw) sw.addEventListener('click', (e) => { e.stopPropagation(); kitState.top++; renderKit(); });

  $$('.kit__seg [data-who]').forEach((b) => b.classList.toggle('is-on', b.dataset.who === kitState.who));
  $$('.kit__seg [data-day]').forEach((b) => b.classList.toggle('is-on', b.dataset.day === kitState.day));

  const pieces = [k.shoes, topCode, k.shorts].map((c) => byCode[c]);
  const known = pieces.filter((p) => p.price != null);
  const sum = known.reduce((a, p) => a + p.price, 0);
  $('#kitItems').textContent = pieces.length;
  $('#kitTotal').textContent = known.length === pieces.length ? inr(sum) : `${inr(sum)}+`;
  setScrambled($('#kitStatus'), `>_${kitState.who}_${kitState.day}_day_kit`.toUpperCase(), 0.6);
  setScrambled($('#kitModels'), kitCodes(k).join(' · '), 0.6);
  const note = $('#kitNote');
  const flagged = pieces.find((p) => p.note);
  note.hidden = !flagged && k.tops.length < 2;
  note.textContent = flagged ? `+ shoes: ${flagged.note}` : (k.tops.length > 1 ? `Two tops in this kit: ${k.tops.join(' / ')}` : '');

  if (animate && !REDUCED) {
    gsap.fromTo('.kit-card', { opacity: 0, y: 30, rotationX: -18 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.09, ease: 'back.out(1.4)', transformPerspective: 900 });
    gsap.fromTo('#kitBar', { width: '0%' }, { width: '100%', duration: 0.9, ease: 'power2.out' });
  } else {
    gsap.set('#kitBar', { width: '100%' });
  }
}

function buildKit() {
  $$('.kit__seg [data-who]').forEach((b) => b.addEventListener('click', () => {
    if (kitState.who === b.dataset.who) return;
    kitState.who = b.dataset.who; kitState.top = 0; renderKit();
  }));
  $$('.kit__seg [data-day]').forEach((b) => b.addEventListener('click', () => {
    if (kitState.day === b.dataset.day) return;
    kitState.day = b.dataset.day; kitState.top = 0; renderKit();
  }));
  $('#kitRandom').addEventListener('click', () => {
    let k;
    do { k = KITS[Math.floor(Math.random() * KITS.length)]; } while (k === currentKit());
    kitState.who = k.who; kitState.day = k.day; kitState.top = 0;
    renderKit();
  });
  $('#kitShop').addEventListener('click', () => { const k = currentKit(); openPanel(k.shoes, k); });
  renderKit(false);

  // the section scales and blurs into focus, like the live build
  gsap.fromTo('.kit__grid',
    { scale: 1.12, filter: 'blur(14px)', opacity: 0.35 },
    { scale: 1, filter: 'blur(0px)', opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.cc-kit', start: 'top bottom', end: 'top 20%', scrub: true } });
  gsap.to('.kit__crest', {
    rotate: 18, ease: 'none',
    scrollTrigger: { trigger: '.cc-kit', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });
  ScrollTrigger.create({ trigger: '.cc-kit', start: 'top 60%', once: true, onEnter: () => renderKit(true) });
}

/* ── 10. footer scale transition ────────────────────────────── */
function initFooterScaleTransition() {
  gsap.fromTo('.footer',
    { yPercent: 12, scale: 0.94 },
    { yPercent: 0, scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.cc-footer', start: 'top bottom', end: 'top 20%', scrub: true } });
  gsap.from('.footer__wordmark span', {
    yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out',
    scrollTrigger: { trigger: '.footer__wordmark', start: 'top 95%' },
  });
}


/* ── 12. lenis smooth scroll ────────────────────────────────── */
let lenis = null;
function initLenis() {
  if (REDUCED || typeof Lenis === 'undefined') return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // in-page links glide instead of jumping
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  }));
}

/* ── boot ───────────────────────────────────────────────────── */
[...SERIES, byCode['8960640']].forEach((p) => imageFor(p, 1600));   // same width the hero asks for, so the cut is reused
buildHero();
buildFeature();
buildRange();
buildKit();
initScrambleFX();
initCustomCursor();
initLenis();
initFeature();
initBreaker();
initFooterScaleTransition();
initHeroSlider();
initFilm();
$('#panelClose').addEventListener('click', closePanel);
$('#panel').addEventListener('click', (e) => { if (e.target.id === 'panel') closePanel(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#panel').hidden) closePanel(); });
runPreloader();
addEventListener('load', () => ScrollTrigger.refresh());
