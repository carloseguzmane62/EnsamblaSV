/* ENSAMBLA — motor de interacciones (sin dependencias)
   - Barra de progreso de scroll
   - Hero 3D en scroll (tipo Aceternity ContainerScroll)
   - Parallax de glows ambientales por sección
   - Reveal-on-scroll con stagger
   - Tilt 3D en tarjetas (mousemove)
   Todo respeta prefers-reduced-motion y solo anima transform/opacity. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
  var desktop = function () { return window.innerWidth > 768; };

  /* ---------- Navbar: menú móvil + encoger al scroll ---------- */
  var nav = document.querySelector('.nav');
  var toggle = nav && nav.querySelector('.nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(nav.querySelectorAll('.nav__link, .nav__cta'), function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Barra de progreso ---------- */
  var bar = document.getElementById('progress');

  /* ---------- Hero 3D ---------- */
  var hero = document.querySelector('.hero-mockup');

  /* ---------- Glows ambientales + parallax ---------- */
  var main = document.querySelector('.site-main');
  var parallaxEls = [];

  function luminance(rgb) {
    var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(rgb);
    if (!m) return 1;
    if (m[4] !== undefined && parseFloat(m[4]) === 0) return -1; // transparente
    return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
  }

  if (main && !reduce) {
    Array.prototype.forEach.call(main.children, function (sec) {
      if (sec.tagName !== 'DIV') return;
      if (sec.querySelector('.hero-mockup')) return; // el hero tiene su propio efecto
      var lum = luminance(getComputedStyle(sec).backgroundColor);
      var dark = lum >= 0 && lum < 0.25;
      var light = lum >= 0.85;
      if (!dark && !light) return;
      sec.classList.add('glow-section');
      if (light) sec.classList.add('glow-section--light');
      var a = document.createElement('span'); a.className = 'orb orb--a'; a.setAttribute('data-parallax', '0.10');
      var b = document.createElement('span'); b.className = 'orb orb--b'; b.setAttribute('data-parallax', '0.18');
      sec.insertBefore(b, sec.firstChild);
      sec.insertBefore(a, sec.firstChild);
      parallaxEls.push(a, b);
    });
  }

  function renderScroll() {
    ticking = false;
    // navbar encogido al hacer scroll
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 8);
    // progreso
    if (bar) {
      var h = document.documentElement.scrollHeight - vh();
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    }
    // hero 3D
    if (hero && !reduce) {
      if (!desktop()) { hero.style.transform = ''; }
      else {
        var r = hero.getBoundingClientRect();
        var start = vh() * 0.95, end = vh() * 0.35;
        var p = (start - r.top) / (start - end);
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        hero.style.transform = 'perspective(1400px) rotateX(' + (22 * (1 - p)).toFixed(2) + 'deg) scale(' + (0.92 + 0.08 * p).toFixed(3) + ')';
      }
    }
    // parallax de orbs
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var delta = (vh() / 2 - center) * parseFloat(el.getAttribute('data-parallax'));
      el.style.transform = 'translate3d(0,' + delta.toFixed(1) + 'px,0)';
    }
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(renderScroll); } }
  renderScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ---------- Reveal-on-scroll ---------- */
  var targets = [];
  Array.prototype.forEach.call(document.querySelectorAll('.reveal-grid, .bento'), function (grid) {
    Array.prototype.forEach.call(grid.children, function (card, i) {
      card.setAttribute('data-reveal', '');
      card.style.transitionDelay = (Math.min(i, 7) * 45) + 'ms';
      targets.push(card);
    });
  });
  if (main) {
    Array.prototype.forEach.call(main.children, function (sec) {
      if (sec.tagName !== 'DIV') return;
      if (sec.querySelector('.reveal-grid') || sec.querySelector('.bento')) return;
      if (sec.querySelector('.hero-mockup')) return;
      sec.setAttribute('data-reveal', '');
      targets.push(sec);
    });
  }
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Tilt 3D en tarjetas ---------- */
  if (!reduce) {
    var tiltEls = document.querySelectorAll('.reveal-grid > *, .tcard, .bento__item');
    Array.prototype.forEach.call(tiltEls, function (el) {
      el.addEventListener('mousemove', function (e) {
        if (!desktop()) return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform .06s linear';
        el.style.transform = 'perspective(800px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .45s cubic-bezier(.22,.61,.36,1)';
        el.style.transform = '';
      });
    });
  }

  /* ---------- Toggle mensual / anual en precios ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.pricing__toggle'), function (tg) {
    var pricing = tg.closest('.pricing');
    if (!pricing) return;
    tg.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cycle]');
      if (!btn) return;
      pricing.classList.toggle('is-annual', btn.getAttribute('data-cycle') === 'y');
      Array.prototype.forEach.call(tg.querySelectorAll('button'), function (b) {
        b.classList.toggle('is-active', b === btn);
      });
    });
  });

  /* ---------- Typewriter del hero ---------- */
  (function () {
    var tw = document.querySelector('.tw');
    if (!tw) return;
    var wordEl = tw.querySelector('.tw__word');
    var words = (tw.getAttribute('data-words') || '').split(',')
      .map(function (s) { return s.trim(); }).filter(Boolean);
    if (!wordEl || words.length < 2) return;
    if (reduce) { wordEl.textContent = words[0]; return; } // sin animación: palabra fija

    var TYPE = 78, DEL = 42, HOLD = 1900, PAUSE = 380;
    var wi = 0, ci = words[0].length, deleting = true; // arranca borrando "organizada"
    function tick() {
      var w = words[wi];
      if (deleting) {
        ci--;
        wordEl.textContent = w.slice(0, ci);
        if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, PAUSE); }
        setTimeout(tick, DEL);
      } else {
        ci++;
        wordEl.textContent = w.slice(0, ci);
        if (ci >= w.length) { deleting = true; return setTimeout(tick, HOLD); }
        setTimeout(tick, TYPE);
      }
    }
    setTimeout(tick, 2000); // deja leer "organizada" antes de animar
  })();

  /* ---------- Marquee de testimonios (loop sin costura) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.tcol__track'), function (track) {
    track.style.setProperty('--dur', (track.getAttribute('data-dur') || 30) + 's');
    if (reduce) return; // sin animación: no duplicar contenido
    // Segunda copia para que translateY(-50%) empalme; se marca .tq--dup para ocultarla en móvil.
    var src = document.createElement('div');
    src.innerHTML = track.innerHTML;
    Array.prototype.slice.call(src.children).forEach(function (card) {
      card.classList.add('tq--dup');
      card.setAttribute('aria-hidden', 'true');
      track.appendChild(card);
    });
  });
})();
