# Sitio web ENSAMBLA

Sitio estático (HTML + CSS, sin framework ni build en runtime). Listo para desplegar en Vercel.

## Estructura

```
index.html  precios.html  faq.html  privacidad.html  terminos.html
favicon.svg  site.webmanifest  robots.txt  sitemap.xml  vercel.json
assets/
  css/styles.css        fuentes, base, nav, footer, loader
  fonts/*.woff2          Outfit self-hosted (variable)
  img/*.webp             capturas optimizadas (WebP)
build.js                 genera los .html desde _extract/ (solo desarrollo)
_extract/                templates originales desempaquetados (no se despliega)
_original/               los 5 HTML originales del design-tool (respaldo)
```

## Qué se hizo

Los archivos originales eran un *bundle* de una herramienta de diseño: el HTML
real venía dentro de un JSON que React reconstruía en el navegador a partir de
1.6 MB en base64. Malo para SEO (título "Bundled Page", contenido invisible sin
JS) y lento. Se convirtieron a HTML estático pre-renderizado:

- **SEO completo**: `<title>`, meta description, canonical, Open Graph, Twitter
  Card y JSON-LD (Organization, SoftwareApplication, FAQPage) por página.
- **Imágenes**: PNG → WebP (1.1 MB → ~300 KB), con `alt`, `title`, `width`,
  `height`, `loading="lazy"` y `fetchpriority` en el hero.
- **Rendimiento**: sin React ni desempaquetado; fuentes self-hosted con
  preload; assets cacheados 1 año (`vercel.json`).
- **Loader** mostrativo que se desvanece al cargar.
- **Contacto**: WhatsApp +503 7469 1631 y correo carlose.guzmane62@gmail.com.

## Editar y regenerar

El contenido de cada página vive en `_extract/tpl_*.html`. Nav, footer, loader,
SEO y datos de contacto se definen en `build.js`. Tras editar:

```bash
node build.js
```

Cambia el dominio en `build.js` (`SITE_URL`), `robots.txt` y `sitemap.xml`
cuando tengas el definitivo.

## Previsualizar y desplegar

```bash
npx serve .      # previsualización local (resuelve /precios sin .html)
vercel           # desplegar
```

> El bloque "video" de la portada (*Anuncio ENSAMBLA*) se reconstruyó como un
> póster que abre la demo por WhatsApp, porque el video original no venía en el
> export. Reemplázalo en `build.js` (`ANUNCIO`) cuando tengas el clip real.
