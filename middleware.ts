import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const nonce = crypto.randomUUID();
  
  // Configurar headers de cache para activos estáticos
  const { pathname } = request.nextUrl;
  
  // Cache para imágenes y activos estáticos
  if (pathname.startsWith('/_next/static/') || 
      pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Cache para API routes de propiedades
  if (pathname.startsWith('/api/properties') || 
      pathname.startsWith('/api/wasi/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
  }
  
  // Redirects para SEO
  if (pathname === '/propiedades-wasi') {
    return NextResponse.redirect(new URL('/propiedades', request.url), 301);
  }
  
  // Redirección de URLs del CRM a URLs de la web
  // Formato CRM: /apartamento-alquiler-ciudad-jardin-cali/9093216
  // Formato Web: /propiedad/renta-apartamento-amoblado-ciudad-jardn-pance-servicios-incluidos-9093216
  const crmUrlMatch = pathname.match(/^\/([^\/]+)\/(\d+)$/);
  if (crmUrlMatch) {
    const [, description, propertyId] = crmUrlMatch;
    
    // Si no es una ruta conocida de la app, asumir que es del CRM
    const knownRoutes = [
      '/blog', '/alojamientos', '/api', '/propiedad', '/propiedades',
      '/hazte-anfitrion', '/sobre-nosotros', '/ayuda', '/favoritos',
      '/comunidad', '/empleo', '/recursos-anfitriones', '/centro-ayuda',
      '/compania', '/prensa', '/destinos', '/accesibilidad', '/terminos',
      '/privacidad', '/cookies'
    ];
    
    const isKnownRoute = knownRoutes.some(route => pathname.startsWith(route));
    
    if (!isKnownRoute && propertyId) {
      // Buscar la propiedad por ID y redirigir a la URL correcta
      // Por ahora, redireccionar a una URL genérica con el ID
      const newUrl = new URL(request.url);
      newUrl.pathname = `/propiedad/property-${propertyId}`;
      newUrl.searchParams.set('redirect_from_crm', 'true');
      
      return NextResponse.redirect(newUrl, 301);
    }
  }
  
  // Headers de seguridad optimizados
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.jsdelivr.net https://analytics.ahrefs.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://cdn.jsdelivr.net https://analytics.ahrefs.com; img-src 'self' data: https:; connect-src 'self' https:;`);
  
  // Preconnect headers para optimizar conexiones
  const linkHeader = [
    '<https://wp.hospelia.co>; rel=preconnect',
    '<https://image.wasi.co>; rel=preconnect',
    '<https://firebasestorage.googleapis.com>; rel=preconnect',
    '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
  ].join(', ');
  
  response.headers.set('Link', linkHeader);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 
