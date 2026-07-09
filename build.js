/* ===========================================================================
   ENSAMBLA — build estático
   Convierte los templates del design-tool (en _extract/) a HTML estático,
   pre-renderizado, con SEO completo, imágenes WebP y Nav/Footer/loader propios.
   Uso:  node build.js
   Salida: index.html, precios.html, faq.html, privacidad.html, terminos.html
   =========================================================================== */
'use strict';
const fs = require('fs');

/* ---- Config editable ---------------------------------------------------- */
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
  <nav class="nav__links" aria-label="Principal">
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
  <link rel="stylesheet" href="assets/css/styles.css">

  ${jsonLd(p.active === 'home' ? 'index' : (p.file === 'faq.html' ? 'faq' : 'other'), faqItems)}
</head>
<body>
${LOADER}
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
  const out = head(p, faqItems) + body + TAIL;
  fs.writeFileSync(p.file, out);
  built++;
  console.log(`✓ ${p.file}  (${Math.round(out.length / 1024)} KB${faqItems.length ? ', ' + faqItems.length + ' FAQ' : ''})`);
}
console.log(`\n${built} páginas generadas.`);
