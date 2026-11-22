/* =====================================================================
   Lógica del portafolio
   El contenido se edita en js/config.js (o con el formulario crear/index.html).
   ===================================================================== */
(() => {
  'use strict';

  if (!window.PORTAFOLIO) return;

  function loadConfig() {
    let cfg = window.PORTAFOLIO || {};
    try {
      const params = new URLSearchParams(location.search);
      if (params.get('vista') === 'borrador') {
        const raw = localStorage.getItem('portafolio-borrador');
        if (raw) {
          cfg = JSON.parse(raw);
          cfg.__borrador = true;
        }
      }
    } catch (_) { /* si el borrador está roto, se usa el archivo */ }
    return cfg;
  }

  const CFG = loadConfig();
  const PERFIL = CFG.perfil || {};
  const TEXTOS = CFG.textos || {};
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cssUrl = (s) => `url("${String(s).replace(/["\\\n]/g, encodeURIComponent)}")`;
  const fmtDur = (t) => (isFinite(t) && t > 0 ? `${Math.floor(t / 60)}:${pad(Math.round(t % 60))}` : '');
  const frase = (key, fallback) => {
    const value = CFG.frases && CFG.frases[key];
    return value == null || value === '' ? fallback : String(value);
  };

  function safeUrl(url) {
    const u = String(url || '').trim();
    if (!u) return '#';
    if (/^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '#';
    return u;
  }

  const nombre = PERFIL.nombre || 'Desmos';
  const NAME_MARK = '\u0001';

  function rich(s) {
    const src = String(s ?? '').replace(/\bNOMBRE\b/g, NAME_MARK);
    const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\n]+)\*|\{([^{}\n]+)\}/g;
    let out = '';
    let last = 0;
    let match;
    const put = (text) => esc(text).replaceAll(NAME_MARK, esc(nombre));
    while ((match = re.exec(src))) {
      out += put(src.slice(last, match.index));
      if (match[1] != null) {
        const url = safeUrl(match[2]);
        const external = /^https?:/i.test(url);
        out += `<a href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ''}>${put(match[1])}</a>`;
      } else if (match[3] != null) {
        out += `<strong>${put(match[3])}</strong>`;
      } else {
        out += `<span class="text-grad">${put(match[4])}</span>`;
      }
      last = match.index + match[0].length;
    }
    out += put(src.slice(last));
    return out;
  }

  const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5L7 4.5Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    mail: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.4l-4.5 1.1Z"/><path d="M9.2 8.3c-.4 2.9 3.1 6.6 6.4 6.6l.9-1.5-1.9-1-1 .8c-.9-.4-2-1.5-2.4-2.4l.8-1-1-1.9-1.8.4Z" fill="currentColor" stroke="none"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor"/></svg>`,
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .9.1V9.4a5.9 5.9 0 1 0 5 5.8V9.1a7.6 7.6 0 0 0 4.3 1.3V7.3A4.4 4.4 0 0 1 16.6 3Z"/></svg>',
    youtube: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor"/></svg>`,
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z"/></svg>',
    pin: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/></svg>`,
    flagCU: '<svg viewBox="0 0 30 15" aria-hidden="true"><rect width="30" height="15" fill="#fff"/><path d="M0 0h30v3H0zM0 6h30v3H0zM0 12h30v3H0z" fill="#002a8f"/><path d="M0 0l13 7.5L0 15Z" fill="#cf142b"/><path d="M4.33 4.9l.59 1.79h1.88l-1.52 1.12.58 1.79-1.53-1.1-1.53 1.1.58-1.79-1.52-1.12h1.88Z" fill="#fff"/></svg>',
    external: `<svg viewBox="0 0 24 24" ${S} aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>`,
  };
  const SERVICE_ICON = {
    reels: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 9.5v5l4-2.5-4-2.5Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10.5 9.5v5l4-2.5-4-2.5Z"/></svg>',
    sonido: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l6 4V6L7 10H4Z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    color: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 3a9 9 0 0 1 0 18"/></svg>',
    texto: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M6 15h5M13 15h5M6 11.5h3M11 11.5h7"/></svg>',
    estrella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.4 5.1 5.6.7-4.1 3.8 1.1 5.5L12 16l-5 2.6 1.1-5.5L4 9.3l5.6-.7L12 3.5Z"/></svg>',
    rayo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
    corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9Z"/></svg>',
    camara: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-2h6l2 2h3v11H4V8Z"/><circle cx="12" cy="13" r="3.2"/></svg>',
    megafono: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4l12 4V6L4 10Z"/><path d="M8 14.5V19h2M16 9.5a4 4 0 0 1 0 5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5"/></svg>',
  };
  const TIMELINE = `
    <div class="timeline" aria-hidden="true">
      <div class="timeline__ruler"></div>
      <div class="timeline__track"><b>V1</b><span style="--w:22%"></span><span style="--w:14%"></span><span style="--w:30%"></span><span style="--w:18%"></span></div>
      <div class="timeline__track timeline__track--txt"><b>T1</b><span style="--w:12%;--m:6%"></span><span style="--w:16%"></span><span style="--w:10%;--m:8%"></span><span style="--w:20%"></span></div>
      <div class="timeline__track timeline__track--audio"><b>A1</b><span class="wave"></span></div>
      <i class="timeline__head"></i>
    </div>`;
  const PLAY_BTN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor"/></svg>';
  const NET_LABEL = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', facebook: 'Facebook' };

  function serviceIcon(name) {
    return SERVICE_ICON[String(name || '').toLowerCase()] || SERVICE_ICON.estrella;
  }

  function normalFormato(raw, media) {
    const key = String(raw || '').trim().toLowerCase();
    const map = {
      vertical: '9:16', '9:16': '9:16', '9/16': '9:16', story: '9:16', reel: '9:16', stories: '9:16',
      horizontal: '16:9', '16:9': '16:9', '16/9': '16:9', youtube: '16:9', ancho: '16:9',
      cuadrado: '1:1', '1:1': '1:1', square: '1:1',
      '4:5': '4:5', '4/5': '4:5',
    };
    if (map[key]) return map[key];
    if (/^\d+(?:\.\d+)?\s*[:/]\s*\d+(?:\.\d+)?$/.test(key)) return key.replace('/', ':').replace(/\s/g, '');
    if (media && media.type === 'youtube' && !media.shorts) return '16:9';
    return '9:16';
  }

  function ratioOf(fmt) {
    const m = String(fmt || '9:16').match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
    if (!m) return 9 / 16;
    return Number(m[1]) / Number(m[2]);
  }

  function colsAttr(value) {
    const n = String(value ?? 'auto').trim();
    return n === '2' || n === '3' || n === '4' ? n : 'auto';
  }

  function parseVideo(url) {
    const u = String(url || '').trim();
    if (!u) return null;
    let m;
    if (/drive\.google\.com|docs\.google\.com/i.test(u)) {
      m = u.match(/\/d\/([\w-]{10,})/) || u.match(/[?&]id=([\w-]{10,})/);
      if (!m) return null;
      return {
        type: 'drive',
        embed: `https://drive.google.com/file/d/${m[1]}/preview`,
        thumb: `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`,
      };
    }
    if (/youtube\.com|youtu\.be/i.test(u)) {
      m = u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
      if (!m) return null;
      return {
        type: 'youtube',
        shorts: /\/shorts\//i.test(u),
        embed: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0&playsinline=1`,
        thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`,
      };
    }
    return { type: 'local', src: u };
  }

  const waDisplay = String(PERFIL.whatsapp || '').trim();
  const waNumber = waDisplay.replace(/\D/g, '');
  const waPending = /x/i.test(waDisplay) || (waDisplay && waNumber.length < 8);
  const waReady = !!waNumber && !waPending;
  const email = String(PERFIL.email || '').trim();
  const PROT = Object.assign({ bloquearDescarga: true, marcaDeAgua: nombre.toUpperCase(), marcaCentral: true }, CFG.proteccion || {});

  function protectVideo(v) {
    if (!PROT.bloquearDescarga) return v;
    v.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    v.setAttribute('disablePictureInPicture', '');
    v.setAttribute('disableRemotePlayback', '');
    v.setAttribute('draggable', 'false');
    v.disablePictureInPicture = true;
    return v;
  }

  function watermarkHTML() {
    if (!PROT.marcaDeAgua) return '';
    const mark = esc(PROT.marcaDeAgua);
    return `<span class="wm" aria-hidden="true"><img src="${esc(PERFIL.favicon || 'assets/img/favicon.png')}" alt="">${mark}</span>` +
      (PROT.marcaCentral ? `<span class="wm-center" aria-hidden="true">${mark}</span>` : '');
  }

  const waLink = (msg) => `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  function contactHref(msg) {
    const asunto = (CFG.contacto && CFG.contacto.asuntoEmail) || 'Cotización de video';
    if (waReady) return { href: waLink(msg), external: true };
    if (email) return { href: `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(msg)}`, external: false };
    return { href: '#contacto', external: false };
  }
  const linkAttrs = (c) => `href="${esc(c.href)}"${c.external ? ' target="_blank" rel="noopener"' : ''}`;

  function makeItem(v, project, pi) {
    const media = parseVideo(v && v.video);
    if (!media) return null;
    const formato = normalFormato(v.formato, media);
    return {
      titulo: v.titulo || (project && project.titulo) || 'Video',
      cliente: v.cliente || (project && project.cliente) || '',
      categoria: v.categoria || (project && project.categoria) || 'Video',
      formato,
      ratio: ratioOf(formato),
      duracion: v.duracion || '',
      encuadre: String(v.encuadre || '').replace(/[;{}]/g, ''),
      ajuste: v.ajuste === 'completo' ? 'contain' : 'cover',
      poster: v.poster || media.thumb || '',
      media,
      proyecto: pi,
      destacado: v.destacado != null ? !!v.destacado : !!(project && project.destacado),
    };
  }

  const proyectos = (Array.isArray(CFG.proyectos) ? CFG.proyectos : []).filter((p) => p && p.mostrar !== false);
  const projectItems = [];
  proyectos.forEach((p, pi) => {
    (p.videos || []).forEach((v) => {
      const item = makeItem(v, p, pi);
      if (item) projectItems.push(item);
    });
  });

  function itemsFromRaw(list, block) {
    return (list || []).map((v) => makeItem({
      categoria: (block && block.categoria) || 'Video',
      ...v,
    }, null, -1)).filter(Boolean);
  }

  /* Galerías independientes de "proyectos": si block.videos existe (aunque esté vacío),
     usa exactamente esa lista en el orden definido en config.js. */
  function itemsForGallery(block) {
    if (!block) return [];
    if (Array.isArray(block.videos)) {
      return itemsFromRaw(block.videos, block);
    }
    const mode = String(block.cuales || 'todos').toLowerCase();
    if (mode === 'destacados') {
      const featured = projectItems.filter((it) => it.destacado);
      if (featured.length) return featured;
      const n = Number(block.siNoHayDestacados || 4);
      return projectItems.slice(0, n > 0 ? n : 4);
    }
    if (mode === 'sin-destacar' || mode === 'sin destacar') return projectItems.filter((it) => !it.destacado);
    return projectItems.slice();
  }

  function findBlock(id) {
    const gallery = (CFG.galerias || []).find((x) => x && x.id === id);
    if (gallery) return Object.assign({ tipo: 'galeria' }, gallery);
    const extra = (CFG.seccionesExtra || []).find((x) => x && x.id === id);
    if (extra) return extra;
    const map = {
      casos: CFG.casos,
      servicios: CFG.servicios,
      proceso: CFG.proceso,
      precios: CFG.precios,
      'sobre-mi': CFG.sobreMi,
      contacto: CFG.contacto,
    };
    return map[id] || null;
  }

  function sectionSequence() {
    const fallback = ['proyectos', 'trabajos', 'casos', 'servicios', 'proceso', 'precios', 'sobre-mi', 'contacto'];
    const orden = Array.isArray(CFG.orden) && CFG.orden.length ? CFG.orden : fallback;
    const seen = new Set();
    const list = [];
    orden.forEach((id) => {
      const block = findBlock(id);
      if (!block || block.mostrar === false || seen.has(block.id || id)) return;
      list.push(block);
      seen.add(block.id || id);
    });
    (CFG.seccionesExtra || []).forEach((block) => {
      if (!block || block.mostrar === false || !block.id || seen.has(block.id)) return;
      list.push(block);
      seen.add(block.id);
    });
    return list;
  }

  function isAlt(block, index) {
    if (block.fondo === 'suave') return true;
    if (block.fondo === 'normal') return false;
    return index % 2 === 1;
  }

  function sectionOpen(block, index, extra) {
    const alt = isAlt(block, index) ? ' section--alt' : '';
    const left = block.alineacion === 'izquierda' ? ' section--left' : '';
    const contact = (block.id === 'contacto' || block.tipo === 'contacto') ? ' contact' : '';
    const nav = block.resaltar ? ` data-nav="${esc(block.resaltar)}"` : '';
    return `<section class="section${alt}${contact}${left}${extra || ''}" id="${esc(block.id)}"${nav}>`;
  }

  function headHTML(block, extraClass) {
    return `
      <header class="section__head${extraClass || ''} reveal">
        <p class="label"><span>00</span>${esc(block.etiqueta || '')}</p>
        ${block.titulo ? `<h2 class="section__title">${rich(block.titulo)}</h2>` : ''}
        ${block.texto ? `<p class="section__lead">${rich(block.texto)}</p>` : ''}
      </header>`;
  }

  /* ---------- Chrome: marca, textos, menú ---------- */
  function applyMeta() {
    if (TEXTOS.tituloPestana) document.title = TEXTOS.tituloPestana;
    const set = (sel, attr, value) => {
      const el = document.head.querySelector(sel);
      if (el && value) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', 'content', TEXTOS.descripcion);
    set('meta[property="og:title"]', 'content', TEXTOS.tituloCompartir);
    set('meta[property="og:description"]', 'content', TEXTOS.descripcionCompartir);
    set('meta[property="og:url"]', 'content', TEXTOS.url);
    set('meta[property="og:image"]', 'content', TEXTOS.imagenCompartir);
    if (PERFIL.favicon) {
      const fav = document.querySelector('link[rel="icon"]');
      if (fav) fav.href = PERFIL.favicon;
    }
    if (PERFIL.icono) {
      const apple = document.querySelector('link[rel="apple-touch-icon"]');
      if (apple) apple.href = PERFIL.icono;
    }
    const skip = $('#skip-link');
    if (skip) skip.textContent = frase('saltarAlContenido', 'Saltar al contenido');
  }

  function applyChrome() {
    const brand = (PERFIL.nombreLogo || nombre).toUpperCase();
    const icon = PERFIL.icono || 'assets/img/apple-touch-icon.png';
    $$('.brand__name').forEach((el) => { el.textContent = brand; });
    $$('.brand__mark').forEach((img) => { img.src = icon; });
    $$('.brand').forEach((a) => a.setAttribute('aria-label', `${nombre}, ir al inicio`));
    const year = String(new Date().getFullYear());
    const copy = $('#footer-copy');
    if (copy) copy.textContent = `© ${year} ${nombre}${TEXTOS.pie ? ' · ' + TEXTOS.pie : ''}`;
    const top = $('#footer-top');
    if (top) top.textContent = TEXTOS.volverArriba || 'Volver arriba ↑';
    const closeBtn = $('.lightbox__close');
    const prev = $('.lightbox__nav--prev');
    const next = $('.lightbox__nav--next');
    if (closeBtn) closeBtn.setAttribute('aria-label', frase('cerrarVideo', 'Cerrar video'));
    if (prev) prev.setAttribute('aria-label', frase('videoAnterior', 'Video anterior'));
    if (next) next.setAttribute('aria-label', frase('videoSiguiente', 'Video siguiente'));
    if (CFG.__borrador) {
      const banner = $('#draft-banner');
      if (banner) banner.hidden = false;
    }
  }

  function renderNav() {
    const links = sectionSequence().filter((b) => String(b.menu || '').trim());
    const ctaHref = safeUrl(TEXTOS.enlaceBoton || '#contacto');
    const shortLabel = TEXTOS.botonMenu || 'Cotizar';
    const longLabel = TEXTOS.botonMenuLargo || shortLabel;
    const ul = $('#nav-links');
    if (ul) {
      ul.innerHTML = links.map((b) => `<li><a href="#${esc(b.id)}">${esc(b.menu)}</a></li>`).join('')
        + `<li class="nav__links-cta"><a class="btn btn--primary" href="${esc(ctaHref)}">${esc(longLabel)}</a></li>`;
    }
    const cta = $('#nav-cta');
    if (cta) {
      cta.textContent = shortLabel;
      cta.href = ctaHref;
    }
  }

  function setupIntro() {
    const intro = $('#intro');
    const cfg = CFG.intro || {};
    if (!intro) return;
    if (cfg.mostrar === false) { intro.remove(); return; }
    const video = $('video', intro);
    if (video && cfg.video && video.getAttribute('src') !== cfg.video) video.src = cfg.video;
    const nameEl = $('.intro__name', intro);
    if (nameEl) nameEl.textContent = String(cfg.nombre || nombre).toUpperCase();
    const roleEl = $('.intro__role', intro);
    if (roleEl) roleEl.textContent = cfg.rol || PERFIL.rol || '';
    const skip = $('.intro__skip', intro);
    if (skip) skip.textContent = cfg.botonSaltar || frase('saltarIntro', 'Saltar intro');
  }

  /* ---------- Portada y cinta ---------- */
  function firstAnchor() {
    const custom = CFG.portada && CFG.portada.enlaceFlecha;
    if (custom) return safeUrl(custom);
    const first = sectionSequence()[0];
    return first ? `#${first.id}` : '#contacto';
  }

  function renderHero() {
    const p = CFG.portada || {};
    if (p.mostrar === false) return '';
    const facts = (p.datos || []).filter((d) => d && (d.titulo || d.texto));
    const principal = p.botonPrincipal || {};
    const secundario = p.botonSecundario || {};
    const logo = p.logo || '';
    const video = p.videoFondo || '';
    return `
      <section class="hero" id="inicio">
        ${video ? `<div class="hero__media" aria-hidden="true"><video class="hero__video" autoplay muted loop playsinline preload="auto"${p.poster ? ` poster="${esc(p.poster)}"` : ''}><source src="${esc(video)}" type="video/mp4"></video></div>` : ''}
        <div class="hero__frame" aria-hidden="true">
          <span class="corner corner--tl"></span><span class="corner corner--tr"></span>
          <span class="corner corner--bl"></span><span class="corner corner--br"></span>
          ${p.grabando ? `<span class="hero__rec"><i></i>${esc(p.grabando)}</span>` : ''}
          <span class="hero__tc" id="timecode">00:00:00:00</span>
          ${p.marca ? `<span class="hero__fmt">${esc(p.marca)}</span>` : ''}
        </div>
        <div class="container hero__inner${logo ? '' : ' hero__inner--solo'}">
          <div class="hero__copy">
            ${p.etiqueta ? `<p class="eyebrow hero__anim" style="--d:0">${rich(p.etiqueta)}</p>` : ''}
            ${p.titulo ? `<h1 class="hero__title hero__anim" style="--d:1">${rich(p.titulo)}</h1>` : ''}
            ${p.texto ? `<p class="hero__lead hero__anim" style="--d:2">${rich(p.texto)}</p>` : ''}
            <div class="hero__actions hero__anim" style="--d:3">
              ${principal.texto ? `<a class="btn btn--primary" href="${esc(safeUrl(principal.enlace || '#trabajos'))}">${esc(principal.texto)}${PLAY_BTN}</a>` : ''}
              ${secundario.texto ? `<a class="btn btn--ghost" href="${esc(safeUrl(secundario.enlace || '#contacto'))}">${esc(secundario.texto)}</a>` : ''}
            </div>
            ${facts.length ? `<ul class="hero__facts hero__anim" style="--d:4">${facts.map((d) => `<li>${d.titulo ? `<span>${esc(d.titulo)}</span>` : ''}${esc(d.texto || '')}</li>`).join('')}</ul>` : ''}
          </div>
          ${logo ? `<div class="hero__emblem hero__anim" style="--d:2"><img src="${esc(logo)}" alt="${esc('Logo de ' + nombre)}" width="720" height="720" fetchpriority="high"></div>` : ''}
        </div>
        <a class="hero__scroll" href="${esc(firstAnchor())}" aria-label="Bajar a la siguiente sección"><span></span></a>
      </section>`;
  }

  function renderMarquee() {
    const c = CFG.cinta || {};
    const words = (c.palabras || []).map((w) => String(w || '').trim()).filter(Boolean);
    if (c.mostrar === false || !words.length) return '';
    const unit = words.map((w) => `<span>${esc(w)}</span><i>✦</i>`).join('');
    return `<div class="marquee" aria-hidden="true"><div class="marquee__track">${unit}${unit}</div></div>`;
  }

  /* ---------- Galerías ---------- */
  function mediaMarkup(it, imgClass) {
    const bg = it.poster ? `<span class="work-card__bg" style="${esc('background-image:' + cssUrl(it.poster))}"></span>` : '';
    let main = '';
    if (it.poster) main = `<img class="${imgClass}" src="${esc(it.poster)}" alt="" loading="lazy" decoding="async">`;
    else if (it.media.type === 'local') main = `<video class="${imgClass}" src="${esc(it.media.src)}#t=0.6" muted playsinline preload="metadata"></video>`;
    return bg + main;
  }

  function cardHTML(it, i) {
    const cls = ['work-card', 'reveal'];
    if (it.ajuste === 'contain') cls.push('work-card--contain');
    const pos = it.encuadre ? `;--pos:${esc(it.encuadre)}` : '';
    return `
      <button class="${cls.join(' ')}" type="button" data-index="${i}" data-cat="${esc(slug(it.categoria))}" data-formato="${esc(it.formato)}" style="--d:${i % 6}${pos}"
        aria-label="${esc(`Ver video: ${it.titulo}${it.cliente ? ' · ' + it.cliente : ''}`)}">
        ${mediaMarkup(it, 'work-card__media')}
        <span class="work-card__shade"></span>
        <span class="work-card__corners"><span class="corner corner--tl"></span><span class="corner corner--tr"></span><span class="corner corner--bl"></span><span class="corner corner--br"></span></span>
        <span class="work-card__tag">${esc(it.categoria)} · ${esc(it.formato)}</span>
        <span class="work-card__dur">${esc(it.duracion)}</span>
        <span class="work-card__play">${ICON.play}</span>
        <span class="work-card__info"><strong>${rich(it.titulo)}</strong>${it.cliente ? `<span>${esc(it.cliente)}</span>` : ''}</span>
      </button>`;
  }

  function filtersHTML(items) {
    const cats = [];
    items.forEach((it) => {
      const id = slug(it.categoria);
      if (!cats.some((c) => c.slug === id)) cats.push({ slug: id, name: it.categoria });
    });
    if (cats.length < 2) return '';
    const count = (s) => items.filter((it) => slug(it.categoria) === s).length;
    return `<div class="filters" role="group" aria-label="Filtrar">` +
      `<button class="filter" type="button" data-filter="*" aria-pressed="true">Todos<sup>${items.length}</sup></button>` +
      cats.map((c) => `<button class="filter" type="button" data-filter="${esc(c.slug)}" aria-pressed="false">${esc(c.name)}<sup>${count(c.slug)}</sup></button>`).join('') +
      `</div>`;
  }

  function renderVideoSection(block, index) {
    const items = Array.isArray(block.videos)
      ? itemsFromRaw(block.videos, block)
      : itemsForGallery(block);
    const cols = colsAttr(block.columnas);
    const wide = items.length > 0 && items.every((it) => it.ratio >= 1);
    const empty = frase('vacioGaleria', 'Muy pronto subiré nuevos trabajos aquí.');
    const grid = items.length
      ? `<div class="work-grid" data-cols="${esc(cols)}"${wide ? ' data-layout="wide"' : ''}>${items.map(cardHTML).join('')}</div>`
      : `<p class="section__lead" style="margin:auto;text-align:center">${esc(empty)}</p>`;
    const filters = block.filtros && items.length ? filtersHTML(items) : '';
    const note = block.nota ? `<p class="section__foot reveal">${rich(block.nota)}</p>` : '';
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          ${filters}
          ${grid}
          ${note}
        </div>
      </section>`;
  }

  /* ---------- Casos ---------- */
  function caseHTML(p, pi) {
    const its = projectItems.filter((it) => it.proyecto === pi);
    const first = its[0];
    const meta = [
      [frase('cliente', 'Cliente'), p.cliente, p.clienteDetalle],
      [frase('tipo', 'Tipo'), p.categoria, first ? `${frase('formato', 'Formato')} ${first.formato}` : ''],
      [frase('plataformas', 'Plataformas'), (Array.isArray(p.plataformas) ? p.plataformas : String(p.plataformas || '').split(',')).map((x) => String(x).trim()).filter(Boolean).join(' · '), ''],
    ].filter((m) => m[1]);
    const links = Object.entries(p.links || {}).filter(([, url]) => url);
    const wide = first && first.ratio > 1.05;
    const square = first && first.ratio >= 0.9 && first.ratio <= 1.1;
    const phoneClass = wide ? ' phone--wide' : square ? ' phone--square' : '';

    const phone = first ? `
      <div class="case__media reveal">
        <button class="phone${phoneClass}" type="button" data-case="${pi}" data-jump="0" aria-label="${esc(`Ver video del proyecto: ${p.titulo}`)}"${first.encuadre ? ` style="--pos:${esc(first.encuadre)}"` : ''}>
          <span class="phone__screen">
            ${first.poster ? `<span class="work-card__bg" style="${esc('background-image:' + cssUrl(first.poster))}"></span>` : ''}
            ${first.media.type === 'local'
              ? `<video class="phone__video" src="${esc(first.media.src)}" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback draggable="false"${first.poster ? ` poster="${esc(first.poster)}"` : ''}></video>`
              : `<img class="phone__img" src="${esc(first.poster)}" alt="" loading="lazy">`}
            <span class="phone__ui"><span>${esc(nombre)}</span><b>${ICON.play}</b></span>
          </span>
        </button>
      </div>` : '';

    const countLabel = its.length > 1 ? ` · ${its.length} ${frase('videos', 'videos')}` : '';
    return `
      <article class="case${first ? '' : ' case--nomedia'}">
        ${phone}
        <div class="case__body reveal">
          <p class="case__kicker">${esc(frase('proyecto', 'Proyecto'))} ${pad(pi + 1)}${esc(countLabel)}</p>
          <h3 class="case__title">${rich(p.titulo || '')}</h3>
          ${meta.length ? `<dl class="case__meta">${meta.map(([k, v, d]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}${d ? `<small>${esc(d)}</small>` : ''}</dd></div>`).join('')}</dl>` : ''}
          ${p.descripcion ? `<p class="case__desc">${rich(p.descripcion)}</p>` : ''}
          ${(p.tareas || []).length ? `<ul class="case__tasks">${p.tareas.map((t) => `<li>${ICON.check}<span>${rich(t)}</span></li>`).join('')}</ul>` : ''}
          ${p.resultado ? `<div class="case__result"><span>${esc(frase('resultado', 'Resultado'))}</span><p>${rich(p.resultado)}</p></div>` : ''}
          ${links.length ? `<div class="case__links">${links.map(([k, url]) => `<a class="btn btn--ghost btn--sm" href="${esc(safeUrl(url))}" target="_blank" rel="noopener">${ICON[k] || ICON.external} ${esc(frase('verEn', 'Ver en'))} ${esc(NET_LABEL[k] || k)}</a>`).join('')}</div>` : ''}
        </div>
      </article>`;
  }

  function renderCasos(block, index) {
    if (!proyectos.length) return '';
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          <div class="cases">${proyectos.map(caseHTML).join('')}</div>
        </div>
      </section>`;
  }

  /* ---------- Servicios, pasos, texto ---------- */
  function tarjetasHTML(cards) {
    return (cards || []).map((card, i) => `
      <article class="service${card.grande ? ' service--wide' : ''} reveal" style="--d:${i % 6}">
        <div class="service__icon">${serviceIcon(card.icono)}</div>
        <h3>${rich(card.titulo || '')}</h3>
        ${card.texto ? `<p>${rich(card.texto)}</p>` : ''}
        ${card.lineaDeTiempo ? TIMELINE : ''}
      </article>`).join('');
  }

  function cierreHTML(cierre) {
    if (!cierre || cierre.mostrar === false || (!cierre.titulo && !cierre.texto)) return '';
    return `
      <article class="service service--cta reveal">
        <div>
          ${cierre.titulo ? `<h3>${rich(cierre.titulo)}</h3>` : ''}
          ${cierre.texto ? `<p>${rich(cierre.texto)}</p>` : ''}
        </div>
        ${cierre.boton ? `<a class="btn btn--primary" href="${esc(safeUrl(cierre.enlace || '#contacto'))}">${esc(cierre.boton)}</a>` : ''}
      </article>`;
  }

  function renderServicios(block, index) {
    const cards = block.tarjetas || [];
    if (!cards.length && !(block.cierre && block.cierre.mostrar !== false)) return '';
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          <div class="services">${tarjetasHTML(cards)}${cierreHTML(block.cierre)}</div>
        </div>
      </section>`;
  }

  function renderTarjetas(block, index) {
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          <div class="services">${tarjetasHTML(block.tarjetas)}${cierreHTML(block.cierre)}</div>
        </div>
      </section>`;
  }

  function renderPasos(block, index) {
    const list = (block.pasos || []).filter((p) => p && (p.titulo || p.texto));
    if (!list.length) return '';
    const wrap = list.length > 4 ? ' steps--wrap' : '';
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          <ol class="steps${wrap}">
            ${list.map((p, i) => `
              <li class="step reveal" style="--d:${i % 6}">
                <span class="step__tc">${esc(p.tiempo || `00:${pad(i * 5)}`)}</span>
                <h3>${rich(p.titulo || '')}</h3>
                ${p.texto ? `<p>${rich(p.texto)}</p>` : ''}
              </li>`).join('')}
          </ol>
        </div>
      </section>`;
  }

  function renderProceso(block, index) {
    return renderPasos(block, index);
  }

  function renderTexto(block, index) {
    const parrafos = (block.parrafos || []).filter((p) => String(p || '').trim());
    const lista = (block.lista || []).filter((p) => String(p || '').trim());
    const boton = block.boton || {};
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          ${parrafos.length ? `<div class="extra-copy reveal">${parrafos.map((p) => `<p>${rich(p)}</p>`).join('')}</div>` : ''}
          ${lista.length ? `<ul class="extra-list reveal">${lista.map((item) => `<li>${ICON.check}<span>${rich(item)}</span></li>`).join('')}</ul>` : ''}
          ${boton.texto ? `<div class="extra-actions reveal"><a class="btn btn--primary" href="${esc(safeUrl(boton.enlace || '#contacto'))}">${esc(boton.texto)}</a></div>` : ''}
        </div>
      </section>`;
  }

  /* ---------- Precios ---------- */
  function renderPrecios(block, index) {
    const durations = block.porDuracion || [];
    const packs = block.paquetes || [];
    if (!durations.length && !packs.length) return '';
    const sym = esc(block.simbolo || '$');
    const cur = esc(block.moneda || '');
    const price = (n) => `<span class="price"><small>${sym}</small>${esc(n)}</span>`;
    const tiles = durations.map((t, i) => `
      <div class="price-tile reveal" style="--d:${i % 6}">
        <span class="price-tile__dur">${esc(t.duracion)}</span>
        ${price(t.precio)}
        <span class="price__cur">${cur}${cur ? ' · ' : ''}${esc(frase('porVideo', 'por video'))}</span>
      </div>`).join('');
    const packHTML = packs.map((k, i) => {
      const msg = `Hola ${nombre}, me interesa el ${k.nombre}${k.detalle ? ` (${k.detalle})` : ''}. ¿Me das más información?`;
      const c = contactHref(msg);
      return `
        <article class="pack${k.destacado ? ' pack--featured' : ''} reveal" style="--d:${i % 6}">
          ${k.destacado ? `<span class="pack__badge">${esc(frase('masElegido', '★ Más elegido'))}</span>` : ''}
          <div>
            <h4 class="pack__name">${rich(k.nombre || '')}</h4>
            ${k.detalle ? `<p class="pack__detail">${rich(k.detalle)}</p>` : ''}
          </div>
          <div>
            ${price(k.precio)} <span class="price__cur">${cur}</span>
            ${k.ahorro ? `<p class="pack__save">${esc(frase('ahorras', 'Ahorras'))} ${sym}${esc(k.ahorro)}</p>` : ''}
          </div>
          ${(k.incluye || []).length ? `<ul>${k.incluye.map((x) => `<li>${ICON.check}<span>${rich(x)}</span></li>`).join('')}</ul>` : ''}
          <a class="btn ${k.destacado ? 'btn--primary' : 'btn--ghost'}" ${linkAttrs(c)}>${esc(frase('elegir', 'Elegir'))} ${esc(k.nombre || '')}</a>
        </article>`;
    }).join('');
    return `
      ${sectionOpen(block, index)}
        <div class="container">
          ${headHTML(block)}
          ${tiles ? `<div class="price-tiles">${tiles}</div>` : ''}
          ${packs.length ? `<h3 class="packs__title reveal">${esc(block.tituloPaquetes || 'Paquetes')}</h3><div class="packs">${packHTML}</div>` : ''}
          ${block.nota ? `<p class="price-note reveal">* ${rich(block.nota)}</p>` : ''}
        </div>
      </section>`;
  }

  /* ---------- Sobre mí y contacto ---------- */
  function renderSobre(block, index) {
    const parrafos = (block.parrafos || []).filter((p) => String(p || '').trim());
    const pilares = (block.pilares || []).filter((p) => p && (p.titulo || p.texto));
    const imagen = block.imagen || '';
    return `
      ${sectionOpen(block, index)}
        <div class="container about${imagen ? '' : ' about--solo'}">
          ${imagen ? `<div class="about__visual reveal"><div class="about__frame"><img src="${esc(imagen)}" alt="" width="720" height="720" loading="lazy"><span class="corner corner--tl"></span><span class="corner corner--tr"></span><span class="corner corner--bl"></span><span class="corner corner--br"></span></div></div>` : ''}
          <div class="about__body">
            ${headHTML(block, ' section__head--left')}
            ${parrafos.map((p) => `<p class="about__text reveal">${rich(p)}</p>`).join('')}
            ${pilares.length ? `<ul class="pillars reveal">${pilares.map((p) => `<li><strong>${rich(p.titulo || '')}</strong><span>${rich(p.texto || '')}</span></li>`).join('')}</ul>` : ''}
          </div>
        </div>
      </section>`;
  }

  function renderContacto(block, index) {
    const hello = String(block.mensajeWhatsapp || `Hola ${nombre}, vi tu portafolio y me gustaría cotizar un video.`).replace(/\bNOMBRE\b/g, nombre);
    const asunto = block.asuntoEmail || 'Cotización de video';
    const mail = email ? `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(hello)}` : '';
    const waAttrs = waReady
      ? `href="${esc(waLink(hello))}" target="_blank" rel="noopener"`
      : 'href="#contacto" data-pending';
    const btns = [];
    if (waDisplay) btns.push(`<a class="btn btn--primary" ${waAttrs}>${ICON.whatsapp} ${esc(frase('botonWhatsapp', 'Escríbeme por WhatsApp'))}</a>`);
    if (email) {
      btns.push(`<a class="btn ${waDisplay ? 'btn--ghost' : 'btn--primary'}" href="${esc(mail)}">${ICON.mail} ${esc(frase('botonEmail', 'Enviar email'))}</a>`);
      if (!waDisplay) btns.push(`<button class="btn btn--ghost" type="button" data-copy="${esc(email)}">${ICON.copy} <span>${esc(frase('botonCopiar', 'Copiar email'))}</span></button>`);
    }

    const nac = String(PERFIL.nacionalidad || '').trim();
    const info = [];
    if (waDisplay) info.push(`<li><a class="contact-card" ${waAttrs}><span class="contact-card__icon contact-card__icon--wa">${ICON.whatsapp}</span><span><small>${esc(frase('whatsapp', 'WhatsApp'))}</small><strong>${esc(waDisplay)}</strong></span></a></li>`);
    if (email) info.push(`<li><a class="contact-card" href="${esc(mail)}"><span class="contact-card__icon">${ICON.mail}</span><span><small>${esc(frase('email', 'Email'))}</small><strong>${esc(email)}</strong></span></a></li>`);
    if (nac) {
      const flag = /cuba|cubano|cubana/i.test(nac) ? ICON.flagCU : ICON.globe;
      info.push(`<li><div class="contact-card"><span class="contact-card__icon contact-card__icon--flag">${flag}</span><span><small>${esc(frase('nacionalidad', 'Nacionalidad'))}</small><strong>${esc(nac)}</strong></span></div></li>`);
    }
    if (PERFIL.ubicacion) info.push(`<li><div class="contact-card"><span class="contact-card__icon">${ICON.pin}</span><span><small>${esc(frase('ubicacion', 'Ubicación'))}</small><strong>${esc(PERFIL.ubicacion)}</strong></span></div></li>`);

    const redes = PERFIL.redes || {};
    const socials = Object.keys(NET_LABEL).filter((k) => redes[k]).map((k) => `<li><a href="${esc(safeUrl(redes[k]))}" target="_blank" rel="noopener" aria-label="${esc(NET_LABEL[k])}">${ICON[k]}</a></li>`);
    if (redes.otra && redes.otra.enlace) {
      socials.push(`<li><a href="${esc(safeUrl(redes.otra.enlace))}" target="_blank" rel="noopener" aria-label="${esc(redes.otra.nombre || 'Enlace')}">${ICON.globe}</a></li>`);
    }

    return `
      ${sectionOpen(block, index)}
        <div class="container">
          <div class="contact__panel reveal">
            <p class="label label--center"><span>00</span>${esc(block.etiqueta || '')}</p>
            ${block.titulo ? `<h2 class="contact__title">${rich(block.titulo)}</h2>` : ''}
            ${block.texto ? `<p class="contact__lead">${rich(block.texto)}</p>` : ''}
            <div class="contact__actions" id="contact-actions">${btns.join('')}</div>
            ${info.length ? `<ul class="contact__info">${info.join('')}</ul>` : ''}
            <ul class="socials" id="socials">${socials.join('')}</ul>
            ${block.despedida ? `<p class="contact__sign">${rich(block.despedida)}</p>` : ''}
          </div>
        </div>
      </section>`;
  }

  function renderBlock(block, index) {
    const tipo = block.tipo || '';
    if (tipo === 'galeria' || tipo === 'videos') return renderVideoSection(block, index);
    if (tipo === 'texto') return renderTexto(block, index);
    if (tipo === 'tarjetas') return renderTarjetas(block, index);
    if (tipo === 'pasos') return renderPasos(block, index);
    if (block.id === 'casos') return renderCasos(block, index);
    if (block.id === 'servicios') return renderServicios(block, index);
    if (block.id === 'proceso') return renderProceso(block, index);
    if (block.id === 'precios') return renderPrecios(block, index);
    if (block.id === 'sobre-mi') return renderSobre(block, index);
    if (block.id === 'contacto') return renderContacto(block, index);
    return '';
  }

  /* ---------- Eventos de galería, casos y contacto ---------- */
  const galleryItems = new Map();

  const durObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          durObserver.unobserve(e.target);
          const durEl = $('.work-card__dur', e.target);
          const probe = document.createElement('video');
          probe.preload = 'metadata';
          probe.muted = true;
          probe.src = e.target.dataset.src;
          probe.addEventListener('loadedmetadata', () => {
            if (durEl) durEl.textContent = fmtDur(probe.duration);
            probe.removeAttribute('src');
            probe.load();
          }, { once: true });
        });
      }, { rootMargin: '200px' })
    : null;

  function setupLocalCard(card, it) {
    card.dataset.src = it.media.src;
    if (!it.duracion && durObserver) durObserver.observe(card);
    if (!canHover || reduceMotion) return;
    let timer = 0;
    let preview = null;
    card.addEventListener('pointerenter', () => {
      timer = setTimeout(() => {
        preview = document.createElement('video');
        preview.className = 'work-card__preview';
        preview.muted = true;
        preview.loop = true;
        preview.playsInline = true;
        preview.src = it.media.src;
        protectVideo(preview);
        card.insertBefore(preview, $('.work-card__shade', card));
        preview.play().then(() => {
          if (!preview) return;
          preview.classList.add('is-playing');
          card.classList.add('is-previewing');
        }).catch(() => {});
      }, 160);
    });
    card.addEventListener('pointerleave', () => {
      clearTimeout(timer);
      card.classList.remove('is-previewing');
      if (preview) { preview.pause(); preview.remove(); preview = null; }
    });
  }

  function bindGalleries() {
    $$('.work-grid').forEach((grid) => {
      const cards = $$('.work-card', grid);
      const items = cards.map((card) => galleryItems.get(card)).filter(Boolean);
      cards.forEach((card) => {
        const it = galleryItems.get(card);
        if (!it) return;
        const img = $('img.work-card__media', card);
        if (img) img.addEventListener('error', () => card.classList.add('is-broken'), { once: true });
        card.addEventListener('click', () => {
          const visibleCards = $$('.work-card:not(.is-hidden)', grid);
          const visible = visibleCards.map((c) => galleryItems.get(c)).filter(Boolean);
          openLightbox(visible, Math.max(0, visible.indexOf(it)), card);
        });
        if (it.media.type === 'local') setupLocalCard(card, it);
      });
      const filters = grid.previousElementSibling && grid.previousElementSibling.classList.contains('filters')
        ? grid.previousElementSibling
        : null;
      if (!filters) return;
      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter');
        if (!btn) return;
        $$('.filter', filters).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        const f = btn.dataset.filter;
        $$('.work-card', grid).forEach((card) => card.classList.toggle('is-hidden', f !== '*' && card.dataset.cat !== f));
      });
      void items;
    });
  }

  function bindCases() {
    $$('[data-case]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pi = +btn.dataset.case;
        const its = projectItems.filter((it) => it.proyecto === pi);
        const jump = Number(btn.dataset.jump || 0);
        openLightbox(its, jump, btn);
      });
    });
    const vids = $$('.phone__video');
    if (reduceMotion || !vids.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach((v) => io.observe(v));
  }

  function bindContact() {
    const rootContact = $('#contacto');
    if (!rootContact) return;
    $$('[data-pending]', rootContact).forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
    const copyBtn = $('[data-copy]', rootContact);
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
      const label = $('span', copyBtn);
      const done = frase('textoCopiado', '¡Copiado!');
      const back = frase('botonCopiar', 'Copiar email');
      const finish = () => {
        if (!label) return;
        label.textContent = done;
        setTimeout(() => { label.textContent = back; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(copyBtn.dataset.copy).then(finish, () => {});
    });
  }

  function rememberCards() {
    galleryItems.clear();
    $$('.work-grid').forEach((grid) => {
      const section = grid.closest('section');
      const block = section ? findBlock(section.id) : null;
      const items = block && Array.isArray(block.videos)
        ? itemsFromRaw(block.videos, block)
        : itemsForGallery(block || {});
      $$('.work-card', grid).forEach((card, i) => galleryItems.set(card, items[i]));
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbStage = $('#lb-stage');
  let lbList = [];
  let lbIndex = 0;
  let lbReturn = null;

  function openLightbox(list, index, opener) {
    if (!lb || !list.length) return;
    lbList = list;
    lbIndex = Math.max(0, index);
    lbReturn = opener || document.activeElement;
    lb.hidden = false;
    document.body.classList.add('is-locked');
    renderLightbox();
    $('.lightbox__close', lb).focus();
  }

  function fitVideo(el, ar) {
    el.style.aspectRatio = String(ar);
    if (ar >= 1) {
      el.style.width = `min(92vw, 1100px, calc((100svh - var(--lb-space)) * ${ar}))`;
      el.style.height = 'auto';
    } else {
      el.style.height = `min(calc(100svh - var(--lb-space)), 820px, calc(92vw / ${ar}))`;
      el.style.width = 'auto';
    }
  }

  function renderLightbox() {
    const it = lbList[lbIndex];
    lbStage.innerHTML = '';
    const ar = it.ratio || (it.formato === '16:9' ? 16 / 9 : 9 / 16);
    if (it.media.type === 'local') {
      const v = document.createElement('video');
      v.src = it.media.src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      if (it.poster) v.poster = it.poster;
      fitVideo(v, ar);
      v.addEventListener('loadedmetadata', () => { if (v.videoWidth) fitVideo(v, v.videoWidth / v.videoHeight); }, { once: true });
      protectVideo(v);
      lbStage.append(v);
      v.play().catch(() => {});
    } else {
      const f = document.createElement('iframe');
      f.src = it.media.embed;
      f.title = it.titulo;
      f.allow = PROT.bloquearDescarga ? 'autoplay; encrypted-media; fullscreen' : 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.className = ar >= 1 ? 'lb-frame--h' : 'lb-frame--v';
      fitVideo(f, ar);
      lbStage.append(f);
      if (it.media.type === 'drive' && PROT.bloquearDescarga) {
        lbStage.insertAdjacentHTML('beforeend', '<span class="lb-shield" aria-hidden="true"></span>');
      }
    }
    lbStage.insertAdjacentHTML('beforeend', watermarkHTML());
    $('#lb-title').textContent = it.titulo;
    $('#lb-meta').textContent = [it.cliente, it.categoria].filter(Boolean).join(' · ');
    $('#lb-count').textContent = lbList.length > 1 ? `${pad(lbIndex + 1)} / ${pad(lbList.length)}` : '';
    $$('.lightbox__nav', lb).forEach((b) => { b.hidden = lbList.length < 2; });
  }

  function stepLightbox(dir) {
    if (lbList.length < 2) return;
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    renderLightbox();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lbStage.innerHTML = '';
    lb.hidden = true;
    document.body.classList.remove('is-locked');
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }

  if (lb) {
    $$('[data-close]', lb).forEach((el) => el.addEventListener('click', closeLightbox));
    $('.lightbox__nav--prev', lb).addEventListener('click', () => stepLightbox(-1));
    $('.lightbox__nav--next', lb).addEventListener('click', () => stepLightbox(1));
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') stepLightbox(1);
      else if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'Tab') {
        const f = $$('button:not([hidden]), video, iframe', lb).filter((el) => el.offsetParent !== null || el.tagName === 'IFRAME');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Intro, header, scroll ---------- */
  function runIntro() {
    const intro = $('#intro');
    const ready = () => root.classList.add('is-ready');
    if (!intro) return ready();

    let seen = false;
    try { seen = sessionStorage.getItem('desmos-intro') === '1'; } catch (_) { /* sin storage */ }
    if (seen || reduceMotion || location.hash.length > 1 || CFG.__borrador) {
      intro.remove();
      ready();
      return;
    }
    try { sessionStorage.setItem('desmos-intro', '1'); } catch (_) { /* sin storage */ }

    const video = $('video', intro);
    document.body.classList.add('is-locked');
    let done = false;
    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); finish(); }
    };
    function finish() {
      if (done) return;
      done = true;
      intro.classList.add('is-done');
      document.body.classList.remove('is-locked');
      removeEventListener('keydown', onKey);
      ready();
      setTimeout(() => intro.remove(), 900);
    }
    addEventListener('keydown', onKey);
    intro.addEventListener('click', finish);
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (video.currentTime > 3.2) intro.classList.add('show-brand');
        if (video.currentTime > 4.95) finish();
      });
      video.addEventListener('ended', finish);
      video.addEventListener('error', finish);
      const p = video.play();
      if (p && p.catch) p.catch(finish);
    } else finish();
    setTimeout(finish, 9000);
  }

  function setupHeader() {
    const header = $('#header');
    const bar = $('#progress');
    const toggle = $('.nav__toggle');
    const links = $('#nav-links');
    if (!header || !bar || !toggle || !links) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();

    const setOpen = (open) => {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? frase('cerrarMenu', 'Cerrar menú') : frase('abrirMenu', 'Abrir menú'));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
    $$('a', links).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    if (!('IntersectionObserver' in window)) return;
    const navLinks = $$('.nav__links a[href^="#"]:not(.btn)');
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove('is-active'));
        const a = byId.get(e.target.dataset.nav || e.target.id);
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach((s) => spy.observe(s));
  }

  function setupHero() {
    const hero = $('.hero');
    const video = $('.hero__video');
    const tc = $('#timecode');
    if (!tc) {
      if (video && reduceMotion) video.pause();
      return;
    }
    let visible = true;
    let raf = 0;
    let lastFrame = -1;
    const t0 = performance.now();
    if (video && reduceMotion) video.pause();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      const frame = Math.floor(t * 30);
      if (frame !== lastFrame) {
        lastFrame = frame;
        tc.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t) % 60)}:${pad(frame % 30)}`;
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    if (!reduceMotion) raf = requestAnimationFrame(tick);
    if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (video && !reduceMotion) { if (visible) video.play().catch(() => {}); else video.pause(); }
      if (visible && !reduceMotion) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    }).observe(hero);
  }

  function setupReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function numberSections() {
    $$('main > .section').filter((s) => !s.hidden).forEach((s, i) => {
      const n = $('.label span', s);
      if (n) n.textContent = pad(i + 1);
    });
  }

  function renderPage() {
    const main = $('#contenido');
    if (!main) return;
    const html = [renderHero(), renderMarquee()]
      .concat(sectionSequence().map((block, i) => renderBlock(block, i)))
      .join('');
    main.innerHTML = html;
    rememberCards();
    bindGalleries();
    bindCases();
    bindContact();
  }

  applyMeta();
  applyChrome();
  setupIntro();
  renderNav();
  renderPage();
  numberSections();

  if (PROT.bloquearDescarga) {
    const MEDIA = 'video, .work-card, .phone, .lightbox__stage, .hero__media, .hero__emblem, .about__frame, .intro';
    document.addEventListener('contextmenu', (e) => { if (e.target.closest(MEDIA)) e.preventDefault(); });
    document.addEventListener('dragstart', (e) => { if (e.target.closest(MEDIA)) e.preventDefault(); });
    $$('video').forEach(protectVideo);
  }

  setupHeader();
  setupHero();
  setupReveal();
  runIntro();
})();
