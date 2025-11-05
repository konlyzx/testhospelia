import { request } from '@/lib/graphql'; 
import { gql } from 'graphql-request';
import { transformDomainUrl, transformObjectUrls, transformHtmlUrls } from '@/utils/urlTransformer';


const WP_API_URL = 'https://wp.hospelia.co/wp-json/wp/v2';
const ELEMENTOR_API_URL = 'https://wp.hospelia.co/wp-json';



interface WPEmbedded {
  'wp:featuredmedia'?: Array<{ source_url: string }>;
  'wp:term'?: Array<Array<{
    id: number;
    name: string;
    slug: string;
    taxonomy: string;
  }>>;
  'wp:author'?: Array<{
    id: number;
    name: string;
    url?: string;
    description?: string;
    avatar_urls?: {
      [size: string]: string;
    };
  }>;
}

export const getMeta = (meta: any, key: string): string => {
  if (!meta || !meta[key]) return "";
  if (Array.isArray(meta[key])) {
    return meta[key][0] || "";
  }
  return meta[key] || "";
};

// Función para convertir precio a número
export const getMetaNumber = (meta: any, key: string): number => {
  const value = getMeta(meta, key);
  return Number(value) || 0;
};

// Función para formatear precio en pesos colombianos
export const formatPrice = (price: number): string => {
  return price.toLocaleString("es-CO", { 
    style: "currency", 
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Interfaz para propiedades de WordPress
export interface WordPressProperty {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: WPEmbedded;
  featured_media_url?: string;
  // Metadatos específicos de propiedades
  property_meta?: {
    fave_property_price?: string[];
    fave_property_price_prefix?: string[];
    fave_property_bedrooms?: string[];
    fave_property_rooms?: string[];
    fave_property_bathrooms?: string[];
    fave_property_garage?: string[];
    fave_property_size?: string[];
    fave_property_land?: string[];
    fave_property_year?: string[];
    fave_property_status?: string[];
    fave_property_type?: string[];
    fave_property_location?: string[];
    fave_property_address?: string[];
    fave_property_map?: string[];
    fave_property_map_address?: string[];
    fave_property_country?: string[];
    fave_property_state?: string[];
    fave_property_city?: string[];
    fave_property_area?: string[];
    fave_property_zip?: string[];
    [key: string]: any;
  };
  acf?: {
    location?: string;
    price?: number;
    rating?: number;
    reviews?: number;
    features?: string[];
    category?: string;
    bedrooms?: number;
    bathrooms?: number;
    guests?: number;
    gallery?: Array<{
      id: number;
      url: string;
      alt: string;
    }>;
    zone?: string;
  };
  slug: string;
  price?: number; // Para metadatos registrados directamente
  date: string; // Fecha de publicación para calcular si es nueva
  class_list?: string[]; // Lista de clases CSS de WordPress
  meta?: {
    _price?: string | number;
    _regular_price?: string | number;
    _sale_price?: string | number;
    [key: string]: any;
  };
  // Propiedades procesadas para fácil acceso
  processed?: {
    price: number;
    priceFormatted: string;
    pricePrefix: string;
    bedrooms: number;
    bathrooms: number;
    rooms: number;
    garage: number;
    size: string;
    year: string;
    status: string;
    type: string;
    location: string;
    address: string;
  };
}

// Interfaz para zonas (taxonomías) - Actualizada para GraphQL
export interface WordPressZone {
  id: string; // GraphQL IDs suelen ser strings
  databaseId: number; // El ID numérico original de WP
  count?: number | null; // Puede ser null si no hay posts asociados
  description?: string | null;
  link?: string | null;
  name: string;
  slug: string;
  taxonomyName?: string; // El nombre de la taxonomía (e.g., 'zonas')
  // ACF fields - La estructura exacta depende de cómo WPGraphQL for ACF los exponga
  acfFields?: {
    imagen?: {
      node?: {
        id: string;
        sourceUrl?: string; // URL de la imagen
        altText?: string;
      } | null;
    } | null;
    destacado?: boolean | null;
    order?: number | null; // Nombre del campo ACF para el orden
    description_short?: string | null; // Nombre del campo ACF para descripción corta
    // Asegúrate de que los nombres 'imagen', 'destacado', 'order', 'description_short'
    // coincidan exactamente con los nombres de tus campos ACF para la taxonomía 'zonas'.
  } | null;
}

// Interfaz para reseñas de WordPress
export interface WordPressReview {
  id: number;
  date: string;
  content: {
    rendered: string;
  };
  title: {
    rendered: string;
  };
  acf?: {
    rating?: number;
    nombre?: string;
    avatar_url?: string;
    property_id?: number;
  };
  author_name?: string;
  author_avatar_urls?: {
    [size: string]: string;
  };
}

// Interfaz para posts del blog de WordPress
export interface WordPressBlogPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  featured_media_url?: string;
  _embedded?: WPEmbedded;
  acf?: {
    [key: string]: any; // ACF fields específicos del blog
  };
  author_info?: {
    id: number;
    name: string;
    url: string;
    description: string;
    avatar_urls: {
      [size: string]: string;
    };
  };
}

// Interfaz para la respuesta paginada de posts
export interface BlogPostsResponse {
  posts: WordPressBlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interfaz para la respuesta del popup de Elementor
export interface ElementorPopupResponse {
  content: string;
  assets?: {
    css?: string[];
    js?: string[];
  };
}

// Caché global para almacenar datos y evitar peticiones innecesarias
interface CacheStorage {
  zones?: WordPressZone[];
  properties?: WordPressProperty[];
  blogPosts?: WordPressBlogPost[];
  lastFetched?: {
    zones?: number;
    properties?: number;
    blogPosts?: number;
    [key: string]: number | undefined;
  };
  [key: string]: any;
}

// Interfaces para términos de WordPress
interface WordPressTerm {
  id: number;
  count?: number;
  description?: string;
  link?: string;
  name: string;
  slug: string;
  taxonomy?: string;
  meta?: any[];
  acf?: {
    image?: {
      id: number;
      url: string;
      alt: string;
    };
    [key: string]: any;
  };
}

// Interfaz para la respuesta de la consulta GraphQL - ASEGURAR QUE ESTÉ DEFINIDA AQUÍ
interface GetAllZonesResponse {
  zonas?: { // El nombre raíz debe coincidir con el alias o nombre de la taxonomía en la query
    nodes: WordPressZone[];
  } | null;
}

// Constantes de configuración de caché
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutos para propiedades
const BLOG_CACHE_EXPIRY_TIME = 2 * 24 * 60 * 60 * 1000; // 2 días para el blog (172,800,000 ms)
const ZONES_CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hora para zonas

const globalCache: CacheStorage = {
  properties: [],
  zones: [],
  blogPosts: [],
  lastFetched: {}
};

// Función para limpiar caché del blog manualmente
export function clearBlogCache(): void {
  if (globalCache.blogPosts) {
    globalCache.blogPosts = undefined;
  }
  if (globalCache.lastFetched?.blogPosts) {
    globalCache.lastFetched.blogPosts = undefined;
  }
  console.log('✅ Caché del blog limpiado manualmente');
}

// Función para forzar actualización del blog
export function forceBlogRefresh(): void {
  clearBlogCache();
  console.log('🔄 Forzando actualización del blog en la próxima carga');
}

// Función para obtener información del estado del caché del blog
export function getBlogCacheInfo(): {
  hasCache: boolean;
  cacheAge: number;
  cacheExpired: boolean;
  timeUntilExpiry: number;
  lastFetched: Date | null;
} {
  const now = Date.now();
  const lastFetched = globalCache.lastFetched?.blogPosts;
  
  return {
    hasCache: !!globalCache.blogPosts && globalCache.blogPosts.length > 0,
    cacheAge: lastFetched ? now - lastFetched : 0,
    cacheExpired: !lastFetched || (now - lastFetched) >= BLOG_CACHE_EXPIRY_TIME,
    timeUntilExpiry: lastFetched ? BLOG_CACHE_EXPIRY_TIME - (now - lastFetched) : 0,
    lastFetched: lastFetched ? new Date(lastFetched) : null,
  };
}

// Función para obtener tiempo legible hasta la próxima actualización
export function getTimeUntilNextBlogRefresh(): string {
  const cacheInfo = getBlogCacheInfo();
  
  if (cacheInfo.cacheExpired) {
    return 'Actualización disponible';
  }
  
  const timeLeft = cacheInfo.timeUntilExpiry;
  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''} y ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''} y ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }
}

