/* ══════════════════════════════════════════════════════════════
   KIPRUN live analytics — the tracker.
   Anonymous: a random visitor id (localStorage) and session id
   (sessionStorage); no cookies, no names, no IPs. Events are batched
   to api/collect, which analytics/server.py receives. Where no
   collector runs (e.g. GitHub Pages) the beacons simply 404.

   view     page load (device, referrer)
   click    every click, labelled by the nearest [data-track] / button text
   rage     3+ clicks within 1s in a 30px circle
   dead     a click on something non-interactive that changes nothing
   open     a product detail panel opened        (window.kt from main.js)
   preview  a product shown in the 3D stage      (window.kt from main.js)
   beat     every 5s of active time: which section, how far down
   leave    the tab closed or navigated away
   ══════════════════════════════════════════════════════════════ */
(() => {
  const ENDPOINT = document.currentScript?.dataset.endpoint || 'api/collect';
  const rid = () => Math.random().toString(36).slice(2, 12);
  const idFrom = (kind, key) => {
    try { const s = window[kind]; let v = s.getItem(key); if (!v) s.setItem(key, (v = rid())); return v; }
    catch { return rid(); }
  };
  const vid = idFrom('localStorage', 'kt_vid');
  const sid = idFrom('sessionStorage', 'kt_sid');

  /* ── queue + transport ── */
  const queue = [];
  function flush() {
    if (!queue.length) return;
    const body = JSON.stringify({ sid, vid, ev: queue.splice(0, 50) });
    // text/plain keeps a cross-origin collector free of CORS preflights
    if (!navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'text/plain' }))) {
      fetch(ENDPOINT, { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }
  const push = (t, o = {}) => { queue.push({ t, ...o }); if (queue.length >= 25) flush(); };
  setInterval(flush, 3000);

  /* ── where on the page ── */
  const panelOpen = () => document.getElementById('panel')?.hidden === false;
  const sectionOf = (el) => (el.closest('#panel') ? 'panel' : el.closest('.sec')?.id || 'other');
  const sectionAtCenter = () => {
    if (panelOpen()) return 'panel';
    const y = innerHeight / 2;
    const s = [...document.querySelectorAll('.sec')].find((n) => { const r = n.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    return s?.id || 'other';
  };
  const labelOf = (el) => {
    const tagged = el.closest('[data-track]');
    if (tagged) return tagged.dataset.track;
    const ctl = el.closest('a,button,[role="button"]');
    if (ctl) return (ctl.textContent.trim().replace(/\s+/g, ' ') || ctl.getAttribute('aria-label') || ctl.tagName).slice(0, 60);
    // plain content: name what it is in words, not selectors
    const own = el.textContent.trim().replace(/\s+/g, ' ');
    const tag = el.tagName.toLowerCase();
    const kind = /^h[1-6]$/.test(tag) ? 'Heading' : tag === 'img' ? 'Image' : /^(p|b|span|strong|em|small|li)$/.test(tag) ? 'Text' : 'Area';
    if (tag === 'img') return `Image "${(el.alt || '').slice(0, 40)}"`;
    return own && own.length <= 40 ? `${kind} "${own}"` : `${kind} in ${el.closest('[class]')?.className.split(/\s+/)[0] || tag}`;
  };

  /* ── view ── */
  const device = matchMedia('(pointer:coarse)').matches ? (innerWidth < 768 ? 'mobile' : 'tablet') : 'desktop';
  push('view', { label: location.pathname, ref: document.referrer.slice(0, 120), device });

  /* ── active time, section attention, scroll depth ── */
  let lastInput = Date.now(), lastBeat = Date.now(), depth = 0;
  const measureDepth = () => {
    const h = document.documentElement.scrollHeight;
    depth = Math.max(depth, Math.min(100, Math.round(((scrollY + innerHeight) / h) * 100)));
  };
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach((e) =>
    addEventListener(e, () => { lastInput = Date.now(); }, { passive: true, capture: true }));
  addEventListener('scroll', measureDepth, { passive: true });
  addEventListener('load', measureDepth);

  // idle for a minute, or tab hidden, is not time spent on the site
  function beat(final = false) {
    const now = Date.now(), ms = Math.min(now - lastBeat, 10000);
    lastBeat = now;
    if (!final && document.visibilityState !== 'visible') return;
    if (now - lastInput > 60000) return;
    push('beat', { ms, sec: sectionAtCenter(), depth });
  }
  setInterval(beat, 5000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { beat(true); flush(); } else lastBeat = Date.now();
  });
  addEventListener('pagehide', () => { beat(true); push('leave'); flush(); });

  /* ── clicks, rage clicks, dead clicks ── */
  const INTERACTIVE = 'a,button,input,select,textarea,label,summary,[role="button"],[tabindex],[data-track]';
  // things that change on their own: the cursor, the auto-rotating hero, the top bar's section readout
  const IGNORE = '#cursor,.hud__now,.hud__progress,.hero-slider,.hero__series,#heroCount';
  let burst = [];

  // a real response adds/removes content or flips state; inline-style tweens are just ambient motion
  function watchForDeadClick(label, sec) {
    let changed = false;
    const mo = new MutationObserver((list) => {
      changed ||= list.some((m) => {
        const el = m.target.nodeType === 1 ? m.target : m.target.parentElement;
        return el && !el.closest(IGNORE);
      });
    });
    mo.observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributeFilter: ['class', 'hidden', 'open', 'src', 'aria-expanded', 'aria-selected', 'aria-pressed'],
    });
    const url = location.href;
    setTimeout(() => {
      mo.disconnect();
      if (!changed && location.href === url && !String(getSelection())) push('dead', { label, sec });
    }, 700);
  }

  addEventListener('click', (e) => {
    const el = e.target instanceof Element ? e.target : e.target?.parentElement;
    if (!el) return;
    const label = labelOf(el), sec = sectionOf(el);
    push('click', { label, sec });

    const t = e.timeStamp;
    burst = burst.filter((c) => t - c.t < 1000 && Math.hypot(c.x - e.clientX, c.y - e.clientY) < 30);
    burst.push({ t, x: e.clientX, y: e.clientY });
    if (burst.length === 3) push('rage', { label, sec });   // once per burst

    // one dead click per burst: hammering dead text is a rage click, not ten dead ones
    if (burst.length === 1 && !el.closest(INTERACTIVE) && getComputedStyle(el).cursor !== 'pointer') watchForDeadClick(label, sec);
  }, true);

  /* the site reports its own moments: window.kt('open', 'Kipride Max · 8960547') */
  window.kt = (t, label) => push(t, { label: String(label).slice(0, 120), sec: sectionAtCenter() });
})();
