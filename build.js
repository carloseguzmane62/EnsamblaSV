/* ===========================================================================
   ENSAMBLA — build estático
   Convierte los templates del design-tool (en _extract/) a HTML estático,
   pre-renderizado, con SEO completo, imágenes WebP y Nav/Footer/loader propios.
   Uso:  node build.js
   Salida: index.html, precios.html, faq.html, privacidad.html, terminos.html
   =========================================================================== */
'use strict';
const fs = require('fs');
const crypto = require('crypto');

/* ---- Config editable ---------------------------------------------------- */
// Cache-busting automático: hash del contenido real de CSS + JS.
// Cambia solo cuando editas esos archivos → el navegador (y el celular) siempre
// baja la versión nueva, sin tener que subir el número a mano.
const hashFiles = (paths) => {
  const h = crypto.createHash('sha1');
  for (const p of paths) { try { h.update(fs.readFileSync(p)); } catch (e) {} }
  return h.digest('hex').slice(0, 8);
};
const VER = hashFiles(['assets/css/styles.css', 'assets/js/enhance.js']);
const SITE_URL = 'https://ensambla.vercel.app';    // ← cambia cuando tengas dominio propio
const WA = 'https://wa.me/50374691631';            // WhatsApp +503 7469 1631
const EMAIL = 'carlose.guzmane62@gmail.com';
const OG_IMAGE = SITE_URL + '/assets/img/hero-dashboard.webp';

/* ---- Marca / logo -------------------------------------------------------- */
const LOGO = (px) => `<svg class="brand-mark" width="${px}" height="${px}" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="10" fill="#FAF9F5"/><circle cx="60" cy="24" r="10" fill="#FAF9F5"/><circle cx="24" cy="60" r="10" fill="#FAF9F5"/><rect x="46" y="46" width="26" height="26" rx="8" fill="#F0A125" transform="rotate(45 60 60)"/></svg>`;

/* ---- Imágenes: uuid -> archivo webp + alt + dimensiones ------------------ */
const IMAGES = {
  'a36c6760-a07b-4e46-ad3e-ed31d419b4fc': { f: 'hero-dashboard.webp', alt: 'Panel de ENSAMBLA con setlists, calendario y músicos del equipo', w: 1339, h: 996, hero: true },
  '0314cab6-933d-4a31-90ef-f3f4eb11d729': { f: 'calendario-eventos.webp', alt: 'Calendario de eventos y ensayos en ENSAMBLA', w: 1334, h: 991 },
  '87d8fbe7-787e-458b-a0c5-73887ca0a496': { f: 'instrumentos-musicos.webp', alt: 'Instrumentos y músicos asignados por evento', w: 1338, h: 998 },
  '9c61e8ad-c740-4009-b8c9-6415f5550284': { f: 'miembros-roles.webp', alt: 'Miembros, roles y multi-organización', w: 1336, h: 995 },
  'e20f987b-96b4-4f37-937d-dfaccc2d9409': { f: 'disponibilidad.webp', alt: 'Disponibilidad de cada músico', w: 1327, h: 994 },
  '6abbbd36-d07a-46c9-aed1-1c2aca7a882c': { f: 'chat-equipo.webp', alt: 'Chat interno del equipo', w: 1259, h: 977 },
  '59124c6f-a603-412a-bc66-622720c6805c': { f: 'cancionero-acordes.webp', alt: 'Cancionero con acordes y transposición', w: 1318, h: 1003 },
  'b0eb83b5-d6b6-4339-98eb-3dc88bf1d0fd': { f: 'inteligencia-artificial.webp', alt: 'Funciones de IA con Google Gemini en ENSAMBLA', w: 1332, h: 989 },
  '1106ec9f-0a34-4175-81d9-42ef49838466': { f: 'modo-en-vivo-1.webp', alt: 'Modo en vivo con metrónomo integrado en ENSAMBLA', w: 1329, h: 999 },
  '07c83189-6360-48b8-92eb-a82535ada9f8': { f: 'modo-en-vivo-2.webp', alt: 'Pantalla de metrónomo y tempo del modo en vivo', w: 1335, h: 994 },
};

