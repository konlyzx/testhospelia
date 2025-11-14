## Estado actual
- Framework: Next.js (App Router) con TypeScript y `public/` (package.json).
- Metadatos globales definidos en `src/app/layout.tsx:24-52` y `<head>` personalizado.
- JSON‑LD ya presente para `Organization` y `WebSite` en `src/app/layout.tsx:100-140`.
- Sitemap dinámico servido por `src/app/sitemap.ts:7-16, 11-32, 33-65` y robots en `public/robots.txt:1-3, 15-19`.
- Cabeceras y CSP en `next.config.ts:32-63` y cache/seguridad en `middleware.ts:62-79`.

## Objetivos
- Fortalecer SEO on‑page en toda la web (títulos, descripciones, OG/Twitter, canonical/alternates).
- Completar y ampliar datos estructurados: Organization (contacto y dirección), Breadcrumbs, Listados y Propiedades, Blog.
- Implementar CNAME para dominio personalizado en despliegues estáticos.

## Cambios propuestos (técnicos)
- Organization (global):
  - Ampliar JSON‑LD existente en `src/app/layout.tsx:100-121` con `contactPoint` (teléfono/WhatsApp, tipo de contacto), `address` (LocalBusiness si aplica), `foundingDate`, `email` y `areaServed`. Mantener `strategy="beforeInteractive"`.
- WebSite (global):
  - Mantener `SearchAction` en `src/app/layout.tsx:122-140`. Añadir `inLanguage: "es-CO"` y `publisher` apuntando a `Organization`.
- Breadcrumbs (global):
  - Generar `BreadcrumbList` desde la ruta actual usando `usePathname()` y emitir `<Script type="application/ld+json">` en layout o por página. Inclusión por defecto en todas las páginas de contenido.
- Listado de alojamientos y propiedades:
  - En `src/app/alojamientos/page.tsx` y `src/app/propiedades/page.tsx`, publicar `ItemList` con `ListItem` (posición y URL). Si hay datos, incluir nombre, imagen y ciudad.
- Página de propiedad `src/app/propiedad/[slug]/page.tsx`:
  - Emitir JSON‑LD de `RealEstateListing` (o `Apartment`/`LodgingBusiness` si el tipo aplica) con `Offer` y `price`, `priceCurrency`, `availability`, `image[]`, `address` y `seller` (`Organization`). Datos disponibles via `WasiProperty` en `PropertyView` (`src/app/propiedad/[slug]/PropertyView.tsx:86-101, 103-118`).
- Blog y contenido editorial:
  - En `src/app/blog/[slug]/page.tsx`, añadir `BlogPosting` con `headline`, `image`, `datePublished`, `dateModified`, `author`/`publisher` y `mainEntityOfPage`.
  - En `src/app/blog/categoria/[categoria]/page.tsx` y archivos, usar `CollectionPage` + `ItemList`.
- Metadatos página a página:
  - Revisar y completar `export const metadata` en las rutas con `title`, `description`, `openGraph` (title/description/URL/imagen), `alternates.canonical` y `robots`. Usar `generateMetadata` donde se necesite dinamismo.
- Robots y sitemap:
  - Mantener `robots.txt` y confirmar que `sitemap.xml` sirve la ruta (ya en `src/app/sitemap.ts`). Añadir entradas adicionales a `sitemap.ts` para nuevas páginas clave.
- CNAME (deploy estático):
  - Crear archivo `public/CNAME` con `hospelia.co` para que se copie en `out/` durante `next export` (package.json `build:production`). Configurar DNS: `A` para apex y `CNAME` `www` a proveedor (Vercel: `cname.vercel-dns.com`).
- Mejora opcional:
  - Favicon y manifest: añadir `favicon.ico` y `src/app/manifest.ts` (`MetadataRoute.Manifest`) para PWA básica; mejora branding y snippets en SERP móviles.

## Validación
- Probar páginas con Rich Results Test y Schema.org Validator.
- Verificar `canonical`, `OG`, `Twitter` y cabeceras con `curl -I` y navegador.
- Comprobar `sitemap.xml` y `robots.txt` accesibles.

## Entregables
- Actualización de `src/app/layout.tsx` (Organization/WebSite + Breadcrumbs).
- JSON‑LD por rutas clave (`alojamientos`, `propiedades`, `propiedad/[slug]`, blog).
- Ajustes de metadatos por página.
- Archivo `public/CNAME` listo para despliegue.

¿Confirmas que avance con estos cambios y los aplique en el código?