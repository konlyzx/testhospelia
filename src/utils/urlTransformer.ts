/**
 * Transforma URLs del dominio anterior hospelia.co al nuevo wp.hospelia.co
 * y asegura que todas las URLs usen HTTPS
 */
export const transformDomainUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Transformar hospelia.co a wp.hospelia.co pero preservar https://
  if (url.includes('hospelia.co') && !url.includes('wp.hospelia.co')) {
    // Asegurar que sea HTTPS
    const httpsUrl = url.replace(/^http:/i, 'https:');
    // Transformar el dominio
    return httpsUrl.replace(/https?:\/\/hospelia\.co/gi, 'https://wp.hospelia.co');
  }
  
  // Asegurar HTTPS para todas las URLs
  return url.replace(/^http:/i, 'https:');
};

/**
 * Transforma múltiples URLs en un objeto
 */
export const transformObjectUrls = <T extends Record<string, any>>(obj: T): T => {
  const transformed = { ...obj };
  
  for (const key in transformed) {
    const value = transformed[key];
    if (typeof value === 'string' && (value.includes('http://') || value.includes('https://'))) {
      transformed[key] = transformDomainUrl(value) as T[typeof key];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      transformed[key] = transformObjectUrls(value) as T[typeof key];
    } else if (Array.isArray(value)) {
      transformed[key] = value.map(item => 
        typeof item === 'string' && (item.includes('http://') || item.includes('https://'))
          ? transformDomainUrl(item)
          : typeof item === 'object' && item !== null
          ? transformObjectUrls(item)
          : item
      ) as T[typeof key];
    }
  }
  
  return transformed;
};

/**
 * Transforma URLs en contenido HTML
 */
export const transformHtmlUrls = (html: string): string => {
  if (!html) return '';
  
  return html
    .replace(/https?:\/\/hospelia\.co/gi, 'https://wp.hospelia.co')
    .replace(/http:/gi, 'https:');
}; 