/* ---- Loader (solo mostrativo) ------------------------------------------- */
const LOADER = `<div id="loader" role="status" aria-live="polite" aria-label="Cargando ENSAMBLA"><svg class="loader-mark" viewBox="0 0 120 120" aria-hidden="true"><circle cx="24" cy="24" r="10" fill="#FAF9F5"/><circle cx="60" cy="24" r="10" fill="#FAF9F5"/><circle cx="24" cy="60" r="10" fill="#FAF9F5"/><rect x="46" y="46" width="26" height="26" rx="8" fill="#F0A125" transform="rotate(45 60 60)"/></svg></div>`;

/* ---- Navbar -------------------------------------------------------------- */
function NAV(active) {
  const cur = (k) => active === k ? ' aria-current="page"' : '';
  return `<header class="nav">
  <a class="nav__brand" href="index.html" title="ENSAMBLA — inicio"><img class="nav__logo-img" src="assets/brand/logo-completo-oscuro.png" alt="ENSAMBLA" width="1573" height="370"></a>
  <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu"><span></span><span></span><span></span></button>
  <nav class="nav__links" id="nav-menu" aria-label="Principal">
    <a class="nav__link" href="index.html#funcionalidades"${cur('funcionalidades')}>Funcionalidades</a>
    <a class="nav__link" href="precios.html"${cur('precios')}>Precios</a>
    <a class="nav__link" href="faq.html"${cur('faq')}>FAQ</a>
    <a class="nav__cta" href="${WA}?text=Hola%2C%20quiero%20agendar%20una%20demo%20de%20ENSAMBLA" target="_blank" rel="noopener" title="Agendar demo por WhatsApp">Agendar demo</a>
  </nav>
</header>`;
}

/* ---- Footer -------------------------------------------------------------- */
const FOOTER = `<footer class="footer">
  <div class="footer__grid">
    <div class="footer__brand">
      <div class="footer__brandrow"><img class="footer__logo-img" src="assets/brand/logo-completo-oscuro.png" alt="ENSAMBLA" width="1573" height="370"></div>
      <p class="footer__tagline">Gestión para equipos de música y alabanza: canciones con acordes, setlists, eventos, disponibilidad, chat y metrónomo integrado.</p>
    </div>
    <div class="footer__col">
      <span class="footer__title">Producto</span>
      <a class="footer__link" href="index.html#funcionalidades">Funcionalidades</a>
      <a class="footer__link" href="precios.html">Precios</a>
      <a class="footer__link" href="faq.html">Preguntas frecuentes</a>
    </div>
    <div class="footer__col">
      <span class="footer__title">Contacto</span>
      <a class="footer__link" href="${WA}?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20de%20ENSAMBLA" target="_blank" rel="noopener">WhatsApp +503 7469 1631</a>
      <a class="footer__link" href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
    <div class="footer__col">
      <span class="footer__title">Legal</span>
      <a class="footer__link" href="privacidad.html">Política de privacidad</a>
      <a class="footer__link" href="terminos.html">Términos y condiciones</a>
    </div>
  </div>
  <div class="footer__bottom">
    <span>&copy; 2026 ENSAMBLA · Carlos Enrique Guzmán Espinoza · El Salvador</span>
    <span>Hecho para equipos que hacen música.</span>
  </div>
</footer>`;

/* ---- Anuncio ENSAMBLA (bloque de video de la portada) --------------------
   Coloca tu clip en:  assets/video/ensambla-demo.mp4
   preload="metadata" => no descarga el video hasta que le den play (rápido).  */
const ANUNCIO = `<video controls preload="metadata" playsinline poster="assets/img/hero-dashboard.webp" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; background:#0D0C0B;" title="ENSAMBLA en acción">
  <source src="assets/video/ensambla-demo.mp4" type="video/mp4">
  Tu navegador no reproduce este video. <a href="${WA}?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20ENSAMBLA" target="_blank" rel="noopener">Ver la demo por WhatsApp</a>.
</video>`;

/* ---- Testimonios (marquee de columnas animadas) ------------------------- */
/* 3 columnas que se desplazan en loop (desktop/tablet); en móvil quedan en
   stack estático. enhance.js duplica cada columna para el loop sin costura. */
