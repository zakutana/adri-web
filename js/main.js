(function () {
  'use strict';

  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;

  root.classList.add('js');
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Navigation: mobile menu, name appears once the profile scrolls away
  ------------------------------------------------------------------ */
  var nav = $('#nav'), toggle = $('#navToggle'), menu = $('#navMenu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    d.body.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  var pname = $('#profileName');
  if (pname && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var e = es[0];
      nav.classList.toggle('is-past', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-64px 0px 0px 0px' }).observe(pname);
  }

  /* ------------------------------------------------------------------
     Scroll: progress line + gentle parallax
  ------------------------------------------------------------------ */
  var prog = $('#navProgress');
  var para = $$('[data-parallax]').map(function (el) { return { el: el, k: parseFloat(el.dataset.parallax) || 0 }; });
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    prog.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
    if (reduce) return;
    para.forEach(function (p) {
      var r = p.el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > window.innerHeight + 300) return;
      var c = r.top + r.height / 2 - window.innerHeight / 2;
      p.el.style.setProperty('--py', (c * p.k * -1).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     Headings split into words, reveal on scroll
  ------------------------------------------------------------------ */
  $$('.split').forEach(function (el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/[ \t\r\n]+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span class="wi" style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
    el.classList.add('is-split');
  });

  // stagger siblings
  $$('.reveal').forEach(function (el) {
    var sibs = $$(':scope > .reveal', el.parentElement);
    if (sibs.length > 1) el.style.setProperty('--d', (sibs.indexOf(el) * 0.1).toFixed(2) + 's');
  });

  var revealTargets = $$('.reveal, .split, .wave');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  // pointer-follow spotlight on glass surfaces
  if (!coarse) {
    $$('.glass').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------
     Services: tabs
  ------------------------------------------------------------------ */
  var tabs = $$('.svc__tab'), panels = $$('.svc__panel'), mark = $('#svcMark');
  function selectSvc(key, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.svc === key;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) {
      var on = p.id === 'panel-' + key;
      p.hidden = !on;
      p.classList.toggle('is-active', on);
      if (on && mark) mark.textContent = p.dataset.mark;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectSvc(t.dataset.svc); });
    t.addEventListener('keydown', function (e) {
      var n = null, k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); selectSvc(tabs[n].dataset.svc, true); }
    });
  });
  $$('[data-svc-link]').forEach(function (a) {
    a.addEventListener('click', function () { selectSvc(a.dataset.svcLink); });
  });

  /* ------------------------------------------------------------------
     Five elements: mandala
  ------------------------------------------------------------------ */
  var orbs = $$('.orb'), els = $$('.el'), cores = $$('.core');
  var order = ['wood', 'fire', 'earth', 'metal', 'water'];
  var cur = 'wood', timer = null, resumeT = null, seen = false;

  function selectEl(key) {
    cur = key;
    orbs.forEach(function (o) {
      var on = o.dataset.el === key;
      o.classList.toggle('is-active', on);
      o.setAttribute('aria-pressed', String(on));
    });
    els.forEach(function (e) { e.classList.toggle('is-active', e.dataset.el === key); });
    cores.forEach(function (c) { c.classList.toggle('is-active', c.dataset.el === key); });
  }
  function stop() { clearInterval(timer); timer = null; }
  function play() {
    stop();
    if (reduce || !seen) return;
    timer = setInterval(function () {
      selectEl(order[(order.indexOf(cur) + 1) % order.length]);
    }, 4800);
  }
  function hold() { stop(); clearTimeout(resumeT); resumeT = setTimeout(play, 9000); }

  orbs.forEach(function (o) {
    o.addEventListener('click', function () { selectEl(o.dataset.el); hold(); });
    o.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { selectEl(o.dataset.el); hold(); } });
    o.addEventListener('focus', function () { selectEl(o.dataset.el); hold(); });
  });
  var mandala = $('#mandala');
  if (mandala && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      seen = es[0].isIntersecting;
      if (seen) play(); else stop();
    }, { threshold: 0.35 }).observe(mandala);
  }

  /* call button floats on mobile, but steps aside where the real buttons are */
  var fab = $('.fab');
  if (fab && 'IntersectionObserver' in window) {
    var seenBtn = new Set();
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? seenBtn.add(e.target) : seenBtn.delete(e.target); });
      fab.classList.toggle('is-hidden', seenBtn.size > 0);
    }, { threshold: 0.2 });
    [$('.profile__actions'), $('.contact__cta')].forEach(function (el) { if (el) fio.observe(el); });
  }

  /* ------------------------------------------------------------------
     Map: loaded only on request
  ------------------------------------------------------------------ */
  var mapBtn = $('#mapLoad');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Šenovská 2249, Petřvald') + '&hl=cs&z=16&output=embed';
      f.title = 'Mapa – Šenovská 2249, Petřvald';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      $('#map').appendChild(f);
      var ph = $('.map__ph'); if (ph) ph.remove();
    });
  }

  /* ------------------------------------------------------------------
     FX: fireflies everywhere, water ripples on the cover
  ------------------------------------------------------------------ */
  function sprite(rgb) {
    var c = d.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(' + rgb + ',1)');
    g.addColorStop(0.22, 'rgba(' + rgb + ',.6)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return c;
  }
  var SPR = [sprite('255,238,200'), sprite('255,238,200'), sprite('190,176,255'), sprite('255,205,236')];

  function Fx(canvas, opt) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.opt = opt || {};
    this.host = canvas.parentElement;
    this.flies = []; this.rips = [];
    this.vis = false; this.running = false; this.last = 0; this.nextAuto = 0; this.lastSpawn = 0; this.lx = -999; this.ly = -999;
    var self = this;
    this.resize();
    if ('ResizeObserver' in window) new ResizeObserver(function () { self.resize(); }).observe(this.host);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { self.vis = es[0].isIntersecting; self.vis ? self.start() : self.stop(); }, { threshold: 0 }).observe(this.host);
    }
    d.addEventListener('visibilitychange', function () { d.hidden ? self.stop() : (self.vis && self.start()); });
    if (this.opt.ripples) this.bindPointer();
  }
  Fx.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = this.host.getBoundingClientRect();
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
    this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round((this.opt.flies || 26) * (coarse ? 0.6 : 1) * Math.min(1.4, Math.max(0.6, this.w / 1300)));
    this.flies = [];
    for (var i = 0; i < n; i++) this.flies.push(this.makeFly(true));
  };
  Fx.prototype.makeFly = function (anywhere) {
    return {
      u: Math.random(), v: anywhere ? Math.random() : 1.04 + Math.random() * 0.1,
      sp: 0.012 + Math.random() * 0.03, s: 0.5 + Math.random() * 1.1,
      ph: Math.random() * 6.28, tw: 0.6 + Math.random() * 1.8, fr: 0.3 + Math.random() * 0.7,
      spr: SPR[(Math.random() * SPR.length) | 0], a: 0.45 + Math.random() * 0.55
    };
  };
  Fx.prototype.spawn = function (u, v, now) {
    var base = this.w * (0.045 + Math.random() * 0.03);
    this.rips.push({ u: u, v: v, t0: now, dur: 2800 + Math.random() * 900, max: base });
    if (this.rips.length > 14) this.rips.shift();
  };
  Fx.prototype.bindPointer = function () {
    var self = this, host = this.host;
    function pos(e) {
      var r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    }
    // only the real water of the cover: the bottom strip and the pond on the left
    function inWater(p) { var u = p.x / p.w, v = p.y / p.h; return (v > 0.935 && v < 0.99) || (u < 0.58 && v > 0.84 && v < 0.98); }
    host.addEventListener('pointermove', function (e) {
      if (reduce) return;
      var p = pos(e), now = performance.now();
      if (!inWater(p)) return;
      var dx = p.x - self.lx, dy = p.y - self.ly;
      if (now - self.lastSpawn > 120 && dx * dx + dy * dy > 1600) {
        self.lastSpawn = now; self.lx = p.x; self.ly = p.y;
        self.spawn(p.x / p.w, p.y / p.h, now);
      }
    });
    host.addEventListener('pointerdown', function (e) {
      if (reduce) return;
      var p = pos(e);
      if (inWater(p)) { var now = performance.now(); self.spawn(p.x / p.w, p.y / p.h, now); self.spawn(p.x / p.w, p.y / p.h, now + 260); }
    });
  };
  Fx.prototype.start = function () {
    if (reduce || this.running || !this.vis || d.hidden) return;
    this.running = true; this.last = performance.now();
    var self = this;
    (function loop(t) {
      if (!self.running) return;
      self.frame(t);
      requestAnimationFrame(loop);
    })(this.last);
  };
  Fx.prototype.stop = function () { this.running = false; };
  Fx.prototype.frame = function (t) {
    var dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
    var c = this.ctx, w = this.w, h = this.h, sec = t / 1000;
    c.clearRect(0, 0, w, h);
    var scale = Math.min(1.4, Math.max(0.7, w / 1300));

    for (var i = 0; i < this.flies.length; i++) {
      var f = this.flies[i];
      f.v -= f.sp * dt;
      f.u += Math.sin(sec * f.fr + f.ph) * 0.00035;
      if (f.v < -0.06) { var nf = this.makeFly(false); this.flies[i] = f = nf; }
      var a = f.a * (0.3 + 0.7 * Math.abs(Math.sin(sec * f.tw + f.ph)));
      var s = 16 * f.s * scale;
      c.globalAlpha = a;
      c.drawImage(f.spr, f.u * w - s / 2, f.v * h - s / 2, s, s);
    }
    c.globalAlpha = 1;

    if (this.opt.ripples) {
      if (t > this.nextAuto) {
        if (Math.random() < 0.6) this.spawn(0.06 + Math.random() * 0.49, 0.86 + Math.random() * 0.11, t);
        else this.spawn(0.58 + Math.random() * 0.4, 0.945 + Math.random() * 0.04, t);
        this.nextAuto = t + 1700 + Math.random() * 1900;
      }
      for (var j = this.rips.length - 1; j >= 0; j--) {
        var r = this.rips[j], p = (t - r.t0) / r.dur;
        if (p < 0) continue;
        if (p >= 1) { this.rips.splice(j, 1); continue; }
        var e = 1 - Math.pow(1 - p, 2.2), al = Math.pow(1 - p, 1.6);
        var x = r.u * w, y = r.v * h;
        c.lineWidth = 1.3 * scale;
        c.strokeStyle = 'rgba(225,220,255,' + (al * 0.62).toFixed(3) + ')';
        c.beginPath(); c.ellipse(x, y, Math.max(1, r.max * e), Math.max(0.5, r.max * e * 0.27), 0, 0, 6.2832); c.stroke();
        var e2 = Math.max(0, e - 0.22);
        c.strokeStyle = 'rgba(255,228,170,' + (al * 0.4).toFixed(3) + ')';
        c.beginPath(); c.ellipse(x, y, Math.max(1, r.max * e2 * 0.72), Math.max(0.5, r.max * e2 * 0.72 * 0.27), 0, 0, 6.2832); c.stroke();
      }
    }
  };

  if (!reduce) {
    var cv;
    if ((cv = $('#coverFx'))) new Fx(cv, { flies: 34, ripples: true });
    if ((cv = $('#fiveFx'))) new Fx(cv, { flies: 26 });
    if ((cv = $('#contactFx'))) new Fx(cv, { flies: 22 });
  }
})();