// URLs de imágenes por defecto para zonas
const DEFAULT_IMAGES: Record<string, string> = {
  norte: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-norte.jpg?alt=media',
  sur: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-sur.jpg?alt=media',
  oeste: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-oeste.jpg?alt=media',
  centro: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fzona-centro.jpg?alt=media',
  default: 'https://firebasestorage.googleapis.com/v0/b/hospelia-cms.appspot.com/o/images%2Fcity-default.jpg?alt=media'
};

// Constante para identificar la función de caché de zonas
const ZONE_FUNCTION = 'getAllZones';

// Cliente API para WordPress
const api = {
  async get(endpoint: string) {
    try {
      const url = `${WP_API_URL}${endpoint}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error en API GET ${endpoint}:`, error);
      return { data: null, error };
    }
  }
};

// Función para procesar metadatos de propiedades
const processPropertyMetadata = (property: WordPressProperty): WordPressProperty => {
  if (!property.property_meta && !property.meta) {
    return property;
  }

  // Usar property_meta si existe, sino usar meta
  const metaSource = property.property_meta || property.meta || {};

  const price = getMetaNumber(metaSource, "fave_property_price") || getMetaNumber(metaSource, "_price") || 0;
  
  const processed = {
    price,
    priceFormatted: price > 0 ? formatPrice(price) : "Consultar precio",
    pricePrefix: getMeta(metaSource, "fave_property_price_prefix") || "Por mes",
    bedrooms: getMetaNumber(metaSource, "fave_property_bedrooms") || 0,
    bathrooms: getMetaNumber(metaSource, "fave_property_bathrooms") || 0,
    rooms: getMetaNumber(metaSource, "fave_property_rooms") || 0,
    garage: getMetaNumber(metaSource, "fave_property_garage") || 0,
    size: getMeta(metaSource, "fave_property_size") || "",
    year: getMeta(metaSource, "fave_property_year") || "",
    status: getMeta(metaSource, "fave_property_status") || "",
    type: getMeta(metaSource, "fave_property_type") || "",
    location: getMeta(metaSource, "fave_property_location") || getMeta(metaSource, "fave_property_city") || "",
    address: getMeta(metaSource, "fave_property_address") || "",
  };

  // Actualizar ACF con datos procesados si no existen
  if (!property.acf) property.acf = {};
  if (!property.acf.price && processed.price > 0) property.acf.price = processed.price;
  if (!property.acf.bedrooms && processed.bedrooms > 0) property.acf.bedrooms = processed.bedrooms;
  if (!property.acf.bathrooms && processed.bathrooms > 0) property.acf.bathrooms = processed.bathrooms;
  if (!property.acf.location && processed.location) property.acf.location = processed.location;

  return {
    ...property,
    processed
  };
};