const T_COLS = [
  { dur: 34, cls: 'tcol--sm', items: [
    { i: 'DR', n: 'Daniel Reyes', r: 'Líder de alabanza · Vida Nueva',
      t: 'Antes perdíamos veinte minutos de cada ensayo viendo quién tenía la última versión del setlist. Con Ensambla eso simplemente desapareció.' },
    { i: 'ME', n: 'Marta Escobar', r: 'Baterista · León de Judá',
      t: 'El modo en vivo con el metrónomo integrado cambió cómo tocamos. Ya no hay excusas de tempo el domingo en la mañana.' },
    { i: 'KV', n: 'Karla Villalta', r: 'Tecladista · Casa de Adoración',
      t: 'Paso los acordes al teléfono y los músicos nuevos los leen sin que tenga que imprimir nada. Se acabaron las carpetas.' },
    { i: 'RA', n: 'Roberto Aguilar', r: 'Coordinador · Ministerio Emanuel',
      t: 'Confirmar quién sirve cada fin de semana era un dolor de cabeza por WhatsApp. Ahora cada quien marca su disponibilidad y listo.' },
  ] },
  { dur: 42, cls: 'tcol--md', items: [
    { i: 'DM', n: 'Daniel Molina', r: 'Coordinador · Banda Génesis',
      t: 'Tenemos tres grupos distintos y cada músico ahora sabe exactamente cuándo y dónde toca. La disponibilidad sola nos ahorra horas.' },
    { i: 'SP', n: 'Sofía Peña', r: 'Corista · Ministerio Shalom',
      t: 'Lo probé una semana con el grupo de jóvenes y ya no volvimos atrás. Todo el ensayo fluye desde el celular.' },
    { i: 'JC', n: 'Josué Cortez', r: 'Director musical · Restauración',
      t: 'Armar el setlist con tono, tempo y notas por canción me toma cinco minutos. Lo que antes era una noche entera de preparación.' },
    { i: 'AG', n: 'Andrea Guevara', r: 'Líder de jóvenes · Betel',
      t: 'Los músicos nuevos entienden en minutos cómo funciona. No tuve que explicar nada dos veces, la app se explica sola.' },
  ] },
  { dur: 38, cls: 'tcol--lg', items: [
    { i: 'EM', n: 'Ernesto Menjívar', r: 'Bajista · Monte de Sion',
      t: 'El calendario de eventos con roles asignados nos quitó el clásico &laquo;pensé que hoy no me tocaba&raquo;. Todos ven lo mismo.' },
    { i: 'LP', n: 'Lucía Portillo', r: 'Pastora de alabanza · Getsemaní',
      t: 'Dirijo dos congregaciones y cambiar entre ambas sin cerrar sesión es lo que más uso. Un solo lugar para todo mi equipo.' },
    { i: 'FN', n: 'Fernando Navas', r: 'Guitarrista · Nueva Esperanza',
      t: 'La sugerencia de canciones con IA nos dio ideas frescas cuando ya no sabíamos qué tocar. Nos sacó de la rutina de siempre.' },
    { i: 'GH', n: 'Gabriela Hernández', r: 'Corista · Manantial de Vida',
      t: 'Todo el equipo en un chat con el contexto del evento a la par. Se acabó buscar mensajes viejos entre mil grupos de WhatsApp.' },
  ] },
];
const tqCard = (t) => `        <figure class="tq">
          <div class="tq__stars" aria-label="5 de 5 estrellas">★★★★★</div>
          <blockquote class="tq__text">${t.t}</blockquote>
          <figcaption class="tq__author"><span class="tq__avatar" aria-hidden="true">${t.i}</span><span class="tq__who"><span class="tq__name">${t.n}</span><span class="tq__role">${t.r}</span></span></figcaption>
        </figure>`;
const TESTIMONIALS_HTML = `<div class="tsection">
  <div class="tsection__head">
    <span class="tsection__badge">EQUIPOS QUE YA LO USAN</span>
    <h2 class="tsection__title">Menos caos, más música.</h2>
    <p class="tsection__sub">Líderes, músicos y coordinadores cuentan qué cambió cuando empezaron a ensamblar con nosotros.</p>
  </div>
  <div class="tmarquee" role="region" aria-label="Testimonios de usuarios">
${T_COLS.map(c => `    <div class="tcol ${c.cls}">
      <div class="tcol__track" data-dur="${c.dur}">
${c.items.map(tqCard).join('\n')}
      </div>
    </div>`).join('\n')}
  </div>
</div>
`;

