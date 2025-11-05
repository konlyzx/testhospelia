# 🏠 Hospelia - Plataforma de Alojamientos con IA

> **Encuentra tu hogar perfecto con tecnología de vanguardia**

Plataforma web moderna para alojamientos en Cali que combina la mejor experiencia de usuario con tecnologías avanzadas como IA recomendadora, soporte multilenguaje y multidivisa.

## ✨ Características Principales

### 🌍 **Multilenguaje y Multidivisa**
- 🇪🇸 **Español** e 🇺🇸 **Inglés** con detección automática
- 💱 **COP, USD, EUR** con conversión en tiempo real
- 🔄 **Tasas de cambio actualizadas** automáticamente

### 🤖 **IA Recomendadora Tipo Netflix**
- 🧠 **Análisis inteligente** del comportamiento del usuario
- 🎯 **4 tipos de recomendaciones** personalizadas
- 📊 **Indicadores de confianza** (% match)
- 🎬 **Interfaz estilo Netflix** con animaciones fluidas

### 🏠 **Gestión de Propiedades Avanzada**
- 🔍 **Búsqueda inteligente** con filtros dinámicos
- 📱 **Vista optimizada** estilo Airbnb
- ❤️ **Sistema de favoritos** con tracking
- 🖼️ **Galerías interactivas** de imágenes

### 🚀 **Tecnología de Vanguardia**
- ⚡ **Next.js 15** con App Router
- 🎨 **Tailwind CSS** + **Framer Motion**
- 📊 **Google Analytics** y conversiones
- 🔧 **TypeScript** para mayor robustez

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **CMS**: WordPress (Headless)
- **CRM**: Wasi API
- **Analytics**: Google Ads, Google Analytics
- **Deployment**: Vercel Ready

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd wasi-hospelia

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```



## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js 15
│   ├── (pages)/        # Páginas principales
│   ├── api/            # API Routes
│   ├── blog/           # Sistema de blog
│   ├── propiedad/      # Páginas de propiedades
│   └── components/     # Componentes específicos de página
├── components/         # Componentes reutilizables
├── services/           # Servicios API (WordPress, Wasi)
├── utils/              # Utilidades y helpers
├── contexts/           # React Contexts
└── lib/                # Configuraciones y librerías
```

## 🔗 Integraciones

### WordPress (Headless CMS)
- Posts del blog con imágenes y autores
- Propiedades con ACF y galerías
- Taxonomías dinámicas
- SEO automático

### Wasi CRM
- Propiedades en tiempo real
- Gestión de clientes
- Formularios de contacto
- Seguimiento de leads

### Google Services
- Ads conversion tracking
- Analytics integration
- Search Console ready

## 🌐 Páginas Principales

- `/` - Homepage con búsqueda
- `/blog` - Blog con artículos
- `/propiedades` - Listado de propiedades
- `/propiedad/[slug]` - Detalle de propiedad
- `/alojamientos` - Catálogo de alojamientos
- `/hazte-anfitrion` - Formulario para anfitriones

## 📱 Funcionalidades

### Búsqueda de Propiedades
- Filtros por ubicación, precio, habitaciones
- Integración con taxonomías de WordPress
- Resultados dinámicos desde Wasi API

### Sistema de Blog
- Contenido dinámico desde WordPress
- Imágenes optimizadas automáticamente
- SEO meta tags dinámicos
- Paginación y búsqueda

### Formularios de Contacto
- Integración con Wasi CRM
- Validación de campos
- Envío por WhatsApp
- Tracking de conversiones

## 🔒 Seguridad

- Variables de entorno para datos sensibles
- Sanitización de contenido HTML
- Validación de formularios
- Headers de seguridad configurados

## 📈 SEO y Performance

- Meta tags dinámicos por página
- Open Graph para redes sociales
- Sitemap XML automático
- Optimización de imágenes con Next.js
- Lazy loading de componentes
- Caching estratégico

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Manual
```bash
npm run build
npm run start
```

## 📞 Soporte

Para soporte técnico o consultas sobre el desarrollo, contacta al equipo de desarrollo.

## Sistema de Caché del Blog

### Configuración Optimizada

El blog ahora se actualiza cada **2 días** en lugar de cada 30 segundos, mejorando significativamente el rendimiento:

- **Caché del Blog**: 2 días (172,800,000 ms)
- **Caché de Propiedades**: 30 minutos
- **Caché de Zonas**: 1 hora

### Funciones de Control

Las siguientes funciones están disponibles en el navegador (`window.blogCacheUtils`):

```javascript
// Limpiar caché del blog
window.blogCacheUtils.clearBlogCache()

// Forzar actualización del blog
window.blogCacheUtils.forceBlogRefresh()

// Obtener información del caché
window.blogCacheUtils.getBlogCacheInfo()

// Ver tiempo hasta próxima actualización
window.blogCacheUtils.getTimeUntilNextBlogRefresh()
```

### Modo Desarrollo

En desarrollo, aparece un indicador visual que muestra:
- Estado del caché
- Tiempo hasta la próxima actualización
- Información de debug en la consola

### Beneficios

1. **Mejor Rendimiento**: La web carga más rápido
2. **Menos Solicitudes**: Reduce la carga en el servidor
3. **Experiencia de Usuario**: Carga instantánea del blog
4. **Control Manual**: Posibilidad de forzar actualizaciones cuando sea necesario

---

**Hospelia** - Transformando el turismo en Colombia 🇨🇴
