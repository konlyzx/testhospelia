// Utilidades para traducciones y formateo de texto

export const formatCurrency = (amount: number, currency: string, locale: string): string => {
  const formatters = {
    'COP': new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }),
    'USD': new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    'EUR': new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  };

  const formatter = formatters[currency as keyof typeof formatters];
  return formatter ? formatter.format(amount) : `${amount} ${currency}`;
};

export const getLocalizedDate = (date: Date, locale: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const getLocalizedNumber = (number: number, locale: string): string => {
  return new Intl.NumberFormat(locale).format(number);
};

// Traducciones adicionales para casos específicos
export const additionalTranslations = {
  es: {
    // Mensajes de error
    'error.network': 'Error de conexión. Por favor, intenta de nuevo.',
    'error.not_found': 'No se encontraron resultados.',
    'error.generic': 'Ha ocurrido un error inesperado.',
    
    // Mensajes de éxito
    'success.saved': 'Guardado exitosamente.',
    'success.updated': 'Actualizado correctamente.',
    'success.deleted': 'Eliminado correctamente.',
    
    // Acciones
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.view': 'Ver',
    'action.share': 'Compartir',
    'action.download': 'Descargar',
    
    // Estados
    'status.loading': 'Cargando...',
    'status.saving': 'Guardando...',
    'status.processing': 'Procesando...',
    'status.completed': 'Completado',
    'status.failed': 'Falló',
    
    // Tiempo
    'time.now': 'Ahora',
    'time.today': 'Hoy',
    'time.yesterday': 'Ayer',
    'time.days_ago': 'hace {days} días',
    'time.weeks_ago': 'hace {weeks} semanas',
    'time.months_ago': 'hace {months} meses',
    
    // Unidades
    'unit.meter': 'm',
    'unit.square_meter': 'm²',
    'unit.kilometer': 'km',
    'unit.minute': 'min',
    'unit.hour': 'hora',
    'unit.day': 'día',
    'unit.week': 'semana',
    'unit.month': 'mes',
    'unit.year': 'año',
  },
  en: {
    // Error messages
    'error.network': 'Connection error. Please try again.',
    'error.not_found': 'No results found.',
    'error.generic': 'An unexpected error occurred.',
    
    // Success messages
    'success.saved': 'Successfully saved.',
    'success.updated': 'Updated correctly.',
    'success.deleted': 'Deleted correctly.',
    
    // Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.view': 'View',
    'action.share': 'Share',
    'action.download': 'Download',
    
    // States
    'status.loading': 'Loading...',
    'status.saving': 'Saving...',
    'status.processing': 'Processing...',
    'status.completed': 'Completed',
    'status.failed': 'Failed',
    
    // Time
    'time.now': 'Now',
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.days_ago': '{days} days ago',
    'time.weeks_ago': '{weeks} weeks ago',
    'time.months_ago': '{months} months ago',
    
    // Units
    'unit.meter': 'm',
    'unit.square_meter': 'm²',
    'unit.kilometer': 'km',
    'unit.minute': 'min',
    'unit.hour': 'hour',
    'unit.day': 'day',
    'unit.week': 'week',
    'unit.month': 'month',
    'unit.year': 'year',
  }
};

// Función para interpolar variables en traducciones
export const interpolateTranslation = (text: string, variables: Record<string, any>): string => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
};

// Función para obtener traducciones adicionales
export const getAdditionalTranslation = (key: string, locale: string, variables?: Record<string, any>): string => {
  const translations = additionalTranslations[locale as keyof typeof additionalTranslations];
  const translation = translations?.[key as keyof typeof translations] || key;
  
  if (variables) {
    return interpolateTranslation(translation, variables);
  }
  
  return translation;
};

// Función para formatear tiempo relativo
export const getRelativeTime = (date: Date, locale: string): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInDays === 0) {
    return getAdditionalTranslation('time.today', locale);
  } else if (diffInDays === 1) {
    return getAdditionalTranslation('time.yesterday', locale);
  } else if (diffInDays < 7) {
    return getAdditionalTranslation('time.days_ago', locale, { days: diffInDays });
  } else if (diffInWeeks < 4) {
    return getAdditionalTranslation('time.weeks_ago', locale, { weeks: diffInWeeks });
  } else {
    return getAdditionalTranslation('time.months_ago', locale, { months: diffInMonths });
  }
};

// Función para validar y sanitizar texto
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Función para truncar texto con elipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}; 