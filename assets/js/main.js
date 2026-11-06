/* ============================================================
   LSG Beauty — comportement & animations
   GSAP + ScrollTrigger + Lenis (tous en local, aucun CDN).
   Règles : courbes douces (expo/power3), transform + opacity en priorité,
   stagger partout, version allégée si prefers-reduced-motion.
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const D = window.LSG;
  const html = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const safe = (name, fn) => { try { fn(); } catch (e) { console.error('[LSG] ' + name, e); } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const NBSP = ' ';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ───────────────────────── Prix : formatage ───────────────────────── */
  const fmtPrice = (p) => {
    if (p === null || p === undefined) return '<span class="row__p">—</span>';
    if (typeof p === 'string') return '<span class="row__p"><small>' + esc(p) + '</small></span>';
    const t = Number.isInteger(p) ? String(p) : p.toFixed(2).replace('.', ',');
    return '<span class="row__p">' + t + NBSP + '€</span>';
  };
  const countServices = () => D.groups.reduce((n, g) => n + g.cats.reduce((m, c) => m + c.items.length, 0), 0);

  /* ───────────────────────── Découpe de texte (masques) ───────────────────────── */
  function splitText(el, mode) {
    const out = [];
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const wrap = document.createElement('span');
            wrap.setAttribute('aria-hidden', 'true');
            if (mode === 'chars') {
              wrap.className = 'wd';
              Array.from(part).forEach((c) => {
                const s = document.createElement('span');
                s.className = 'ch'; s.textContent = c; wrap.appendChild(s); out.push(s);
              });
            } else {
              wrap.className = 'wm';
              const i = document.createElement('span');
              i.className = 'wi'; i.textContent = part; wrap.appendChild(i); out.push(i);
            }
            frag.appendChild(wrap);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('wd') && !n.classList.contains('wm')) {
          walk(n);
        }
      });
    };
    walk(el);
    return out;
  }

  /* ───────────────────────── Construction du DOM dynamique ───────────────────────── */
  function buildUniverse() {
    const track = $('[data-univ-track]');
    if (!track) return;
    const media = {
      laser: { img: 'assets/img/planity-3.jpg', pos: '18% 50%', alt: 'Accueil et appareils de soin de l’institut', desc: 'Laser diode certifié CE médical et dépilation définitive Esthélyse.' },
      cire: { img: 'assets/img/g-09.jpg', pos: '50% 60%', alt: 'Cabine de soin rose poudré', desc: 'Cire française Perron Rigot et cire Epiloderm à l’effet peeling.' },
      minceur: { img: 'assets/img/g-03.jpg', pos: '50% 50%', alt: 'Cabine LPG aux murs rayés', desc: 'LPG, radiofréquence, Cryocell, Biosliming et drainage Renata França.' },
      visage: { video: 'assets/video/soin-peignoir.mp4', alt: '', desc: 'Peeling Noon, microneedling, OxyGénéo, LPG Alliance, radiofréquence.' },
      regard: { img: 'assets/img/g-08.jpg', pos: '50% 40%', alt: 'Regard maquillé et cils', desc: 'Rehaussement des cils, teinture et restructuration des sourcils.' },
      mains: { img: 'assets/img/planity-2.jpg', pos: '36% 72%', alt: 'Poste de manucure et fauteuil émeraude', desc: 'Vernis semi-permanent, manucure et spa des pieds Pro Nails.' },
      corps: { img: 'assets/img/planity-5-crop.jpg', pos: '50% 40%', alt: 'Modelage des jambes', desc: 'Modelages relaxants, gommage corps et soin dos parfait.' },
      uv: { img: 'assets/img/g-07.jpg', pos: '50% 50%', alt: 'Cabine de bronzage UV', desc: 'Séances UV en cabine, avec examen de la peau à la première visite.' }
    };
    D.groups.forEach((g, i) => {
      const m = media[g.id] || {};
      const card = document.createElement('article');
      card.className = 'ucard';
      card.setAttribute('data-tilt', '');
      const mediaHtml = m.video
        ? '<video muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1" data-lazy-video><source src="' + m.video + '" type="video/mp4"></video>'
        : '<img src="' + m.img + '" alt="' + esc(m.alt || '') + '" loading="lazy" style="object-position:' + (m.pos || '50% 50%') + '">';
      card.innerHTML =
        '<div class="ucard__media">' + mediaHtml + '</div>' +
        '<span class="glare" aria-hidden="true"></span>' +
        '<div class="ucard__body">' +
        '<span class="ucard__n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<h3>' + esc(g.title) + '</h3>' +
        '<p class="ucard__sub">' + esc(m.desc || g.sub) + '</p>' +
        '<div class="ucard__row"><span class="ucard__price">dès ' + g.from + NBSP + '€</span>' +
        '<button type="button" class="ucard__go" data-open="' + g.id + '">Voir les tarifs</button></div>' +
        '</div>';
      track.appendChild(card);
    });
  }

  function buildMarquee() {
    const wrap = $('[data-marquee]');
    if (!wrap) return;
    const words = ['Laser diode', 'LPG Endermologie', 'Radiofréquence', 'Peeling Noon', 'Microneedling', 'OxyGénéo', 'Drainage Renata França', 'Cryocell', 'Esthélyse', 'Rehaussement de cils', 'Spa des pieds', 'Cire Perron Rigot'];
    const set = (arr) => arr.map((w) => '<span>' + esc(w) + '</span><i>✦</i>').join('');
    const row = (arr, cls) => '<div class="marq__row ' + cls + '"><div class="marq__track">' + set(arr) + set(arr) + '</div></div>';
    wrap.innerHTML = row(words, '') + row(words.slice().reverse(), 'marq__row--alt');
  }

  function buildDust() {
    const box = $('[data-dust]');
    if (!box) return;
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('span');
      const size = 3 + Math.random() * 9;
      s.className = 'dust';
      s.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (20 + Math.random() * 75).toFixed(1) + '%;width:' + size.toFixed(1) + 'px;height:' + size.toFixed(1) + 'px;--d:' + (7 + Math.random() * 9).toFixed(1) + 's;--x:' + (Math.random() * 40 - 20).toFixed(0) + 'px;--y:' + (-30 - Math.random() * 90).toFixed(0) + 'px;animation-delay:' + (-Math.random() * 9).toFixed(1) + 's';
      box.appendChild(s);
    }
  }

  /* ───────────────────────── Carte des tarifs interactive ───────────────────────── */
  let refreshTimer;
  const refreshLater = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => window.ScrollTrigger && window.ScrollTrigger.refresh(), 160);
  };

  function buildTarifs() {
    const tabsEl = $('#tabs'), panel = $('#panel'), q = $('#q');
    if (!tabsEl || !panel) return { select() {} };
    let current = D.groups[0].id;

    D.groups.forEach((g, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tab';
      b.id = 'tab-' + g.id;
      b.dataset.id = g.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.setAttribute('aria-controls', 'panel');
      b.tabIndex = i === 0 ? 0 : -1;
      b.textContent = g.title;
      tabsEl.appendChild(b);
    });

    const rowHtml = (it, label, query) => {
      let name = esc(it[0]);
      if (query) {
        const idx = norm(it[0]).indexOf(query);
        if (idx > -1) name = esc(it[0].slice(0, idx)) + '<mark>' + esc(it[0].slice(idx, idx + query.length)) + '</mark>' + esc(it[0].slice(idx + query.length));
      }
      return '<div class="row"><span class="row__n">' + (label ? '<span class="row__c">' + esc(label) + '</span>' : '') + name +
        (it[3] ? '<span class="row__note">' + esc(it[3]) + '</span>' : '') + '</span>' +
        '<span class="row__d">' + esc(it[1]) + '</span>' + fmtPrice(it[2]) + '</div>';
    };

    const bookLink = (cat) => cat.call
      ? '<a class="cat__book ulink" href="' + D.PHONE_TEL + '">Appeler pour réserver →</a>'
      : '<a class="cat__book ulink" href="' + D.PLANITY + '" target="_blank" rel="noopener">Réserver ce soin →</a>';

    const animateIn = () => {
      if (reduce || !window.gsap) return;
      const els = $$('.cat, .empty', panel).slice(0, 14);
      if (!els.length) return;
      gsap.fromTo(els, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .05, clearProps: 'transform,opacity' });
    };

    const fmtMin = (m) => (Number.isInteger(m) ? m : m.toFixed(2).replace('.', ',')) + NBSP + '€';
    const metaHtml = (c) => {
      const prices = c.items.map((it) => it[2]).filter((p) => typeof p === 'number');
      const n = c.items.length;
      return n + NBSP + 'prestation' + (n > 1 ? 's' : '') + (prices.length ? ' · dès ' + fmtMin(Math.min.apply(null, prices)) : '');
    };
    const bodyHtml = (c) =>
      '<div class="cat__body"><div class="cat__side">' +
      (c.intro ? '<p class="cat__intro">' + esc(c.intro) + '</p>' : '') +
      (c.note ? '<p class="cat__note">' + esc(c.note) + '</p>' : '') + bookLink(c) +
      '</div><div class="cat__rows">' + c.items.map((it) => rowHtml(it)).join('') + '</div></div>';

    // Une catégorie = une ligne repliable (titre, nombre de prestations, prix de départ)
    const catHtml = (c, i, open, gid) => {
      const pid = 'cat-' + gid + '-' + i;
      return '<article class="cat' + (open ? ' is-open' : '') + '">' +
        '<h3 class="cat__h"><button type="button" class="cat__head" aria-expanded="' + open + '" aria-controls="' + pid + '">' +
        '<span class="cat__num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="cat__title">' + esc(c.title) + '</span>' +
        '<span class="cat__meta">' + metaHtml(c) + '</span>' +
        '<i class="cat__ico" aria-hidden="true"></i></button></h3>' +
        '<div class="cat__panel" id="' + pid + '"' + (open ? '' : ' hidden') + '>' + bodyHtml(c) + '</div></article>';
    };

    const setCat = (art, open, instant) => {
      const btn = $('.cat__head', art), pan = $('.cat__panel', art);
      if (!btn || !pan) return;
      btn.setAttribute('aria-expanded', String(open));
      art.classList.toggle('is-open', open);
      if (!window.gsap || reduce || instant) { pan.hidden = !open; pan.style.height = ''; return; }
      gsap.killTweensOf(pan);
      if (open) {
        pan.hidden = false;
        gsap.fromTo(pan, { height: 0 }, { height: 'auto', duration: .9, ease: 'expo.out', clearProps: 'height', onComplete: refreshLater });
        gsap.fromTo($$('.row', pan).slice(0, 30), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out', stagger: .015, clearProps: 'transform,opacity' });
      } else {
        gsap.to(pan, { height: 0, duration: .55, ease: 'power3.inOut', onComplete: () => { pan.hidden = true; pan.style.height = ''; refreshLater(); } });
      }
    };

    const syncAll = () => {
      const all = $('.cat__all', panel);
      if (!all) return;
      const arts = $$('.cat', panel);
      all.textContent = arts.every((a) => a.classList.contains('is-open')) ? 'Tout replier' : 'Tout déplier';
    };

    panel.addEventListener('click', (e) => {
      const head = e.target.closest('.cat__head');
      if (head) { const art = head.closest('.cat'); setCat(art, !art.classList.contains('is-open')); setTimeout(syncAll, 0); return; }
      const all = e.target.closest('.cat__all');
      if (all) {
        const arts = $$('.cat', panel);
        const open = !arts.every((a) => a.classList.contains('is-open'));
        arts.forEach((a) => setCat(a, open));
        setTimeout(syncAll, 0);
      }
    });

    function renderGroup(id) {
      const g = D.groups.find((x) => x.id === id) || D.groups[0];
      panel.innerHTML = (g.cats.length > 1 ? '<div class="cat__tools"><button type="button" class="cat__all">Tout déplier</button></div>' : '') +
        g.cats.map((c, i) => catHtml(c, i, i === 0, g.id)).join('');
      animateIn();
      refreshLater();
    }

    function renderSearch(query) {
      const hits = [];
      D.groups.forEach((g) => g.cats.forEach((c) => c.items.forEach((it) => {
        const hay = norm([it[0], it[3] || '', c.title, g.title].join(' '));
        if (hay.includes(query)) hits.push({ it, label: g.title + ' · ' + c.title });
      })));
      panel.innerHTML = hits.length
        ? '<article class="cat is-open is-flat"><div class="cat__h"><div class="cat__head cat__head--static"><span class="cat__title">' + hits.length + ' résultat' + (hits.length > 1 ? 's' : '') + '</span>' +
          '<span class="cat__meta">pour « ' + esc(q.value.trim()) + ' »</span></div></div><div class="cat__panel"><div class="cat__body"><div class="cat__side">' +
          '<a class="cat__book ulink" href="' + D.PLANITY + '" target="_blank" rel="noopener">Réserver en ligne →</a></div><div class="cat__rows">' +
          hits.map((h) => rowHtml(h.it, h.label, query)).join('') + '</div></div></div></article>'
        : '<p class="empty">Aucun soin ne correspond à « ' + esc(q.value.trim()) + ' ». Essayez « jambes », « peeling » ou « cils », ou appelez-nous au ' + D.PHONE_LABEL + '.</p>';
      animateIn();
      refreshLater();
    }

    function select(id, focus) {
      current = id;
      $$('.tab', tabsEl).forEach((t) => {
        const on = t.dataset.id === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      q.value = '';
      renderGroup(id);
    }

    tabsEl.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) select(b.dataset.id); });
    tabsEl.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const ids = D.groups.map((g) => g.id);
      const i = ids.indexOf(current);
      select(ids[(i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length], true);
      e.preventDefault();
    });
    q.addEventListener('input', () => {
      const v = norm(q.value.trim());
      if (v.length >= 2) {
        $$('.tab', tabsEl).forEach((t) => t.setAttribute('aria-selected', 'false'));
        renderSearch(v);
      } else if (v.length === 0) {
        select(current);
      }
    });

    renderGroup(current);
    return { select };
  }

  /* ───────────────────────── Horaires + badge ouvert/fermé ───────────────────────── */
  function buildHours() {
    const body = $('#hoursBody'), badge = $('#openBadge');
    if (!body) return;
    const H = { 0: null, 1: [14, 18], 2: [9, 19], 3: [10, 18], 4: [9, 19], 5: [9, 19], 6: [9, 17] };
    const N = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const hh = (h) => h + NBSP + 'h';
    const parisNow = () => {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: map[get('weekday')], min: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
    };
    const paint = () => {
      const now = parisNow();
      body.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) =>
        '<tr' + (d === now.day ? ' class="is-today"' : '') + '><td>' + N[d] + '</td><td>' + (H[d] ? hh(H[d][0]) + ' – ' + hh(H[d][1]) : 'Fermé') + '</td></tr>').join('');
      const today = H[now.day];
      if (today && now.min >= today[0] * 60 && now.min < today[1] * 60) {
        badge.textContent = 'Ouvert · jusqu’à ' + hh(today[1]);
        badge.classList.add('is-open');
        return;
      }
      badge.classList.remove('is-open');
      for (let k = 0; k < 8; k++) {
        const day = (now.day + k) % 7;
        if (H[day] && (k > 0 || now.min < H[day][0] * 60)) {
          badge.textContent = 'Fermé · ouvre ' + (k === 0 ? 'aujourd’hui' : k === 1 ? 'demain' : N[day].toLowerCase()) + ' à ' + hh(H[day][0]);
          return;
        }
      }
    };
    paint();
    setInterval(paint, 60000);
  }

  /* ───────────────────────── Vidéos : lecture seulement quand visibles ───────────────────────── */
  function lazyVideos() {
    const vids = $$('[data-lazy-video]');
    if (!vids.length) return;
    if (reduce || (navigator.connection && navigator.connection.saveData)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          const p = v.play(); if (p && p.catch) p.catch(() => {});
        } else { v.pause(); }
      });
    }, { rootMargin: '150px' });
    vids.forEach((v) => io.observe(v));
  }

  /* ───────────────────────── Initialisation ───────────────────────── */
  function init() {
    const hasGsap = !!(window.gsap && window.ScrollTrigger);
    $('#year') && ($('#year').textContent = new Date().getFullYear());

    safe('universe', buildUniverse);
    safe('marquee', buildMarquee);
    safe('dust', buildDust);
    let tarifsApi = { select() {} };
    safe('tarifs', () => { tarifsApi = buildTarifs(); });
    safe('hours', buildHours);
    safe('services-count', () => { const el = $('[data-count-services]'); if (el) { const n = countServices(); el.dataset.count = n; el.textContent = n; } });
    safe('lazy-videos', lazyVideos);

    // Vidéo hero : lecture auto, repli sur l'image si bloquée / mouvement réduit / économie de données
    safe('hero-video', () => {
      const v = $('.hero__video');
      if (!v) return;
      if (reduce || (navigator.connection && navigator.connection.saveData)) { v.pause(); v.removeAttribute('autoplay'); return; }
      const p = v.play(); if (p && p.catch) p.catch(() => {});
      document.addEventListener('visibilitychange', () => { document.hidden ? v.pause() : v.play().catch(() => {}); });
    });

    if (!hasGsap) { const l = $('#loader'); l && l.remove(); return; }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });


    /* Lenis : défilement fluide à inertie douce */
    let lenis = null;
    safe('lenis', () => {
      if (reduce || !window.Lenis) return;
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: .95, touchMultiplier: 1.3 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    });
    const scrollToEl = (target, opts) => {
      const el = typeof target === 'string' ? $(target) : target;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, Object.assign({ duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) }, opts || {}));
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    };
    const lockScroll = (v) => { if (lenis) (v ? lenis.stop() : lenis.start()); html.style.overflow = v && !lenis ? 'hidden' : ''; };

    /* Découpe des titres */
    const wordGroups = [];
    $$('.split-words').forEach((h) => {
      if (!h.hasAttribute('aria-label')) h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      wordGroups.push({ el: h, words: splitText(h, 'words'), inStory: !!h.closest('.story__step') });
    });
    const heroChars = [];
    $$('.hero__title .split').forEach((s) => splitText(s, 'chars').forEach((c) => heroChars.push(c)));
    const megaChars = $('[data-mega]') ? splitText($('[data-mega]'), 'chars') : [];

    /* Liens d'ancre + boutons « Voir les tarifs » */
    document.addEventListener('click', (e) => {
      const open = e.target.closest('[data-open]');
      if (open) { tarifsApi.select(open.dataset.open); scrollToEl('#tarifs'); return; }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) { if (id === '#') e.preventDefault(); return; }
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const m = $('#menu');
      if (document.body.classList.contains('menu-open')) { closeMenu(); setTimeout(() => scrollToEl(target), 650); }
      else scrollToEl(target);
    });

    /* Menu plein écran */
    let menuOpen = false, menuTl = null;
    const closeMenu = () => setMenu(false);
    function setMenu(v) {
      if (!menuTl) return;
      menuOpen = v;
      document.body.classList.toggle('menu-open', v);
      $('#burger').setAttribute('aria-expanded', v);
      $('#burger').setAttribute('aria-label', v ? 'Fermer le menu' : 'Ouvrir le menu');
      $('#menu').setAttribute('aria-hidden', !v);
      lockScroll(v);
      v ? menuTl.play() : menuTl.reverse();
    }
    safe('menu', () => {
      const m = $('#menu');
      menuTl = gsap.timeline({ paused: true, onReverseComplete: () => { m.style.visibility = 'hidden'; } });
      menuTl.set(m, { visibility: 'visible' })
        .to(m, { clipPath: 'circle(150% at calc(100% - 44px) 38px)', duration: .9, ease: 'expo.inOut' })
        .from($$('.menu__nav a', m), { yPercent: 110, duration: .9, ease: 'expo.out', stagger: .06 }, '-=.45')
        .from('.menu__foot', { opacity: 0, y: 24, duration: .8, ease: 'expo.out' }, '-=.55');
      if (reduce) menuTl.timeScale(10);
      $('#burger').addEventListener('click', () => setMenu(!menuOpen));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
    });

    /* En-tête : se cache en descendant, réapparaît en remontant ; barre de progression */
    safe('header', () => {
      const hdr = $('#hdr');
      let last = 0, hidden = false;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          hdr.classList.toggle('is-solid', y > 40);
          if (!menuOpen && Math.abs(y - last) > 6) {
            const down = y > last;
            const shouldHide = down && y > 320;
            if (shouldHide !== hidden) {
              hidden = shouldHide;
              hdr.classList.toggle('is-hidden', hidden);
              html.style.setProperty('--bar-top', hidden ? '0px' : 'var(--hdr)');
            }
            last = y;
          }
        }
      });
      gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .25 } });
      // Bouton flottant mobile : visible après le hero
      const fab = $('#fab');
      window.addEventListener('scroll', () => { fab && fab.classList.toggle('is-on', window.scrollY > window.innerHeight * .7); }, { passive: true });
    });

    /* Curseur doré + boutons magnétiques + inclinaison 3D */
    safe('cursor', () => {
      if (!fine || reduce) return;
      html.classList.add('has-cursor');
      const c = $('.cursor'), label = $('span', c);
      gsap.set(c, { opacity: 0 });
      const xTo = gsap.quickTo(c, 'x', { duration: .4, ease: 'power3.out' });
      const yTo = gsap.quickTo(c, 'y', { duration: .4, ease: 'power3.out' });
      let shown = false;
      window.addEventListener('pointermove', (e) => {
        if (!shown) { shown = true; gsap.set(c, { x: e.clientX, y: e.clientY }); gsap.to(c, { opacity: 1, duration: .5 }); }
        xTo(e.clientX); yTo(e.clientY);
      }, { passive: true });
      document.addEventListener('pointerover', (e) => {
        const lab = e.target.closest('[data-cursor]');
        const link = e.target.closest('a, button, [role="tab"], input, summary');
        c.classList.toggle('is-label', !!lab);
        c.classList.toggle('is-link', !!link && !lab);
        label.textContent = lab ? lab.dataset.cursor : '';
      });
      document.addEventListener('pointerleave', () => gsap.to(c, { opacity: 0, duration: .3 }));
    });

    safe('magnetic', () => {
      if (!fine || reduce) return;
      $$('.magnetic').forEach((el) => {
        const inner = $('.btn__t', el);
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          gsap.to(el, { x: dx * .28, y: dy * .4, duration: .5, ease: 'power3.out' });
          if (inner) gsap.to(inner, { x: dx * .12, y: dy * .16, duration: .5, ease: 'power3.out' });
        });
        el.addEventListener('pointerleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.45)' });
          if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.45)' });
        });
      });
    });

    const addTilt = (el, max) => {
      if (!fine || reduce) return;
      if (!$('.glare', el)) { const g = document.createElement('span'); g.className = 'glare'; g.setAttribute('aria-hidden', 'true'); el.appendChild(g); }
      el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        gsap.to(el, { rotationY: (px - .5) * max * 2, rotationX: -(py - .5) * max * 2, transformPerspective: 900, duration: .55, ease: 'power3.out' });
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        gsap.to(el, { rotationX: 0, rotationY: 0, duration: 1, ease: 'elastic.out(1,.6)' });
      });
    };
    safe('tilt', () => {
      $$('.ucard').forEach((el) => addTilt(el, 9));
      $$('.tcard').forEach((el) => addTilt(el, 7));
      $$('.gal__i').forEach((el) => addTilt(el, 5));
    });

    safe('spot', () => {
      if (!fine || reduce) return;
      $$('[data-spot]').forEach((cell) => {
        const spot = $('.tcell__spot', cell);
        const xTo = gsap.quickTo(spot, 'x', { duration: .45, ease: 'power3.out' });
        const yTo = gsap.quickTo(spot, 'y', { duration: .45, ease: 'power3.out' });
        cell.addEventListener('pointermove', (e) => { const r = cell.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); });
      });
    });

    /* FAQ : accordéon animé */
    safe('faq', () => {
      $$('.fitem__q').forEach((btn) => {
        const panelEl = document.getElementById(btn.getAttribute('aria-controls'));
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') === 'true';
          // referme les autres
          $$('.fitem__q[aria-expanded="true"]').forEach((o) => {
            if (o === btn) return;
            o.setAttribute('aria-expanded', 'false');
            const p = document.getElementById(o.getAttribute('aria-controls'));
            gsap.to(p, { height: 0, duration: .5, ease: 'power3.inOut', onComplete: () => { p.hidden = true; } });
          });
          btn.setAttribute('aria-expanded', String(!open));
          if (!open) {
            panelEl.hidden = false;
            gsap.fromTo(panelEl, { height: 0 }, { height: 'auto', duration: reduce ? 0 : .7, ease: 'expo.out', onComplete: refreshLater });
          } else {
            gsap.to(panelEl, { height: 0, duration: reduce ? 0 : .5, ease: 'power3.inOut', onComplete: () => { panelEl.hidden = true; refreshLater(); } });
          }
        });
      });
    });

    /* Lightbox galerie */
    safe('lightbox', () => {
      const lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap');
      const items = $$('.gal__b');
      let idx = 0, opener = null;
      const show = (i) => {
        idx = (i + items.length) % items.length;
        const it = items[idx], im = $('img', it);
        img.src = im.currentSrc || im.src; img.alt = im.alt;
        cap.textContent = $('figcaption', it.parentElement).textContent;
      };
      const open = (i, from) => { opener = from; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lockScroll(true); $('#lbClose').focus(); };
      const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lockScroll(false); opener && opener.focus(); };
      items.forEach((b, i) => b.addEventListener('click', () => open(i, b)));
      $('#lbClose').addEventListener('click', close);
      $('#lbPrev').addEventListener('click', () => show(idx - 1));
      $('#lbNext').addEventListener('click', () => show(idx + 1));
      lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
      document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'ArrowRight') show(idx + 1);
        else if (e.key === 'Tab') {
          const f = $$('button', lb), first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
          else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      });
    });

    /* Carrousel d'avis : glisser, boutons, lecture auto */
    safe('reviews', () => {
      const track = $('#rvTrack'), bar = $('.rv__bar i');
      if (!track) return;
      const step = () => { const c = $('.rcard', track); return c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 20); };
      const next = (dir) => {
        const max = track.scrollWidth - track.clientWidth;
        if (dir > 0 && track.scrollLeft >= max - 8) track.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
        else if (dir < 0 && track.scrollLeft <= 8) track.scrollTo({ left: max, behavior: reduce ? 'auto' : 'smooth' });
        else track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
      };
      $('#rvNext').addEventListener('click', () => next(1));
      $('#rvPrev').addEventListener('click', () => next(-1));
      const paintBar = () => {
        const max = track.scrollWidth - track.clientWidth;
        const p = max > 0 ? track.scrollLeft / max : 1;
        bar.style.transform = 'scaleX(' + (0.08 + 0.92 * p).toFixed(3) + ')';
      };
      track.addEventListener('scroll', paintBar, { passive: true });
      paintBar();
      // glisser à la souris
      let down = false, sx = 0, sl = 0, moved = 0;
      track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft; });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
        if (moved > 4) track.classList.add('is-drag');
        track.scrollLeft = sl - dx;
      });
      window.addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('is-drag'); });
      // lecture automatique (désactivée si mouvement réduit)
      if (!reduce) {
        let hover = false, visible = false;
        track.addEventListener('pointerenter', () => { hover = true; });
        track.addEventListener('pointerleave', () => { hover = false; });
        track.addEventListener('focusin', () => { hover = true; });
        track.addEventListener('focusout', () => { hover = false; });
        new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: .35 }).observe(track);
        setInterval(() => { if (visible && !hover && !down && !document.hidden) next(1); }, 6500);
      }
    });

    /* ───────────── Animations pilotées par le scroll ───────────── */
    const mm = gsap.matchMedia();

    const scrollAnims = (wide) => {

      /* Titres : apparition mot par mot (masque qui monte) */
      wordGroups.forEach(({ el, words, inStory }) => {
        if (inStory && wide) return; // piloté par la section pinnée
        gsap.from(words, { yPercent: 118, duration: 1.2, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: el, start: 'top 87%', once: true } });
      });

      /* Hero : parallaxe multicouche */
      safe('hero-parallax', () => {
        const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-media]', { yPercent: 14, scale: 1.12, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-arch]', { y: -120, ease: 'none', scrollTrigger: st });
        gsap.to('[data-dust]', { y: -220, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-inner]', { y: -70, opacity: .0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '25% top', end: '85% top', scrub: true } });
      });

      /* Marquee : vitesse et sens réagissent au scroll */
      safe('marquee-anim', () => {
        const rows = $$('.marq__track');
        if (!rows.length) return;
        const tws = rows.map((t, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const tw = i % 2 === 0
            ? gsap.to(t, { xPercent: -50, duration: 46, ease: 'none', repeat: -1 })
            : gsap.fromTo(t, { xPercent: -50 }, { xPercent: 0, duration: 54, ease: 'none', repeat: -1 });
          return { tw, dir };
        });
        const state = { boost: 0, dir: 1 };
        ScrollTrigger.create({
          start: 0, end: 'max',
          onUpdate: (self) => { state.boost = Math.min(6, Math.abs(self.getVelocity()) / 350); state.dir = self.direction || 1; }
        });
        gsap.ticker.add(() => {
          state.boost *= .94;
          tws.forEach((o) => o.tw.timeScale(state.dir * (1 + state.boost)));
        });
        gsap.from('.marq', { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.marq', start: 'top 95%', once: true } });
      });

      /* Histoire : storytelling pinné (desktop) / empilé (mobile) */
      safe('story', () => {
        const steps = $$('.story__step'), imgs = $$('.story__img'), dots = $$('.story__dots i');
        const n = steps.length;
        if (wide) {
          const words = steps.map((s) => $$('.wi', s));
          const bodies = steps.map((s) => $$('.story__kicker, p:not(.story__kicker)', s));
          const num = $('[data-story-num]');
          gsap.set(steps, { autoAlpha: 0 });
          gsap.set(steps[0], { autoAlpha: 1 });
          gsap.set(imgs, { clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set(imgs[0], { clipPath: 'inset(0% 0% 0% 0%)' });
          words.forEach((w, i) => { if (i > 0) gsap.set(w, { yPercent: 118 }); });
          gsap.from(words[0], { yPercent: 118, duration: 1.3, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: '.story', start: 'top 70%', once: true } });
          gsap.from(bodies[0], { y: 26, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.story', start: 'top 65%', once: true } });
          gsap.from('.story__arch', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 70%', once: true } });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.story__pin', start: 'top top', end: () => '+=' + Math.round(window.innerHeight * (n - 1) * 1.05),
              pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
              snap: { snapTo: 'labels', duration: { min: .25, max: .8 }, delay: .06, ease: 'power2.inOut' },
              onUpdate: (self) => {
                const t = self.progress * (n - 1 + .4);
                const idx = Math.min(n - 1, Math.max(0, Math.floor(t + .5)));
                dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));
                if (num) num.textContent = String(idx + 1).padStart(2, '0');
              }
            }
          });
          tl.addLabel('s0', 0);
          for (let i = 1; i < n; i++) {
            tl.addLabel('s' + i, i)
              .to(steps[i - 1], { autoAlpha: 0, y: -34, duration: .3, ease: 'power2.in' }, i - .46)
              .to(imgs[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: .5, ease: 'power3.inOut' }, i - .5)
              .fromTo($('img', imgs[i]), { scale: 1.28 }, { scale: 1, duration: .75, ease: 'power2.out' }, i - .5)
              .set(steps[i], { autoAlpha: 1, y: 0 }, i - .2)
              .fromTo(words[i], { yPercent: 118 }, { yPercent: 0, duration: .5, stagger: .035, ease: 'power3.out' }, i - .2)
              .fromTo(bodies[i], { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .07, ease: 'power2.out' }, i - .08);
          }
          tl.to({}, { duration: .4 }, n - 1);
        } else {
          steps.forEach((s) => {
            gsap.from($$('.story__kicker, p:not(.story__kicker)', s), { y: 28, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: s, start: 'top 82%', once: true } });
            const fig = $('.story__mobile', s);
            gsap.from(fig, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
          });
        }
      });

      /* Technologies : cellules qui montent */
      safe('tech', () => {
        gsap.from('.tcell', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: { each: .07, grid: [2, 4], from: 'start' }, scrollTrigger: { trigger: '.tech__grid', start: 'top 85%', once: true } });
      });

      /* Univers : défilement horizontal piloté par le scroll vertical */
      safe('univ', () => {
        gsap.from('.univ__head', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.univ', start: 'top 80%', once: true } });
        if (!wide) return;
        const track = $('[data-univ-track]'), pin = $('.univ__pin'), bar = $('.univ__bar i');
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (self) => { bar.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')'; }
          }
        });
        gsap.from('.ucard', { y: 90, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: '.univ', start: 'top 60%', once: true } });
      });

      /* Chiffres clés : compteurs */
      safe('stats', () => {
        $$('[data-count]').forEach((el) => {
          const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
          const o = { v: 0 };
          el.textContent = (0).toFixed(dec).replace('.', ',');
          gsap.to(o, {
            v: target, duration: 2.4, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate: () => { el.textContent = o.v.toFixed(dec).replace('.', ','); }
          });
        });
        gsap.from('.stats__grid li', { y: 70, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.stats__grid', start: 'top 85%', once: true } });
        gsap.fromTo('.stats__brush', { x: -120 }, { x: 120, ease: 'none', scrollTrigger: { trigger: '.stats', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from('.stats__note', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.stats__note', start: 'top 92%', once: true } });
      });

      /* Citation vidéo : les mots s'allument pendant le scroll */
      safe('quote', () => {
        const txt = $('[data-scrub-words]');
        if (!txt.hasAttribute('aria-label')) txt.setAttribute('aria-label', txt.textContent.trim());
        const words = splitText(txt, 'words');
        words.forEach((w) => { w.parentElement.style.overflow = 'visible'; w.parentElement.style.padding = '0'; w.parentElement.style.margin = '0'; });
        gsap.set(words, { opacity: .14 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.vq', start: 'top top', end: '+=140%', pin: true, scrub: .6 } });
        tl.to(words, { opacity: 1, ease: 'none', stagger: { each: .12 }, duration: .3 })
          .to('.vq__arch path', { strokeDashoffset: 0, ease: 'none', duration: 1.2 }, 0)
          .to({}, { duration: .5 });
        gsap.fromTo('.vq__video', { scale: 1.22 }, { scale: 1.02, ease: 'none', scrollTrigger: { trigger: '.vq', start: 'top bottom', end: '+=240%', scrub: true } });
      });

      /* Tarifs */
      safe('tarifs-anim', () => {
        gsap.from('.tarifs__bar', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.tarifs__bar', start: 'top 92%', once: true } });
        gsap.from('.tarifs__foot', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.tarifs__foot', start: 'top 95%', once: true } });
        gsap.from('.tarifs .sec-head__p', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.tarifs .sec-head__p', start: 'top 92%', once: true } });
      });

      /* Galerie : révélation par masque + parallaxe interne + zoom */
      safe('gallery', () => {
        $$('.gal__i').forEach((fig, i) => {
          const im = $('img', fig);
          gsap.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', delay: (i % 3) * .08,
            scrollTrigger: { trigger: fig, start: 'top 90%', once: true }, clearProps: 'clipPath'
          });
          gsap.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 90%', once: true } });
          gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });

      /* Équipe */
      safe('team', () => {
        gsap.from('.tcard', { y: 120, opacity: 0, rotate: (i) => [-3, 0, 3][i] || 0, duration: 1.5, ease: 'expo.out', stagger: .15, scrollTrigger: { trigger: '.team__grid', start: 'top 82%', once: true } });
        gsap.from('.team .sec-head__p', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.team .sec-head__p', start: 'top 92%', once: true } });
      });

      /* Parcours : la ligne dorée se dessine */
      safe('path', () => {
        const list = $('.path__list');
        gsap.fromTo(list, { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 60%', scrub: .5 } });
        $$('.pstep').forEach((s, i) => {
          const st = { trigger: s, start: 'top 82%', once: true };
          gsap.from($('.pstep__n', s), { scale: .4, opacity: 0, duration: 1, ease: 'back.out(1.8)', scrollTrigger: st });
          gsap.from($('div', s), { x: wide ? (i % 2 === 0 ? -90 : 90) : 50, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: st });
        });
      });

      /* Avis */
      safe('rv-anim', () => {
        gsap.from('.rcard', { x: 120, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .09, scrollTrigger: { trigger: '#rvTrack', start: 'top 85%', once: true } });
        gsap.from('.rv__head .sec-head__p, .rv__nav', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.rv__head', start: 'top 85%', once: true } });
      });

      /* Appel à l'action */
      safe('cta', () => {
        gsap.from('.ccard', { y: 70, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.cta__cards', start: 'top 88%', once: true } });
        gsap.fromTo('.cta__brush--a', { x: -140 }, { x: 140, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.fromTo('.cta__brush--b', { x: 140 }, { x: -140, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from('.cta__gift', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.cta__gift', start: 'top 95%', once: true } });
      });

      /* Contact, FAQ, footer */
      safe('loc', () => {
        gsap.from('.loc__addr, .loc__links, .hours, .loc__info > .btn', { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.loc__info', start: 'top 75%', once: true } });
        gsap.from('.map', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.map', start: 'top 85%', once: true }, clearProps: 'clipPath' });
        gsap.from('.move', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.move', start: 'top 92%', once: true } });
        ScrollTrigger.batch('.fitem', { start: 'top 92%', once: true, onEnter: (b) => gsap.from(b, { y: 34, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }) });
      });
      safe('footer', () => {
        if (megaChars.length) gsap.from(megaChars, { yPercent: 105, duration: 1.5, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: '[data-mega]', start: 'top 98%', once: true } });
        gsap.from('.foot__grid > *', { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.foot__grid', start: 'top 92%', once: true } });
      });
    };
    // Recalculé automatiquement quand la fenêtre passe sous / au-dessus de 900 px
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', () => scrollAnims(true));
    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 899px)', () => scrollAnims(false));

    /* Mouvement réduit : tout est visible tout de suite, compteurs à leur valeur finale */
    mm.add('(prefers-reduced-motion: reduce)', () => {
      $$('[data-count]').forEach((el) => { const dec = parseInt(el.dataset.dec || '0', 10); el.textContent = parseFloat(el.dataset.count).toFixed(dec).replace('.', ','); });
      const w = $('[data-scrub-words]'); if (w) w.style.opacity = 1;
    });

    /* ───────────── Préchargeur → entrée du hero ───────────── */
    // La timeline du hero est construite tout de suite (états de départ masqués),
    // puis jouée quand le préchargeur s'ouvre : aucun flash de contenu.
    let heroTl = null;
    if (!reduce) {
      const tl = heroTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.from('.hero__video', { scale: 1.3, duration: 2.8, ease: 'power3.out' }, 0)
        .from('.hero__eyebrow', { y: 24, opacity: 0, duration: 1.1 }, .25)
        .from(heroChars, { yPercent: 120, duration: 1.4, stagger: { each: .03 } }, .3)
        .fromTo('.hero__title em', { '--b': 0 }, { '--b': 1, duration: 1.4, ease: 'power3.inOut' }, 1.05)
        .from('.hero__lead', { y: 32, opacity: 0, duration: 1.2 }, .95)
        .from('.hero__cta .btn', { y: 34, opacity: 0, duration: 1.1, stagger: .1 }, 1.1)
        .from('.hero__chips li', { y: 18, opacity: 0, duration: 1, stagger: .08 }, 1.25)
        .to('.hero__arch path', { strokeDashoffset: 0, duration: 2.6, stagger: .25, ease: 'power2.inOut' }, .5)
        .from('.dust', { opacity: 0, duration: 2, stagger: .04 }, .8)
        .from('.hero__scroll', { opacity: 0, duration: 1 }, 1.6)
        .from('#hdr', { y: -30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 1.0);
    }
    const heroIntro = () => { if (heroTl) heroTl.play(); };

    const runLoader = async () => {
      const L = $('#loader');
      if (!L) { heroIntro(); return; }
      if (reduce) { L.remove(); return; }
      lockScroll(true);
      window.scrollTo(0, 0);
      const arch = $('.loader__arch'), frame = $('.loader__frame'), mark = $('.loader__mark');
      const num = $('#loaderNum'), img = $('img', arch);
      gsap.set([arch, frame, mark], { xPercent: -50, yPercent: -50 });
      gsap.set(frame, { scale: 1.1 });
      gsap.set('.loader__script', { opacity: 0, y: 26 });
      gsap.set('.loader__word', { opacity: 0, y: 14 });
      gsap.set('.loader__stroke', { scaleX: 0 });
      gsap.set(arch, { clipPath: 'inset(100% 0% 0% 0%)' });

      // chargement réel : polices + image du loader + premières images de la vidéo (max 3,5 s)
      const hv = $('.hero__video');
      const waits = [
        document.fonts && document.fonts.ready,
        new Promise((res) => { if (img.complete) res(); else { img.addEventListener('load', res); img.addEventListener('error', res); } }),
        new Promise((res) => { if (!hv || hv.readyState >= 3) res(); else { hv.addEventListener('canplay', res, { once: true }); hv.addEventListener('error', res, { once: true }); } })
      ];
      const ready = Promise.race([Promise.all(waits), sleep(2200)]);

      const prog = { p: 0 };
      const paint = () => { num.textContent = String(Math.round(prog.p)).padStart(2, '0'); };
      const intro = gsap.timeline();
      intro.to(frame.querySelector('path'), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0)
        .to(arch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out' }, .35)
        .fromTo(img, { scale: 1.4 }, { scale: 1, duration: 2.4, ease: 'power3.out' }, .35)
        .to('.loader__script', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, .85)
        .to('.loader__stroke', { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 1.15)
        .to('.loader__word', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 1.3)
        .to(prog, { p: 88, duration: 1.9, ease: 'power2.out', onUpdate: paint }, 0);
      intro.timeScale(1.45);
      // (on évite d'« await » directement une tween GSAP : elles sont « thenable »)
      await new Promise((res) => intro.eventCallback('onComplete', res));
      await ready;
      await new Promise((res) => gsap.to(prog, { p: 100, duration: .45, ease: 'power1.out', onUpdate: paint, onComplete: res }));
      await sleep(120);

      // sortie spectaculaire : l'arche s'agrandit jusqu'à remplir l'écran, puis se fond dans la vidéo
      const r = arch.getBoundingClientRect();
      const s = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.2;
      const out = gsap.timeline({ onComplete: () => { L.remove(); lockScroll(false); ScrollTrigger.refresh(); } });
      out.to(['.loader__mark', '.loader__meta', '.loader__count'], { opacity: 0, y: -24, duration: .55, ease: 'power2.in' }, 0)
        .to(frame, { opacity: 0, scale: 1.4, duration: .9, ease: 'power2.in' }, 0)
        .to(arch, { scale: s, duration: 1.6, ease: 'expo.inOut' }, .15)
        .to('.loader__bg', { opacity: 0, duration: .7, ease: 'power1.inOut' }, .75)
        .to('.loader__veil', { opacity: 0, duration: .8 }, .8)
        .add(heroIntro, 1.0)
        .to(arch, { opacity: 0, duration: .8, ease: 'power1.inOut' }, 1.15);
    };

    runLoader();

    // Garde-fous : recalcul des positions une fois tout chargé
    window.addEventListener('load', () => { setTimeout(() => ScrollTrigger.refresh(), 300); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('pageshow', (e) => { if (e.persisted) ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();