/* ---- Funcionalidades (rediseño: bento grid) ------------------------------ */
const FEATURES = [
  { img: 'cancionero-acordes.webp', t: 'Cancionero con acordes', d: 'Letras, acordes y tono ajustable para cada voz e instrumento. Transpón una canción entera con un toque.', span: 'b-wide b-tall' },
  { img: 'calendario-eventos.webp', t: 'Calendario de eventos y ensayos', d: 'Fechas, lugares y horarios en un solo calendario que todo el equipo ve.', span: 'b-wide' },
  { img: 'disponibilidad.webp', t: 'Disponibilidad de cada músico', d: 'Cada quien marca cuándo puede; tú armas el equipo sin adivinar.', span: 'b-wide' },
  { img: 'instrumentos-musicos.webp', t: 'Instrumentos y músicos', d: 'Asigna quién toca qué en cada servicio.', span: 'b-md' },
  { img: 'chat-equipo.webp', t: 'Chat interno del equipo', d: 'Coordina sin perder mensajes.', span: 'b-md' },
  { img: 'miembros-roles.webp', t: 'Miembros y multi-organización', d: 'Varios grupos, una sola cuenta.', span: 'b-md' },
];
const FUNCIONALIDADES_HTML = `<div id="funcionalidades" style="background: #FAF9F5; padding: clamp(56px,8vw,96px) clamp(20px,5vw,48px);">
  <div style="text-align: center; max-width: 760px; margin: 0 auto clamp(36px,5vw,52px);">
    <div style="font-family: 'Outfit'; font-weight: 700; font-size: 14px; letter-spacing: 3px; color: #C9821D;">FUNCIONALIDADES</div>
    <h2 style="font-family: 'Outfit'; font-weight: 800; font-size: clamp(28px,4vw,40px); color: #1F1B14; margin: 12px 0 0;">Orden y control de todo el equipo.</h2>
  </div>
  <div class="bento">
${FEATURES.map(f => `    <article class="bento__item ${f.span}">
      <img src="assets/img/${f.img}" alt="${f.t} en ENSAMBLA" title="${f.t}" loading="lazy" decoding="async">
      <div class="bento__cap"><h3>${f.t}</h3><p>${f.d}</p></div>
    </article>`).join('\n')}
  </div>
</div>
`;

/* ---- FaqItem (accordion nativo <details>) -------------------------------- */
function faqItem(q, a) {
  return `<details style="background:#FFFFFF; border:1px solid #E5E0D6; border-radius:14px; padding:0; overflow:hidden;">
  <summary style="font-family:'Outfit'; font-weight:700; font-size:16px; color:#1F1B14; padding:18px 22px; cursor:pointer; list-style:none;">${q}</summary>
  <div style="font-family:'Outfit'; font-size:14.5px; line-height:1.65; color:#6B6459; padding:0 22px 18px;">${a}</div>
</details>`;
}

/* ---- Metadatos SEO por página ------------------------------------------- */
const PAGES = {
  index:      { file: 'index.html', active: 'home', path: '/',
    title: 'ENSAMBLA — Gestión para equipos de música y alabanza',
    desc: 'Canciones con acordes, setlists, calendario de eventos, disponibilidad, chat y metrónomo integrado. Todo tu equipo de música sincronizado, del ensayo al escenario. 14 días gratis.' },
  precios:    { file: 'precios.html', active: 'precios', path: '/precios.html',
    title: 'Precios — ENSAMBLA',
    desc: 'Planes de ENSAMBLA desde $4.99/mes. 14 días de prueba gratis, sin tarjeta. Un plan para cada tamaño de equipo de música y alabanza.' },
  faq:        { file: 'faq.html', active: 'faq', path: '/faq.html',
    title: 'Preguntas frecuentes — ENSAMBLA',
    desc: 'Todo sobre ENSAMBLA: plataformas, precios, prueba gratis, organizaciones, metrónomo y modo en vivo. Respuestas claras para tu equipo de música.' },
  privacidad: { file: 'privacidad.html', active: '', path: '/privacidad.html',
    title: 'Política de privacidad — ENSAMBLA',
    desc: 'Cómo ENSAMBLA recopila, usa y protege tus datos. Política de privacidad de la app de gestión para equipos de música y alabanza.' },
  terminos:   { file: 'terminos.html', active: '', path: '/terminos.html',
    title: 'Términos y condiciones — ENSAMBLA',
    desc: 'Términos y condiciones de uso de ENSAMBLA, la app de gestión para equipos de música y alabanza.' },
};

