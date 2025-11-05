/**
 * Utilidades para limpiar y formatear texto
 */

/**
 * Limpia descripciones de metadatos HTML y caracteres especiales
 * @param text - Texto a limpiar
 * @returns Texto limpio sin metadatos HTML
 */
export const cleanDescription = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remover tags HTML
    .replace(/<[^>]*>/g, '')
    // Remover entidades HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // Entidades HTML en español
    .replace(/&oacute;/g, 'ó')
    .replace(/&iexcl;/g, '¡')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&aacute;/g, 'á')
    .replace(/&uacute;/g, 'ú')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ')
    // Remover metadatos comunes de CMS
    .replace(/\*\*/g, '')
    .replace(/\[\[.*?\]\]/g, '')
    .replace(/\{\{.*?\}\}/g, '')
    .replace(/\[.*?\]/g, '')
    // Remover caracteres especiales de markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    // Limpiar espacios múltiples y saltos de línea
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

/**
 * Trunca texto a una longitud específica manteniendo palabras completas
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea números con separadores de miles
 * @param num - Número a formatear
 * @param locale - Locale para el formato (default: 'es-CO')
 * @returns Número formateado
 */
export const formatNumber = (num: number | string, locale: string = 'es-CO'): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0';
  
  return new Intl.NumberFormat(locale).format(number);
}; 