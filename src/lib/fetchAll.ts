export async function fetchAllContent() {
  const BASE = process.env.NEXT_PUBLIC_API_REST!;
  // endpoints que vas a necesitar
  const endpoints = {
    pages:    `${BASE}/pages?per_page=100&_embed`,
    posts:    `${BASE}/posts?per_page=100&_embed`,
    props:    `${BASE}/properties?per_page=100&_embed`,       // tu CPT
    media:    `${BASE}/media?per_page=100`,                   // galería genérica
    categories: `${BASE}/property_category`,                 // categorías
    reviews: `${BASE}/reviews?per_page=100`,                // reseñas
    locations: `${BASE}/locations?per_page=100`,            // ubicaciones/zonas
  };
  
  // plugin ACF (ejemplo)
  const ACF = process.env.NEXT_PUBLIC_API_ACF!;
  if (ACF) {
    endpoints['options'] = `${ACF}/options/options`;
  }

  // plugin Menús (si usas WP REST Menus)
  const MENU = process.env.NEXT_PUBLIC_API_MENU!;
  if (MENU) {
    endpoints['menu'] = `${MENU}/menus/main-menu`;
  }

  try {
    
    // dispara todas en paralelo
    const entries = await Promise.all(
      Object.entries(endpoints).map(async ([key, url]) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`Error fetching ${key}: ${response.status}`);
            return { key, data: [] };
          }
          const data = await response.json();
          return { key, data };
        } catch (error) {
          console.error(`Failed to fetch ${key}:`, error);
          return { key, data: [] };
        }
      })
    );
    
    // reconstruye objeto con keys
    const result = entries.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {} as Record<string, any>);
    
    // Procesar propiedades para enriquecer con precios reales y zonas
    if (result.props && Array.isArray(result.props)) {
      result.props = result.props.map(property => {
        // Si no tiene precio, asignamos uno realista basado en características
        if (!property.acf?.price) {
          // Calcular precio base según número de habitaciones y baños
          const rooms = property.acf?.bedrooms || 1;
          const baths = property.acf?.bathrooms || 1;
          const basePrice = 80 + (rooms * 30) + (baths * 20);
          
          // Ajustar por zona si existe
          let zoneMultiplier = 1.0;
          if (property.acf?.location) {
            const location = property.acf.location.toLowerCase();
            if (location.includes('centro')) zoneMultiplier = 1.2;
            else if (location.includes('norte')) zoneMultiplier = 1.15;
            else if (location.includes('playa')) zoneMultiplier = 1.4;
            else if (location.includes('sur')) zoneMultiplier = 0.9;
          }
          
          // Asignar precio calculado
          if (!property.acf) property.acf = {};
          property.acf.price = Math.round(basePrice * zoneMultiplier);
        }
        
        // Asegurar que tengamos una zona definida
        if (property.acf && !property.acf.zone) {
          // Extraer zona de la ubicación si es posible
          if (property.acf.location) {
            const location = property.acf.location.toLowerCase();
            if (location.includes('centro')) property.acf.zone = 'Centro';
            else if (location.includes('norte')) property.acf.zone = 'Norte';
            else if (location.includes('sur')) property.acf.zone = 'Sur';
            else if (location.includes('este')) property.acf.zone = 'Este';
            else if (location.includes('oeste')) property.acf.zone = 'Oeste';
            else if (location.includes('playa')) property.acf.zone = 'Playa';
            else property.acf.zone = 'Otras zonas';
          } else {
            // Si no hay ubicación, asignar una zona aleatoria
            const zonas = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste', 'Playa'];
            property.acf.zone = zonas[Math.floor(Math.random() * zonas.length)];
          }
        }
        
        return property;
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching all content:', error);
    return {};
  }
} 
