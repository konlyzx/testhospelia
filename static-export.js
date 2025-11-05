const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración temporal para exportación estática
const exportConfig = `/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}`;

// Guardar configuración original
const originalConfig = fs.readFileSync('./next.config.js', 'utf8');

// Aplicar configuración para exportación estática
console.log('Aplicando configuración para exportación estática...');
fs.writeFileSync('./next.config.js', exportConfig);

try {
  // Ejecutar build
  console.log('Ejecutando build para exportación estática...');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('Exportación estática completada con éxito!');
  console.log('Los archivos estáticos están disponibles en la carpeta "out"');
} catch (error) {
  console.error('Error durante la exportación estática:', error.message);
} finally {
  // Restaurar configuración original
  console.log('Restaurando configuración original...');
  fs.writeFileSync('./next.config.js', originalConfig);
}