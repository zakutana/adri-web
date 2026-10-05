(function () {
  'use strict';
  var d = document;
  d.documentElement.classList.add('js');

  /* sticky nav background */
  var nav = d.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  var toggle = d.getElementById('navToggle');
  var menu = d.getElementById('navMenu');
  var setMenu = function (open) {
    toggle.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    if (open) nav.classList.add('is-solid'); else onScroll();
  };
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* reveal on scroll (staggered inside grids) */
  var items = d.querySelectorAll('.reveal');
  items.forEach(function (el, i) {
    var sibs = el.parentElement.querySelectorAll(':scope > .reveal');
    el.style.setProperty('--d', Math.max(0, Array.prototype.indexOf.call(sibs, el)) * 0.08 + 's');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* five elements wheel */
  var DATA = {
    fire:  { name: 'Oheň',  color: '#e8602c', text: 'Léto. Orgány: srdce a tenké střevo. Rozkvět, radost a pohyb – energie na vrcholu.' },
    earth: { name: 'Země',  color: '#c99700', text: 'Pozdní léto. Orgány: slezina a žaludek. Střed, který živí – trávení, výživa a stabilita.' },
    metal: { name: 'Kov',   color: '#6b6259', text: 'Podzim. Orgány: plíce a tlusté střevo. Dýchání, uvolňování a očista od toho, co už nepotřebujeme.' },
    water: { name: 'Voda',  color: '#2866a8', text: 'Zima. Orgány: ledviny a močový měchýř. Hluboké zdroje energie, odpočinek a regenerace.' },
    wood:  { name: 'Dřevo', color: '#0f8a3c', text: 'Jaro. Orgány: játra a žlučník. Růst, plynulý tok energie a schopnost se přizpůsobit.' }
  };
  var panel = d.getElementById('elPanel');
  var title = d.getElementById('elTitle');
  var text = d.getElementById('elText');
  var nodes = d.querySelectorAll('.node');
  var show = function (key) {
    var e = DATA[key];
    title.textContent = e.name;
    text.textContent = e.text;
    panel.style.setProperty('--panel', e.color);
    nodes.forEach(function (n) { n.classList.toggle('is-active', n.dataset.el === key); });
  };
  nodes.forEach(function (n) {
    n.addEventListener('click', function () { show(n.dataset.el); });
    n.addEventListener('mouseenter', function () { show(n.dataset.el); });
    n.addEventListener('focus', function () { show(n.dataset.el); });
  });

  /* arrows between nodes: arcs on a circle of r=38 around (50,50), order fire→earth→metal→water→wood */
  var arcs = d.getElementById('arcs');
  var NS = 'http://www.w3.org/2000/svg';
  var pt = function (deg) {
    var r = deg * Math.PI / 180;
    return (50 + 38 * Math.cos(r)).toFixed(2) + ' ' + (50 + 38 * Math.sin(r)).toFixed(2);
  };
  for (var i = 0; i < 5; i++) {
    var a = -90 + i * 72;
    var p = d.createElementNS(NS, 'path');
    p.setAttribute('d', 'M' + pt(a + 18) + ' A38 38 0 0 1 ' + pt(a + 54));
    arcs.appendChild(p);
  }

  /* click-to-load map (nothing is requested from Google until the visitor asks) */
  var mapBtn = d.getElementById('mapLoad');
  mapBtn.addEventListener('click', function () {
    var f = d.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Šenovská 2249, Petřvald') + '&hl=cs&z=16&output=embed';
    f.title = 'Mapa – Šenovská 2249, Petřvald';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    d.getElementById('map').appendChild(f);
    d.querySelector('.map__ph').remove();
  });

  d.getElementById('year').textContent = new Date().getFullYear();
})();