/* ---- Helpers de transformación ------------------------------------------ */
function attrs(str) {
  const out = {};
  const re = /([a-zA-Z_][\w-]*)\s*=\s*"([^"]*)"/g; let m;
  while ((m = re.exec(str))) out[m[1]] = m[2];
  return out;
}

function transformImages(html) {
  return html.replace(/<img\s+src="([^"]+)"([^>]*)>/g, (full, uuid, rest) => {
    const info = IMAGES[uuid];
    if (!info) return full; // deja intacto lo desconocido
    // El estilo original controla el tamaño (width:100% o height:440px, etc.).
    // Los atributos width/height del HTML son solo pistas para el navegador y
    // NO deben romper el aspect ratio: forzamos la dimensión que el CSS deja
    // libre a "auto" (si no, la imagen sale estirada/gigante).
    let css = (rest.match(/style="([^"]*)"/) || [null, ''])[1];
    const hasW = /(?:^|;)\s*width\s*:/.test(css);
    const hasH = /(?:^|;)\s*height\s*:/.test(css);
    if (hasW && !hasH) css += ';height:auto';
    else if (hasH && !hasW) css += ';width:auto';
    else if (!hasW && !hasH) css += 'max-width:100%;height:auto';
    const load = info.hero
      ? 'loading="eager" fetchpriority="high" decoding="async"'
      : 'loading="lazy" decoding="async"';
    return `<img src="assets/img/${info.f}" alt="${info.alt}" title="${info.alt}" width="${info.w}" height="${info.h}" ${load} style="${css}">`;
  });
}

function replaceImports(html) {
  return html.replace(/<dc-import\b([^>]*)>\s*<\/dc-import>/g, (full, a) => {
    const at = attrs(a);
    switch (at.name) {
      case 'Nav': return NAV(at.active || '');
      case 'Footer': return FOOTER;
      case 'Anuncio ENSAMBLA': return ANUNCIO;
      case 'FaqItem': return faqItem(at.q || '', at.a || '');
      default: return ''; // componente desconocido -> se omite
    }
  });
}

function collectFaq(html) {
  const items = [];
  const re = /<dc-import\b([^>]*)>\s*<\/dc-import>/g; let m;
  while ((m = re.exec(html))) {
    const at = attrs(m[1]);
    if (at.name === 'FaqItem') items.push({ q: at.q || '', a: (at.a || '').replace(/hola@ensambla\.app/g, EMAIL) });
  }
  return items;
}

function extractBody(tpl) {
  // Contenido real entre <x-dc> ... </x-dc>, sin el <helmet>
  let inner = tpl.slice(tpl.indexOf('<x-dc>') + 6, tpl.lastIndexOf('</x-dc>'));
  inner = inner.replace(/<helmet>[\s\S]*?<\/helmet>/g, '');
  return inner.trim();
}

function applyEnhancements(html) {
  // Marcadores para las animaciones de enhance.js (todo opcional/no-JS-safe).
  return html
    // rediseño de funcionalidades (bento) y testimonios (solo en la portada)
    .replace(/<!-- FUNCIONALIDADES -->[\s\S]*?(?=\s*<!-- IA -->)/, FUNCIONALIDADES_HTML)
    .replace(/<!-- TESTIMONIOS -->[\s\S]*?(?=\s*<!-- PRECIOS TEASER -->)/, TESTIMONIALS_HTML)
    // contenedor principal
    .replace('<div style="display: flex; flex-direction: column;">',
             '<div class="site-main" style="display: flex; flex-direction: column;">')
    // mockup del hero -> animación 3D en scroll
    .replace('<div style="margin-top: 20px; width: 100%; max-width: 980px;',
             '<div class="hero-mockup" style="margin-top: 20px; width: 100%; max-width: 980px;')
    // grids de tarjetas -> reveal en cascada + hover
    .replace(/<div style="display: grid; grid-template-columns: repeat\(auto-fit/g,
             '<div class="reveal-grid" style="display: grid; grid-template-columns: repeat(auto-fit');
}

function fixLinks(html) {
  return html
    .replace(/hola@ensambla\.app/g, EMAIL)   // usa el correo de contacto real
    .replace(/href="Sitio - Precios\.dc\.html"/g, 'href="precios.html"')
    .replace(/href="Sitio - FAQ\.dc\.html"/g, 'href="faq.html"')
    .replace(/href="Sitio - Privacidad\.dc\.html"/g, 'href="privacidad.html"')
    .replace(/href="Sitio - T[eé]rminos\.dc\.html"/g, 'href="terminos.html"');
}

