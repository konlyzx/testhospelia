/**
 * Función para extraer la zona del string property_status
 * @param zonaRaw - String con formato "property_status-zona-sur" o similar
 * @returns Zona formateada (ej: "Sur")
 */
export const extraerZona = (zonaRaw: string): string => {
  if (!zonaRaw) return "Zona no definida";
  
  // Si el formato es "property_status-zona-sur", extraer la última parte
  const partes = zonaRaw.split('-');
  const zona = partes[partes.length - 1];
  
  // Capitalizar la primera letra y devolver
  return zona.charAt(0).toUpperCase() + zona.slice(1);
};

/**
 * Función para obtener una zona más legible
 * @param zonaRaw - String con formato "property_status-zona-sur" o similar
 * @returns Zona formateada con "Zona" como prefijo (ej: "Zona Sur")
 */
export const extraerZonaConPrefijo = (zonaRaw: string): string => {
  const zona = extraerZona(zonaRaw);
  
  if (zona === "Zona no definida") {
    return zona;
  }
  
  return `Zona ${zona}`;
};

/**
 * Mapeo de zonas para nombres más amigables
 */
export const ZONA_MAPPING: Record<string, string> = {
  'norte': 'Norte',
  'sur': 'Sur',
  'este': 'Este',
  'oeste': 'Oeste',
  'centro': 'Centro',
  'noroccidente': 'Noroccidente',
  'suroccidente': 'Suroccidente',
  'nororiente': 'Nororiente',
  'suroriente': 'Suroriente'
};

/**
 * Función para obtener el nombre amigable de una zona
 * @param zonaRaw - String con formato "property_status-zona-sur" o similar
 * @returns Zona con nombre amigable
 */
export const extraerZonaAmigable = (zonaRaw: string): string => {
  if (!zonaRaw) return "Zona no definida";
  
  const partes = zonaRaw.split('-');
  const zona = partes[partes.length - 1].toLowerCase();
  
  return ZONA_MAPPING[zona] || zona.charAt(0).toUpperCase() + zona.slice(1);
}; 