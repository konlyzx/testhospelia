/**
 * Configuración para despliegue en Hostinger
 * 
 * Este archivo contiene la configuración necesaria para desplegar
 * la aplicación Next.js en Hostinger.
 */

module.exports = {
  // Configuración del servidor Node.js
  server: {
    port: process.env.PORT || 3000,
    // Hostinger utiliza Node.js, por lo que podemos usar el servidor de Next.js
    type: 'node',
  },
  
  // Rutas importantes para el despliegue
  paths: {
    // Directorio de build de Next.js
    build: './.next',
    // Archivos estáticos
    public: './public',
    // Archivos de configuración
    config: './',
  },
  
  // Configuración de headers para optimización
  headers: {
    // Habilitar compresión gzip
    'Content-Encoding': 'gzip',
    // Cache para archivos estáticos
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  
  // Variables de entorno recomendadas para producción
  env: {
    NODE_ENV: 'production',
  }
};