function renameRawTags(html) {
  // sc-raw-table/thead/tbody/tr/td -> etiquetas HTML reales
  return html
    .replace(/<(\/?)sc-raw-table/g, '<$1table')
    .replace(/<(\/?)sc-raw-thead/g, '<$1thead')
    .replace(/<(\/?)sc-raw-tbody/g, '<$1tbody')
    .replace(/<(\/?)sc-raw-tr/g, '<$1tr')
    .replace(/<(\/?)sc-raw-td/g, '<$1td');
}

function jsonLd(key, faqItems) {
  const org = {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'ENSAMBLA',
    url: SITE_URL, logo: SITE_URL + '/favicon.svg',
    email: EMAIL, founder: 'Carlos Enrique Guzmán Espinoza',
    areaServed: 'SV', sameAs: [],
    contactPoint: { '@type': 'ContactPoint', contactType: 'ventas', telephone: '+50374691631', availableLanguage: 'es' },
  };
  const app = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'ENSAMBLA',
    applicationCategory: 'BusinessApplication', operatingSystem: 'iOS, Android, Web',
    description: PAGES.index.desc, url: SITE_URL,
    offers: { '@type': 'Offer', price: '4.99', priceCurrency: 'USD',
      description: 'Desde $4.99/mes, 14 días de prueba gratis' },
  };
  const blocks = [org];
  if (key === 'index') blocks.push(app);
  if (key === 'faq' && faqItems.length) {
    blocks.push({ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqItems.map(i => ({ '@type': 'Question', name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a } })) });
  }
  return blocks.map(b => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n  ');
}

function head(p, faqItems) {
  const canonical = SITE_URL + p.path;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0D0C0B">
  <meta name="robots" content="index, follow, max-image-preview:large">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ENSAMBLA">
  <meta property="og:locale" content="es_ES">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1339">
  <meta property="og:image:height" content="996">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.desc}">
  <meta name="twitter:image" content="${OG_IMAGE}">

  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/brand/icono-app-oscuro.png" type="image/png" sizes="1024x1024">
  <link rel="apple-touch-icon" href="assets/brand/icono-app-oscuro.png">
  <link rel="manifest" href="site.webmanifest">

  <link rel="preload" as="font" type="font/woff2" href="assets/fonts/outfit-latin.woff2" crossorigin>${p.active === 'home' ? '\n  <link rel="preload" as="image" href="assets/img/hero-dashboard.webp" fetchpriority="high">' : ''}
  <link rel="stylesheet" href="assets/css/styles.css?v=${VER}">

  ${jsonLd(p.active === 'home' ? 'index' : (p.file === 'faq.html' ? 'faq' : 'other'), faqItems)}
</head>
<body>
${LOADER}
<div id="progress" aria-hidden="true"></div>
`;
}

const TAIL = `
<script>
  // Loader solo mostrativo: se oculta al terminar de cargar la página.
  (function () {
    var l = document.getElementById('loader');
    if (!l) return;
    function hide() { l.classList.add('hidden'); }
    if (document.readyState === 'complete') setTimeout(hide, 300);
    else window.addEventListener('load', function () { setTimeout(hide, 300); });
    // Salvaguarda: nunca dejar el loader bloqueando.
    setTimeout(hide, 4000);
  })();
</script>
<script src="assets/js/enhance.js?v=${VER}" defer></script>
</body>
</html>`;

/* ---- Build --------------------------------------------------------------- */
let built = 0;
for (const key of Object.keys(PAGES)) {
  const p = PAGES[key];
  const tpl = fs.readFileSync(`_extract/tpl_${key}.html`, 'utf8');
  let body = extractBody(tpl);
  const faqItems = collectFaq(body);
  body = replaceImports(body);
  body = renameRawTags(body);
  body = transformImages(body);
  body = fixLinks(body);
  body = applyEnhancements(body);
  const out = head(p, faqItems) + body + TAIL;
  fs.writeFileSync(p.file, out);
  built++;
  console.log(`✓ ${p.file}  (${Math.round(out.length / 1024)} KB${faqItems.length ? ', ' + faqItems.length + ' FAQ' : ''})`);
}
console.log(`\n${built} páginas generadas.`);