// Función optimizada para obtener imágenes de propiedades en lote
async function fetchPropertyImagesInBatch(propertyIds: number[]): Promise<Record<number, Array<{ id: number; url: string; alt: string }>>> {
  const galleryMap: Record<number, Array<{ id: number; url: string; alt: string }>> = {};
  
  if (propertyIds.length === 0) return galleryMap;

  try {
    
    // Estrategia 1: Obtener imágenes individualmente por propiedad (más confiable)
    const batchSize = 5; // Procesar en lotes para no sobrecargar el servidor
    for (let i = 0; i < propertyIds.length; i += batchSize) {
      const batch = propertyIds.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (propertyId) => {
        try {
          const mediaResponse = await fetch(
            `${WP_API_URL}/media?parent=${propertyId}&per_page=20&_fields=id,source_url,alt_text`
          );
          
          if (mediaResponse.ok) {
            const mediaItems = await mediaResponse.json();
            if (Array.isArray(mediaItems) && mediaItems.length > 0) {
              galleryMap[propertyId] = mediaItems.map(media => ({
                id: media.id,
                url: media.source_url,
                alt: media.alt_text || ''
              }));
            }
          } else {
            console.warn(`⚠️ Error obteniendo imágenes para propiedad ${propertyId}: ${mediaResponse.status}`);
          }
        } catch (e) {
          console.warn(`⚠️ Error procesando propiedad ${propertyId}:`, e);
        }
      }));
      
      // Pequeña pausa entre lotes para no sobrecargar el servidor
      if (i + batchSize < propertyIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Estrategia 2: Para propiedades sin imágenes, intentar obtener desde ACF
    const propertiesWithoutImages = propertyIds.filter(id => !galleryMap[id] || galleryMap[id].length === 0);
    
    if (propertiesWithoutImages.length > 0) {
      
      // Hacer llamadas en paralelo pero limitadas para no sobrecargar el servidor
      const acfBatchSize = 10;
      for (let i = 0; i < propertiesWithoutImages.length; i += acfBatchSize) {
        const batch = propertiesWithoutImages.slice(i, i + acfBatchSize);
        
        await Promise.all(batch.map(async (propertyId) => {
          try {
            // Intentar obtener ACF que puede contener fave_property_images
            const acfResponse = await fetch(`${WP_API_URL}/properties/${propertyId}?_fields=id,acf&acf_format=standard`);
            if (acfResponse.ok) {
              const acfData = await acfResponse.json();
              
              // Usar la nueva función para procesar imágenes ACF
              const acfImages = await processACFImages(acfData.acf);
              
              if (acfImages.length > 0) {
                galleryMap[propertyId] = acfImages;
              }
            }
          } catch (e) {
            console.warn(`Error obteniendo ACF para propiedad ${propertyId}:`, e);
          }
        }));
        
        // Pequeña pausa entre lotes para no sobrecargar el servidor
        if (i + acfBatchSize < propertiesWithoutImages.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    const totalProperties = Object.keys(galleryMap).length;
    const totalImages = Object.values(galleryMap).reduce((sum, images) => sum + images.length, 0);

  } catch (error) {
    console.error('❌ Error en fetchPropertyImagesInBatch:', error);
  }

  return galleryMap;
}

// Obtener todas las propiedades (versión optimizada)
export async function getAllProperties(): Promise<WordPressProperty[]> {
  const now = Date.now();
  if (globalCache.properties && globalCache.lastFetched?.properties && (now - globalCache.lastFetched.properties) < CACHE_EXPIRY_TIME) {
    return globalCache.properties;
  }
  
  try {
    const responses = [];
    
    // Intentar diferentes endpoints
    let response = await fetch(`${WP_API_URL}/properties?per_page=100&_embed&acf_format=standard&_fields=id,title,excerpt,content,featured_media,slug,date,_embedded,acf,meta,property_meta,class_list`);
    responses.push({ endpoint: 'properties', status: response.status, ok: response.ok });
    let data: WordPressProperty[] = [];
    
    if (response.ok) {
      data = await response.json();
    } else {
      response = await fetch(`${WP_API_URL}/property?per_page=100&_embed&acf_format=standard&_fields=id,title,excerpt,content,featured_media,slug,date,_embedded,acf,meta,property_meta,class_list`);
      responses.push({ endpoint: 'property', status: response.status, ok: response.ok });
      if (response.ok) {
        data = await response.json();
      } else {
        response = await fetch(`${WP_API_URL}/posts?per_page=100&_embed&acf_format=standard&_fields=id,title,excerpt,content,featured_media,slug,date,_embedded,acf,meta,property_meta,class_list`);
        responses.push({ endpoint: 'posts', status: response.status, ok: response.ok });
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error(`❌ Todos los endpoints fallaron: ${JSON.stringify(responses)}`);
        }
      }
    }
    
    if (!Array.isArray(data)) {
      console.error('❌ La API no devolvió un array:', data);
      return [];
    }

    
    // Obtener IDs de propiedades válidas
    const propertyIds = data.map(p => p.id).filter(id => id != null);
    
    // Obtener todas las imágenes en lote (optimizado)
    const galleryMap = await fetchPropertyImagesInBatch(propertyIds);
    
    // Procesar propiedades
    const enrichedProperties = data.map((property) => {
      // Inicializar ACF si no existe
      if (!property.acf) property.acf = {};
      if (!property.acf.gallery) property.acf.gallery = [];

      // Asignar galería obtenida en lote
      if (galleryMap[property.id] && galleryMap[property.id].length > 0) {
        const rawGallery = galleryMap[property.id];
        const seenUrls = new Set<string>();
        property.acf.gallery = rawGallery.filter(img => {
          if (!img.url) return false;
          if (seenUrls.has(img.url)) return false;
          seenUrls.add(img.url);
          return true;
        });
      }
      
      // Procesar featured media desde _embedded
      const media = property._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        property.featured_media_url = media.source_url;
      }

      // Extraer zona de términos embebidos
      if (property._embedded?.['wp:term']) {
        const allTerms = property._embedded['wp:term'].flat();
        const zoneTerm = allTerms.find(term => 
          term.taxonomy === 'property_zone' || 
          term.taxonomy === 'zone' || 
          term.taxonomy === 'location' || 
          term.taxonomy === 'property_location' ||
          term.taxonomy === 'property_status'
        );
        if (zoneTerm) {
          if (!property.acf) property.acf = {};
          property.acf.zone = zoneTerm.name;
          property.acf.location = property.acf.location || zoneTerm.name;
        }
      }

      // Procesar metadatos
      return processPropertyMetadata(property);
    });
    
    // Actualizar caché
    globalCache.properties = enrichedProperties;
    globalCache.lastFetched = { ...globalCache.lastFetched, properties: now };
    
    return enrichedProperties;

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    // Devolver caché si existe, aunque esté expirado
    if (globalCache.properties && globalCache.properties.length > 0) {
      return globalCache.properties;
    }
    return [];
  }
}

// Obtener una propiedad por su slug
export async function getPropertyBySlug(slug: string): Promise<WordPressProperty | null> {
  try {
    const responses = [];
    let response = await fetch(`${WP_API_URL}/properties?slug=${slug}&_embed=wp:featuredmedia,wp:term&acf_format=standard`);
    responses.push({ endpoint: 'properties', status: response.status, ok: response.ok });
    let data: WordPressProperty[] = [];

    if (response.ok) {
      data = await response.json();
    } else {
      response = await fetch(`${WP_API_URL}/property?slug=${slug}&_embed=wp:featuredmedia,wp:term&acf_format=standard`);
      responses.push({ endpoint: 'property', status: response.status, ok: response.ok });
      if (response.ok) {
        data = await response.json();
      } else {
        response = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed=wp:featuredmedia,wp:term&acf_format=standard`);
        responses.push({ endpoint: 'posts', status: response.status, ok: response.ok });
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error(`Todos los endpoints fallaron para slug ${slug}: ${JSON.stringify(responses)}`);
        }
      }
    }

    if (!Array.isArray(data) || data.length === 0) return null;
    const property = data[0];
    if (!property) return null;

    // Inicializar acf si no existe
    if (!property.acf) property.acf = {};
    if (!property.acf.gallery) property.acf.gallery = [];

    // Obtener galería completa para esta propiedad
    if (property.id) {
      try {
        const mediaResponse = await fetch(`${WP_API_URL}/media?media_type=image&parent=${property.id}&per_page=100&_fields=id,source_url,alt_text`);
        if (mediaResponse.ok) {
          const mediaItems = await mediaResponse.json();
          if (Array.isArray(mediaItems) && mediaItems.length > 0) {
            const seenUrls = new Set<string>();
            property.acf.gallery = mediaItems
              .map(media => ({
                id: media.id,
                url: media.source_url,
                alt: media.alt_text || ''
              }))
              .filter(img => {
                if (!img.url) return false;
                if (seenUrls.has(img.url)) return false;
                seenUrls.add(img.url);
                return true;
              });
          }
        }
      } catch (galleryError) {
        console.error(`Error obteniendo galería para propiedad ${property.id} (slug: ${slug}):`, galleryError);
      }
    }

    // ... (lógica existente para featured_media_url, metadatos/precio, ACF individual, zona se mantiene) ...
    // Asegurarse que la lógica de featured_media_url no sobrescriba una galería si ya existe.
    const media = property._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      property.featured_media_url = media.source_url;
    }

    // ... (resto de la lógica de getPropertyBySlug: meta, acf, zone) ...
    // (El código para meta, acf y zone debe estar después de la carga de la galería)
    // para que no se sobrescriba el acf.gallery accidentalmente por un fetch de ACF individual
    // que no incluya la galería.
    // Los datos ACF ya deberían venir en la respuesta principal con &acf_format=standard
    // Solo hacer una llamada adicional si realmente no hay datos ACF
    if (!property.acf || Object.keys(property.acf).length === 0) {
      try {
        if (property.id) {
          const acfEndpoints = [
            `${WP_API_URL}/properties/${property.id}?acf_format=standard`,
            `${WP_API_URL}/property/${property.id}?acf_format=standard`,
            `${WP_API_URL}/posts/${property.id}?acf_format=standard`
          ];
          let acfData = null;
          for (const endpoint of acfEndpoints) {
            try {
              const acfResponse = await fetch(endpoint);
              if (acfResponse.ok) { acfData = await acfResponse.json(); break; }
            } catch (e) { /* ignore */ }
          }
          if (acfData && acfData.acf) {
            // Merge con cuidado para no sobrescribir gallery si ya la tenemos
            const currentGallery = property.acf?.gallery;
            property.acf = { ...acfData.acf, ...property.acf }; // prioriza lo que ya estaba en property.acf (como gallery)
            if (currentGallery && currentGallery.length > 0 && (!property.acf?.gallery || property.acf.gallery.length === 0)) {
               if (property.acf) property.acf.gallery = currentGallery; // Restaurar si el merge la borró
            }
          }
        }
      } catch (acfError) { console.error(`Error al obtener datos ACF para propiedad con slug ${slug}:`, acfError); }
    }

    if (property._embedded?.['wp:term']) {
      const allTerms = property._embedded['wp:term'].flat();
      const zoneTerm = allTerms.find(term => 
        term.taxonomy === 'property_zone' || term.taxonomy === 'zone' || term.taxonomy === 'location' || term.taxonomy === 'property_location'
      );
      if (zoneTerm) {
        if (!property.acf) property.acf = {};
        property.acf.zone = zoneTerm.name;
        property.acf.location = property.acf.location || zoneTerm.name;
      }
    }
    
    return processPropertyMetadata(property);
  } catch (error) {
    console.error(`Error fetching property with slug ${slug}:`, error);
    return null;
  }
}

// Obtener una propiedad por su ID
export async function getPropertyById(id: number): Promise<WordPressProperty | null> {
  try {
    const responses = [];
    let response = await fetch(`${WP_API_URL}/properties/${id}?_embed=wp:featuredmedia,wp:term&acf_format=standard`);
    responses.push({ endpoint: 'properties', status: response.status, ok: response.ok });
    let property: WordPressProperty | null = null;

    if (response.ok) {
      property = await response.json();
    } else {
      response = await fetch(`${WP_API_URL}/property/${id}?_embed=wp:featuredmedia,wp:term&acf_format=standard`);
      responses.push({ endpoint: 'property', status: response.status, ok: response.ok });
      if (response.ok) {
        property = await response.json();
      } else {
        response = await fetch(`${WP_API_URL}/posts/${id}?_embed=wp:featuredmedia,wp:term&acf_format=standard`);
        responses.push({ endpoint: 'posts', status: response.status, ok: response.ok });
        if (response.ok) {
          property = await response.json();
        } else {
          throw new Error(`Todos los endpoints fallaron para ID ${id}: ${JSON.stringify(responses)}`);
        }
      }
    }

    if (!property) throw new Error(`No se pudo obtener la propiedad con ID ${id}`);

    // Inicializar acf si no existe
    if (!property.acf) property.acf = {};
    if (!property.acf.gallery) property.acf.gallery = [];

    // Obtener galería completa para esta propiedad
    if (property.id) { // Asegurarse que property.id existe
      try {
        const mediaResponse = await fetch(`${WP_API_URL}/media?media_type=image&parent=${property.id}&per_page=100&_fields=id,source_url,alt_text`);
        if (mediaResponse.ok) {
          const mediaItems = await mediaResponse.json();
          if (Array.isArray(mediaItems) && mediaItems.length > 0) {
            const seenUrls = new Set<string>();
            property.acf.gallery = mediaItems
              .map(media => ({
                id: media.id,
                url: media.source_url,
                alt: media.alt_text || ''
              }))
              .filter(img => {
                if (!img.url) return false;
                if (seenUrls.has(img.url)) return false;
                seenUrls.add(img.url);
                return true;
              });
          }
        }
      } catch (galleryError) {
        console.error(`Error obteniendo galería para propiedad ${property.id}:`, galleryError);
      }
    }
    
    // ... (lógica existente para featured_media_url, metadatos/precio, ACF individual, zona se mantiene) ...
    // Asegurarse que la lógica de featured_media_url no sobrescriba una galería si ya existe.
    const media = property._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      property.featured_media_url = media.source_url;
    }

    // Los datos ACF ya deberían venir en la respuesta principal con &acf_format=standard
    // Solo hacer una llamada adicional si realmente no hay datos ACF
    if (!property.acf || Object.keys(property.acf).length === 0) {
      try {
        const acfEndpoints = [
          `${WP_API_URL}/properties/${id}?acf_format=standard`,
          `${WP_API_URL}/property/${id}?acf_format=standard`,
          `${WP_API_URL}/posts/${id}?acf_format=standard`
        ];
        let acfData = null;
        for (const endpoint of acfEndpoints) {
          try {
            const acfResponse = await fetch(endpoint);
            if (acfResponse.ok) { acfData = await acfResponse.json(); break; }
          } catch (e) { /* ignore */ }
        }
        if (acfData && acfData.acf) {
          const currentGallery = property.acf?.gallery;
          property.acf = { ...acfData.acf, ...property.acf };
          if (currentGallery && currentGallery.length > 0 && (!property.acf?.gallery || property.acf.gallery.length === 0)) {
             if (property.acf) property.acf.gallery = currentGallery;
          }
        }
      } catch (acfError) { console.error(`Error al obtener datos ACF para propiedad ${id}:`, acfError); }
    }

    if (property._embedded?.['wp:term']) {
      const allTerms = property._embedded['wp:term'].flat();
      const zoneTerm = allTerms.find(term => 
        term.taxonomy === 'property_zone' || term.taxonomy === 'zone' || term.taxonomy === 'location' || term.taxonomy === 'property_location'
      );
      if (zoneTerm) {
        if (!property.acf) property.acf = {};
        property.acf.zone = zoneTerm.name;
        property.acf.location = property.acf.location || zoneTerm.name;
      }
    }

    return processPropertyMetadata(property);
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    return null;
  }
}

// Obtener todos los detalles ACF de una propiedad
export async function getPropertyACF(id: number): Promise<any | null> {
  try {
    // Usar el parámetro correcto para obtener ACF
    let response = await fetch(`${WP_API_URL}/properties/${id}?acf_format=standard`);
    
    // Si no funciona, probamos con "property"
    if (!response.ok) {
      response = await fetch(`${WP_API_URL}/property/${id}?acf_format=standard`);
    }
    
    // Si tampoco funciona, probamos con posts normales
    if (!response.ok) {
      response = await fetch(`${WP_API_URL}/posts/${id}?acf_format=standard`);
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.acf || null;
  } catch (error) {
    console.error(`Error fetching ACF data for property ${id}:`, error);
    return null;
  }
}

// Obtener todas las taxonomías disponibles
export async function getAllTaxonomies() {
  try {
    const response = await fetch(`${WP_API_URL}/taxonomies`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching taxonomies:', error);
    return {};
  }
}

// Definimos la consulta GraphQL para Zonas
// Ajusta 'zonas' si tu taxonomía tiene un nombre diferente en WPGraphQL
// Ajusta los nombres de los campos ACF (imagen, destacado, order, etc.) si son distintos
const GET_ALL_ZONES_QUERY = gql`
  query GetAllZones {
    zonas(first: 100) { # Pide hasta 100 zonas. Ajusta 'zonas' si tu taxonomía se llama diferente
      nodes {
        id # ID global de GraphQL
        databaseId # ID numérico de WordPress
        name
        slug
        count
        description
        link
        taxonomyName
        # Campos ACF - Asegúrate que 'acfFields' sea el nombre correcto y los subcampos también
        acfFields { # Este nombre puede variar (p.ej., 'zoneFields', 'zonaACF'), revisa tu schema GraphQL
          destacado
          order
          description_short
          imagen {
            node {
              id
              sourceUrl(size: LARGE) # Pide un tamaño específico si quieres
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getAllZones(): Promise<WordPressZone[]> {

  try {
    const response = await request<GetAllZonesResponse>(GET_ALL_ZONES_QUERY);

    const zones = response?.zonas?.nodes || [];

    return zones;

  } catch (error) {
    console.error('Error al obtener zonas via GraphQL:', error);
    return [];
  }
}

export async function getAllCategories() {
  try {

    let response = await fetch(`${WP_API_URL}/property_type`);
    
    if (!response.ok) {
      response = await fetch(`${WP_API_URL}/property_category`);
    }
    
    if (!response.ok) {
      response = await fetch(`${WP_API_URL}/categories`);
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getReviewsByPropertyId(propertyId: number): Promise<WordPressReview[]> {
  try {
    const commentsResponse = await fetch(`${WP_API_URL}/comments?post=${propertyId}&per_page=20`);
    if (!commentsResponse.ok) {
      throw new Error(`Error HTTP: ${commentsResponse.status}`);
    }
    
    const comments = await commentsResponse.json();
    
    if (!Array.isArray(comments)) {
      console.error('La API no devolvió un array de comentarios:', comments);
      return [];
    }
    
    
    return comments.map(comment => ({
      id: comment.id,
      date: comment.date,
      content: {
        rendered: comment.content.rendered
      },
      title: {
        rendered: comment.author_name || 'Anónimo'
      },
      author_name: comment.author_name,
      author_avatar_urls: comment.author_avatar_urls,
      acf: {
        nombre: comment.author_name,
        rating: comment.rating || 5, 
        avatar_url: comment.author_avatar_urls?.['96'] || '/default-avatar.png',
        property_id: propertyId
      }
    }));
    
  } catch (error) {
    console.error(`Error fetching reviews for property ${propertyId}:`, error);
    return [];
  }
}

// ========================================
// FUNCIONES PARA POSTS DEL BLOG
// ========================================

// Obtener todos los posts del blog con paginación
export async function getAllBlogPosts(page: number = 1, perPage: number = 10, forceRefresh: boolean = false): Promise<BlogPostsResponse> {
  const cacheKey = `blog_posts_${page}_${perPage}`;
  const now = Date.now();
  
  // Verificar caché específico para esta página (usar tiempo más corto para el blog)
  if (!forceRefresh && globalCache[cacheKey] && globalCache.lastFetched?.[cacheKey] && 
      (now - globalCache.lastFetched[cacheKey]) < BLOG_CACHE_EXPIRY_TIME) {
    return globalCache[cacheKey];
  }

  try {
    
    // Obtener posts con contenido completo para extraer imágenes
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=${perPage}&page=${page}&_embed&_fields=id,date,slug,title,excerpt,content,author,featured_media,categories,tags,_embedded&orderby=date&order=desc`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const posts: WordPressBlogPost[] = await response.json();
    
    // Obtener headers de paginación
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');


    // Función para extraer la primera imagen del contenido HTML
    const extractFirstImageFromContent = (htmlContent: string): string | null => {
      if (!htmlContent) return null;
      
      // Buscar imágenes en el contenido HTML
      const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
      const matches = imageRegex.exec(htmlContent);
      
      if (matches && matches[1]) {
        const imageUrl = matches[1];
        // Filtrar imágenes que no sean logos o iconos
        if (!imageUrl.includes('logo') && 
            !imageUrl.includes('icon') && 
            !imageUrl.includes('favicon') &&
            (imageUrl.includes('hospelia.co') || imageUrl.includes('wp.hospelia.co'))) {
          return imageUrl;
        }
      }
      
      // Si no encuentra una imagen válida, buscar todas las imágenes
      const allMatches = htmlContent.match(/<img[^>]+src="([^"]+)"/gi);
      if (allMatches && allMatches.length > 0) {
        for (const match of allMatches) {
          const srcMatch = match.match(/src="([^"]+)"/);
          if (srcMatch && srcMatch[1] && (srcMatch[1].includes('hospelia.co') || srcMatch[1].includes('wp.hospelia.co'))) {
            const url = srcMatch[1];
            if (!url.includes('logo') && !url.includes('icon')) {
              return url;
            }
          }
        }
      }
      
      return null;
    };

    // Función para limpiar y mejorar el extracto
    const cleanAndImproveExcerpt = (excerpt: string, content: string): string => {
      if (!excerpt && !content) return '';
      
      let cleanExcerpt = excerpt || '';
      
      // Si el extracto está vacío o es muy corto, extraer del contenido
      if (!cleanExcerpt || cleanExcerpt.length < 50) {
        // Extraer texto del contenido HTML
        const textContent = content.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Tomar los primeros 200 caracteres como extracto
        cleanExcerpt = textContent.substring(0, 200) + '...';
      }
      
      // Limpiar el extracto
      return cleanExcerpt
        .replace(/<[^>]*>/g, '') // Remover HTML
        .replace(/&hellip;/g, '...') // Reemplazar entidades
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/ㅤ-ㅤ/g, '') // Remover caracteres extraños
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();
    };

    // Procesar cada post para agregar datos adicionales
    const processedPosts = await Promise.all(posts.map(async (post) => {
      // 1. Manejar imagen destacada
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        post.featured_media_url = transformDomainUrl(media.source_url);
      } else if (post.featured_media && post.featured_media > 0) {
        // Intentar obtener la imagen directamente si no está embebida
        try {
          const mediaResponse = await fetch(`${WP_API_URL}/media/${post.featured_media}`);
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            post.featured_media_url = transformDomainUrl(mediaData.source_url);
          }
        } catch (e) {
          console.warn(`⚠️ Error obteniendo media ${post.featured_media}:`, e);
        }
      }
      
      // 2. Si no hay imagen destacada, extraer del contenido
      if (!post.featured_media_url && post.content?.rendered) {
        const extractedImage = extractFirstImageFromContent(post.content.rendered);
        if (extractedImage) {
          post.featured_media_url = transformDomainUrl(extractedImage);
        }
      }

      // 3. Manejar información del autor
      let author = post._embedded?.['wp:author']?.[0] || (post._embedded as any)?.author?.[0];
      if (!author && post.author && post.author > 0) {
        // Intentar obtener el autor directamente si no está embebido
        try {
          const authorResponse = await fetch(`${WP_API_URL}/users/${post.author}`);
          if (authorResponse.ok) {
            author = await authorResponse.json();
          }
        } catch (e) {
          console.warn(`⚠️ Error obteniendo autor ${post.author}:`, e);
        }
      }
      
      if (author) {
        post.author_info = {
          id: author.id,
          name: author.name,
          url: author.url || '',
          description: author.description || '',
          avatar_urls: author.avatar_urls || {}
        };
      }

      // 4. Limpiar y mejorar el extracto
      if (post.excerpt?.rendered || post.content?.rendered) {
        const originalExcerpt = post.excerpt?.rendered || '';
        const improvedExcerpt = cleanAndImproveExcerpt(originalExcerpt, post.content?.rendered || '');
        
        if (!post.excerpt) post.excerpt = { rendered: '', protected: false };
        post.excerpt.rendered = improvedExcerpt;
      }

      return post;
    }));

    const result = {
      posts: processedPosts.map(transformBlogPostUrls),
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    // Actualizar caché específico para esta página
    globalCache[cacheKey] = result;
    if (!globalCache.lastFetched) globalCache.lastFetched = {};
    globalCache.lastFetched[cacheKey] = now;

    // Estadísticas de procesamiento
    const postsWithImages = processedPosts.filter(p => p.featured_media_url).length;
    const postsWithAuthors = processedPosts.filter(p => p.author_info).length;
    
    
    return result;

  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
}

// Obtener un post específico por slug
export async function getBlogPostBySlug(slug: string, forceRefresh: boolean = false): Promise<WordPressBlogPost | null> {
  const cacheKey = `blog_post_${slug}`;
  const now = Date.now();
  
  // Verificar caché (usar tiempo más corto para el blog)
  if (!forceRefresh && globalCache[cacheKey] && globalCache.lastFetched?.[cacheKey] && 
      (now - globalCache.lastFetched[cacheKey]) < BLOG_CACHE_EXPIRY_TIME) {
    return globalCache[cacheKey];
  }

  try {
    
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${slug}&_embed&acf_format=standard`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const posts: WordPressBlogPost[] = await response.json();
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return null;
    }

    const post = posts[0];

    // Función para extraer imágenes del contenido
    const extractImagesFromContent = (htmlContent: string): string[] => {
      if (!htmlContent) return [];
      
      const images: string[] = [];
      const imageRegex = /<img[^>]+src="([^"]+)"/gi;
      let match;
      
      while ((match = imageRegex.exec(htmlContent)) !== null) {
        const imageUrl = match[1];
        if ((imageUrl.includes('hospelia.co') || imageUrl.includes('wp.hospelia.co')) && 
            !imageUrl.includes('logo') && 
            !imageUrl.includes('icon') &&
            !imageUrl.includes('favicon')) {
          images.push(imageUrl);
        }
      }
      
      return images;
    };

    // Función para limpiar contenido HTML para mejor visualización
    const cleanContentForDisplay = (htmlContent: string): string => {
      if (!htmlContent) return '';
      
      return htmlContent
        // Remover estilos CSS inline
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        // Remover scripts
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        // Remover comentarios HTML
        .replace(/<!--[\s\S]*?-->/g, '')
        // Limpiar atributos de estilo innecesarios
        .replace(/style="[^"]*"/gi, '')
        .replace(/class="[^"]*"/gi, '')
        // Normalizar espacios
        .replace(/\s+/g, ' ')
        .trim();
    };

    // 1. Manejar imagen destacada
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      post.featured_media_url = transformDomainUrl(media.source_url);
    } else {
      // Extraer primera imagen del contenido
      const contentImages = extractImagesFromContent(post.content?.rendered || '');
      if (contentImages.length > 0) {
        post.featured_media_url = transformDomainUrl(contentImages[0]);
      }
    }

    // 2. Manejar información del autor
    const author = post._embedded?.['wp:author']?.[0];
    if (author) {
      post.author_info = {
        id: author.id,
        name: author.name,
        url: author.url || '',
        description: author.description || '',
        avatar_urls: author.avatar_urls || {}
      };
    }

    // 3. Limpiar contenido para mejor visualización
    if (post.content?.rendered) {
      post.content.rendered = cleanContentForDisplay(post.content.rendered);
    }

    // 4. Mejorar extracto si es necesario
    if (post.excerpt?.rendered) {
      post.excerpt.rendered = post.excerpt.rendered
        .replace(/<[^>]*>/g, '')
        .replace(/&hellip;/g, '...')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/ㅤ-ㅤ/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Actualizar caché
    globalCache[cacheKey] = post;
    if (!globalCache.lastFetched) globalCache.lastFetched = {};
    globalCache.lastFetched[cacheKey] = now;

    return transformBlogPostUrls(post);

  } catch (error) {
    console.error(`❌ Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Obtener un post específico por ID
export async function getBlogPostById(id: number): Promise<WordPressBlogPost | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts/${id}?_embed&acf_format=standard`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const post: WordPressBlogPost = await response.json();

    // Agregar imagen destacada
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    if (media?.source_url) {
      post.featured_media_url = transformDomainUrl(media.source_url);
    }

    // Agregar información del autor
    const author = post._embedded?.['wp:author']?.[0];
    if (author) {
      post.author_info = {
        id: author.id,
        name: author.name,
        url: author.url || '',
        description: author.description || '',
        avatar_urls: author.avatar_urls || {}
      };
    }

    return transformBlogPostUrls(post);

  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
}

// Obtener posts recientes (con caché)
export async function getRecentBlogPosts(limit: number = 5, forceRefresh: boolean = false): Promise<WordPressBlogPost[]> {
  const now = Date.now();
  
  // Verificar caché (usar tiempo más corto para el blog)
  if (!forceRefresh && globalCache.blogPosts && globalCache.lastFetched?.blogPosts && 
      (now - globalCache.lastFetched.blogPosts) < BLOG_CACHE_EXPIRY_TIME) {
    return globalCache.blogPosts.slice(0, limit).map(transformBlogPostUrls);
  }

  try {
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=${limit}&_embed&acf_format=standard&orderby=date&order=desc`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const posts: WordPressBlogPost[] = await response.json();

    // Procesar posts
    const processedPosts = posts.map(post => {
      // Agregar imagen destacada
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        post.featured_media_url = media.source_url;
      }

      // Agregar información del autor
      const author = post._embedded?.['wp:author']?.[0];
      if (author) {
        post.author_info = {
          id: author.id,
          name: author.name,
          url: author.url || '',
          description: author.description || '',
          avatar_urls: author.avatar_urls || {}
        };
      }

      return post;
    });

    // Actualizar caché
    const transformedPosts = processedPosts.map(transformBlogPostUrls);
    globalCache.blogPosts = transformedPosts;
    globalCache.lastFetched = { ...globalCache.lastFetched, blogPosts: now };

    return transformedPosts;

  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    // Devolver caché si existe, aunque esté expirado
    if (globalCache.blogPosts && globalCache.blogPosts.length > 0) {
      return globalCache.blogPosts.slice(0, limit).map(transformBlogPostUrls);
    }
    return [];
  }
}

// Buscar posts por término
export async function searchBlogPosts(searchTerm: string, page: number = 1, perPage: number = 10): Promise<BlogPostsResponse> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?search=${encodeURIComponent(searchTerm)}&per_page=${perPage}&page=${page}&_embed&acf_format=standard&orderby=relevance`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const posts: WordPressBlogPost[] = await response.json();
    
    // Obtener headers de paginación
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');

    // Procesar posts
    const processedPosts = posts.map(post => {
      // Agregar imagen destacada
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        post.featured_media_url = media.source_url;
      }

      // Agregar información del autor
      const author = post._embedded?.['wp:author']?.[0];
      if (author) {
        post.author_info = {
          id: author.id,
          name: author.name,
          url: author.url || '',
          description: author.description || '',
          avatar_urls: author.avatar_urls || {}
        };
      }

      return post;
    });


    return {
      posts: processedPosts.map(transformBlogPostUrls),
      totalPosts,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

  } catch (error) {
    console.error(`Error searching blog posts for "${searchTerm}":`, error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
}

/**
 * @param {number} popupId 
 * @returns {Promise<ElementorPopupResponse>} 
 */
export const getElementorPopup = async (popupId?: number): Promise<ElementorPopupResponse | null> => {
  try {

    const defaultPopupId = 22494;

    const idToUse = popupId || defaultPopupId;

    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
    
    let endpoint;
    
    if (isLocalhost) {

      endpoint = `/api/popup/${idToUse}`;
    } else {

      endpoint = `${ELEMENTOR_API_URL}/hospelia/v1/popup/${idToUse}`;
    }
    
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();

    return {
      content: data.content || data.html || '',
      assets: data.assets || { 
        css: data.css_urls || [], 
        js: data.js_urls || [] 
      }
    };
    
  } catch (error) {
    console.error('Error al obtener el popup de WordPress:', error);
    return null;
  }
};

// Función para procesar imágenes de ACF (fave_property_images)
async function processACFImages(acfData: any): Promise<Array<{ id: number; url: string; alt: string }>> {
  const images: Array<{ id: number; url: string; alt: string }> = [];
  
  if (!acfData) return images;
  
  // Buscar en diferentes campos ACF que pueden contener imágenes
  const imageFields = [
    'fave_property_images',
    'gallery',
    'property_images',
    'images'
  ];
  
  for (const field of imageFields) {
    const fieldData = acfData[field];
    if (Array.isArray(fieldData) && fieldData.length > 0) {
      
      for (const imageItem of fieldData.slice(0, 10)) { // Limitar a 10 imágenes por campo
        try {
          let imageId: number;
          let imageUrl: string | null = null;
          let imageAlt: string = '';
          
          // Manejar diferentes formatos de datos de imagen
          if (typeof imageItem === 'number') {
            // Es solo un ID
            imageId = imageItem;
          } else if (typeof imageItem === 'object' && imageItem !== null) {
            // Es un objeto con datos de imagen
            imageId = imageItem.id || imageItem.ID || imageItem.attachment_id;
            imageUrl = imageItem.url || imageItem.source_url || imageItem.sizes?.large || imageItem.sizes?.medium || imageItem.sizes?.full;
            imageAlt = imageItem.alt || imageItem.alt_text || '';
          } else {
            continue; // Formato no reconocido
          }
          
          // Si ya tenemos la URL, usarla directamente
          if (imageUrl && imageId) {
            images.push({
              id: imageId,
              url: imageUrl,
              alt: imageAlt
            });
          } else if (imageId) {
            // Si solo tenemos el ID, hacer fetch para obtener la URL
            try {
              const imgResponse = await fetch(`${WP_API_URL}/media/${imageId}?_fields=id,source_url,alt_text`);
              if (imgResponse.ok) {
                const imgData = await imgResponse.json();
                images.push({
                  id: imgData.id,
                  url: imgData.source_url,
                  alt: imgData.alt_text || ''
                });
              }
            } catch (e) {
              console.warn(`⚠️ Error obteniendo imagen ${imageId}:`, e);
            }
          }
        } catch (e) {
          console.warn(`⚠️ Error procesando imagen ACF:`, e);
        }
      }
      
      // Si encontramos imágenes en este campo, no buscar en otros
      if (images.length > 0) {
        break;
      }
    }
  }
  
  return images;
}

// Interfaz para términos de taxonomías de WordPress
interface WordPressTaxonomyTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta?: any[];
  acf?: {
    [key: string]: any;
  };
}

// Interfaz para mapeo de taxonomías
interface TaxonomyMap {
  [taxonomySlug: string]: {
    [termId: number]: WordPressTaxonomyTerm;
  };
}

// Caché para taxonomías
let taxonomyCache: TaxonomyMap = {};
let taxonomyCacheTimestamp = 0;

// Función para obtener todos los términos de una taxonomía específica
export async function getTaxonomyTerms(taxonomy: string): Promise<WordPressTaxonomyTerm[]> {
  const cacheKey = `taxonomy_${taxonomy}`;
  const now = Date.now();
  
  // Verificar caché
  if (globalCache[cacheKey] && globalCache.lastFetched?.[cacheKey] && 
      (now - globalCache.lastFetched[cacheKey]) < CACHE_EXPIRY_TIME) {
    return globalCache[cacheKey];
  }

  try {
    
    // Intentar diferentes endpoints para la taxonomía
    const endpoints = [
      `${WP_API_URL}/${taxonomy}?per_page=100&_fields=id,count,description,link,name,slug,taxonomy,meta,acf`,
      `${WP_API_URL}/property_${taxonomy}?per_page=100&_fields=id,count,description,link,name,slug,taxonomy,meta,acf`,
      `${WP_API_URL}/property-${taxonomy}?per_page=100&_fields=id,count,description,link,name,slug,taxonomy,meta,acf`
    ];

    let terms: WordPressTaxonomyTerm[] = [];
    let success = false;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          terms = await response.json();
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`⚠️ Error en endpoint ${endpoint}:`, e);
      }
    }

    if (!success || !Array.isArray(terms)) {
      console.warn(`❌ No se pudieron obtener términos para taxonomía: ${taxonomy}`);
      return [];
    }

    // Procesar términos
    const processedTerms = terms.map(term => ({
      ...term,
      taxonomy: taxonomy // Asegurar que el taxonomy esté definido
    }));

    // Actualizar caché
    globalCache[cacheKey] = processedTerms;
    if (!globalCache.lastFetched) globalCache.lastFetched = {};
    globalCache.lastFetched[cacheKey] = now;

    return processedTerms;

  } catch (error) {
    console.error(`❌ Error obteniendo términos de taxonomía ${taxonomy}:`, error);
    return [];
  }
}

// Función para obtener múltiples taxonomías de una vez
export async function getMultipleTaxonomies(taxonomies: string[]): Promise<TaxonomyMap> {
  const now = Date.now();
  
  // Verificar si necesitamos actualizar el caché
  if (taxonomyCacheTimestamp && (now - taxonomyCacheTimestamp) < CACHE_EXPIRY_TIME) {
    return taxonomyCache;
  }

  try {
    
    const results = await Promise.all(
      taxonomies.map(async (taxonomy) => {
        const terms = await getTaxonomyTerms(taxonomy);
        return { taxonomy, terms };
      })
    );

    // Crear mapa de taxonomías
    const newTaxonomyCache: TaxonomyMap = {};
    
    results.forEach(({ taxonomy, terms }) => {
      newTaxonomyCache[taxonomy] = {};
      terms.forEach(term => {
        newTaxonomyCache[taxonomy][term.id] = term;
      });
    });

    taxonomyCache = newTaxonomyCache;
    taxonomyCacheTimestamp = now;

    return newTaxonomyCache;

  } catch (error) {
    console.error('❌ Error obteniendo taxonomías múltiples:', error);
    return {};
  }
}

// Función para filtrar propiedades por taxonomía
export async function getPropertiesByTaxonomy(
  taxonomy: string, 
  termSlug: string, 
  limit: number = 20
): Promise<WordPressProperty[]> {
  try {
    
    // Construir URL con filtro de taxonomía
    const endpoints = [
      `${WP_API_URL}/properties?${taxonomy}=${termSlug}&per_page=${limit}&_embed&acf_format=standard`,
      `${WP_API_URL}/property?${taxonomy}=${termSlug}&per_page=${limit}&_embed&acf_format=standard`,
      `${WP_API_URL}/posts?${taxonomy}=${termSlug}&per_page=${limit}&_embed&acf_format=standard`
    ];

    let properties: WordPressProperty[] = [];
    let success = false;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          properties = await response.json();
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`⚠️ Error en endpoint ${endpoint}:`, e);
      }
    }

    if (!success || !Array.isArray(properties)) {
      console.warn(`❌ No se pudieron obtener propiedades filtradas por ${taxonomy}=${termSlug}`);
      return [];
    }

    // Procesar propiedades (similar a getAllProperties pero sin caché global)
    const propertyIds = properties.map(p => p.id);
    const galleryMap = await fetchPropertyImagesInBatch(propertyIds);
    
    const enrichedProperties = properties.map((property) => {
      // Inicializar ACF si no existe
      if (!property.acf) property.acf = {};
      if (!property.acf.gallery) property.acf.gallery = [];

      // Asignar galería obtenida en lote
      if (galleryMap[property.id] && galleryMap[property.id].length > 0) {
        const rawGallery = galleryMap[property.id];
        const seenUrls = new Set<string>();
        property.acf.gallery = rawGallery.filter(img => {
          if (!img.url) return false;
          if (seenUrls.has(img.url)) return false;
          seenUrls.add(img.url);
          return true;
        });
      }
      
      // Procesar featured media desde _embedded
      const media = property._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        property.featured_media_url = media.source_url;
      }

      // Extraer zona de términos embebidos
      if (property._embedded?.['wp:term']) {
        const allTerms = property._embedded['wp:term'].flat();
        const zoneTerm = allTerms.find(term => 
          term.taxonomy === 'property_zone' || 
          term.taxonomy === 'zone' || 
          term.taxonomy === 'location' || 
          term.taxonomy === 'property_location' ||
          term.taxonomy === 'property_status'
        );
        if (zoneTerm) {
          if (!property.acf) property.acf = {};
          property.acf.zone = zoneTerm.name;
          property.acf.location = property.acf.location || zoneTerm.name;
        }
      }

      // Procesar metadatos
      return processPropertyMetadata(property);
    });

    return enrichedProperties;

  } catch (error) {
    console.error(`❌ Error filtrando propiedades por ${taxonomy}=${termSlug}:`, error);
    return [];
  }
}

// Función para resolver IDs de taxonomías a nombres
export async function resolveTaxonomyTerms(
  termIds: number[], 
  taxonomy: string
): Promise<{ [id: number]: WordPressTaxonomyTerm }> {
  try {
    // Obtener términos de la taxonomía
    const terms = await getTaxonomyTerms(taxonomy);
    
    // Crear mapa de ID a término
    const termMap: { [id: number]: WordPressTaxonomyTerm } = {};
    
    termIds.forEach(id => {
      const term = terms.find(t => t.id === id);
      if (term) {
        termMap[id] = term;
      }
    });

    return termMap;
  } catch (error) {
    console.error(`❌ Error resolviendo términos de taxonomía ${taxonomy}:`, error);
    return {};
  }
}

// Función para obtener información completa de taxonomías de una propiedad
export async function getPropertyTaxonomyInfo(property: WordPressProperty): Promise<{
  status?: WordPressTaxonomyTerm;
  type?: WordPressTaxonomyTerm;
  location?: WordPressTaxonomyTerm;
  area?: WordPressTaxonomyTerm;
  [key: string]: WordPressTaxonomyTerm | undefined;
}> {
  const taxonomyInfo: { [key: string]: WordPressTaxonomyTerm | undefined } = {};

  try {
    // Extraer IDs de taxonomías desde _embedded
    if (property._embedded?.['wp:term']) {
      const allTerms = property._embedded['wp:term'].flat();
      
      // Agrupar términos por taxonomía
      const termsByTaxonomy: { [taxonomy: string]: number[] } = {};
      
      allTerms.forEach(term => {
        if (term.taxonomy && term.id) {
          if (!termsByTaxonomy[term.taxonomy]) {
            termsByTaxonomy[term.taxonomy] = [];
          }
          termsByTaxonomy[term.taxonomy].push(term.id);
        }
      });

      // Resolver cada taxonomía
      for (const [taxonomy, termIds] of Object.entries(termsByTaxonomy)) {
        if (termIds.length > 0) {
          const resolvedTerms = await resolveTaxonomyTerms(termIds, taxonomy);
          
          // Tomar el primer término de cada taxonomía
          const firstTermId = termIds[0];
          if (resolvedTerms[firstTermId]) {
            // Mapear nombres de taxonomías comunes
            let key = taxonomy;
            if (taxonomy === 'property_status') key = 'status';
            else if (taxonomy === 'property_type') key = 'type';
            else if (taxonomy === 'property_location') key = 'location';
            else if (taxonomy === 'property_area') key = 'area';
            
            taxonomyInfo[key] = resolvedTerms[firstTermId];
          }
        }
      }
    }

    return taxonomyInfo;
  } catch (error) {
    console.error('❌ Error obteniendo información de taxonomías de la propiedad:', error);
    return {};
  }
}

// Hacer las funciones disponibles globalmente en el navegador para debug
if (typeof window !== 'undefined') {
  (window as any).blogCacheUtils = {
    clearBlogCache,
    forceBlogRefresh,
    getBlogCacheInfo,
    getTimeUntilNextBlogRefresh,
  };
  
  // Log de ayuda en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🛠️ Funciones de caché del blog disponibles en window.blogCacheUtils:', {
      'clearBlogCache()': 'Limpia el caché del blog',
      'forceBlogRefresh()': 'Fuerza actualización del blog',
      'getBlogCacheInfo()': 'Obtiene información del caché',
      'getTimeUntilNextBlogRefresh()': 'Tiempo hasta próxima actualización',
    });
  }
} 

// Función helper para transformar todas las URLs de un post del blog
const transformBlogPostUrls = (post: WordPressBlogPost): WordPressBlogPost => {
  const transformedPost = { ...post };
  
  // Transformar featured_media_url
  if (transformedPost.featured_media_url) {
    transformedPost.featured_media_url = transformDomainUrl(transformedPost.featured_media_url);
  }
  
  // Transformar URLs en el contenido HTML
  if (transformedPost.content?.rendered) {
    transformedPost.content.rendered = transformHtmlUrls(transformedPost.content.rendered);
  }
  
  // Transformar URLs en el extracto
  if (transformedPost.excerpt?.rendered) {
    transformedPost.excerpt.rendered = transformHtmlUrls(transformedPost.excerpt.rendered);
  }
  
  // Transformar avatars del autor
  if (transformedPost.author_info?.avatar_urls) {
    const transformedAvatars: { [key: string]: string } = {};
    for (const [size, url] of Object.entries(transformedPost.author_info.avatar_urls)) {
      transformedAvatars[size] = transformDomainUrl(url);
    }
    transformedPost.author_info.avatar_urls = transformedAvatars;
  }
  
  return transformedPost;
};
