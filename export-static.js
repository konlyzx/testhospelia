const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Crear directorio para exportación estática
const staticDir = path.join(__dirname, 'static-export');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

console.log('Iniciando exportación estática manual...');

try {
  // Copiar archivos públicos
  console.log('Copiando archivos públicos...');
  const publicDir = path.join(__dirname, 'public');
  
  // Función para copiar directorios recursivamente
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  // Copiar carpeta public a static-export
  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, staticDir);
    console.log('Archivos públicos copiados a static-export');
  }
  
  // Crear archivos CSS y JS básicos
  const cssDir = path.join(staticDir, 'css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  const basicCss = `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #0070f3;
  color: white;
  padding: 1rem 0;
  text-align: center;
}

h1 {
  color: #0070f3;
  margin-top: 20px;
}

nav {
  margin: 20px 0;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

nav a {
  text-decoration: none;
  color: #0070f3;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #e6f0ff;
}

.content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px 0;
  color: #666;
  border-top: 1px solid #eaeaea;
}

.btn {
  display: inline-block;
  background-color: #0070f3;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #005cc5;
}`;
  
  fs.writeFileSync(path.join(cssDir, 'styles.css'), basicCss);
  
  const jsDir = path.join(staticDir, 'js');
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }
  
  const basicJs = `console.log('Hospelia - Versión estática');

document.addEventListener('DOMContentLoaded', function() {
  // Añadir año actual al footer
  const footerYear = document.getElementById('current-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});`;

  fs.writeFileSync(path.join(jsDir, 'main.js'), basicJs);
  
  // Crear estructura básica de HTML para páginas principales
  console.log('Creando páginas HTML básicas...');
  
  // Crear archivo index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hospelia - Alojamientos y Experiencias</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="icon" href="favicon.ico">
</head>
<body>
  <header>
    <div class="container">
      <h1>Hospelia</h1>
    </div>
  </header>
  
  <div class="container">
    <div class="content">
      <h2>Bienvenido a Hospelia</h2>
      <p>Tu plataforma de alojamientos y experiencias</p>
      
      <nav>
        <ul>
          <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
          <li><a href="ayuda.html">Ayuda</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="privacidad.html">Privacidad</a></li>
          <li><a href="terminos.html">Términos</a></li>
        </ul>
      </nav>
    </div>
  </div>
  
  <footer>
    <div class="container">
      <p>&copy; <span id="current-year">2023</span> Hospelia. Todos los derechos reservados.</p>
    </div>
  </footer>
  
  <script src="js/main.js"></script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(staticDir, 'index.html'), indexHtml);
  
  // Lista de páginas básicas a crear
  const basicPages = [
    { name: 'sobre-nosotros', title: 'Sobre Nosotros' },
    { name: 'ayuda', title: 'Ayuda' },
    { name: 'blog', title: 'Blog' },
    { name: 'privacidad', title: 'Política de Privacidad' },
    { name: 'terminos', title: 'Términos y Condiciones' }
  ];
  
  // Crear páginas básicas
  basicPages.forEach(page => {
    const pageHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} - Hospelia</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="icon" href="favicon.ico">
</head>
<body>
  <header>
    <div class="container">
      <h1>Hospelia</h1>
    </div>
  </header>
  
  <div class="container">
    <div class="content">
      <h2>${page.title}</h2>
      <p>Contenido de ${page.title}</p>
      
      <nav>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
          <li><a href="ayuda.html">Ayuda</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="privacidad.html">Privacidad</a></li>
          <li><a href="terminos.html">Términos</a></li>
        </ul>
      </nav>
    </div>
  </div>
  
  <footer>
    <div class="container">
      <p>&copy; <span id="current-year">2023</span> Hospelia. Todos los derechos reservados.</p>
    </div>
  </footer>
  
  <script src="js/main.js"></script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(staticDir, `${page.name}.html`), pageHtml);
  });
  
  console.log('Exportación estática manual completada con éxito!');
  console.log('Los archivos estáticos están disponibles en la carpeta "static-export"');
  
} catch (error) {
  console.error('Error durante el proceso:', error.message);
}