declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    gtag_report_conversion: (url?: string) => boolean;
  }
}

export const trackConversion = (
  conversionLabel: string,
  value: number = 1.0,
  currency: string = 'COP'
): void => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `AW-943201081/${conversionLabel}`,
        'value': value,
        'currency': currency,
        'transaction_id': generateTransactionId()
      });
    }
  } catch (error) {
    // Silent fail
  }
};

export const trackReservationConversion = (formData?: any): void => {
  trackConversion('N98XCPWW5bsaELm24MED', 1.0, 'COP');
};

export const trackReservationButtonClick = (): void => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'reservation',
        'event_label': 'reserve_button_click',
        'event_value': 1
      });
    }
  } catch (error) {
    // Silent fail
  }
};

export const trackWhatsAppConversion = (url?: string): boolean => {
  try {
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      return window.gtag_report_conversion(url);
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
};

export const trackWhatsAppClick = (): void => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-943201081/8GhRCMusjZICELm24MED'
      });
    }
  } catch (error) {
    // Silent fail
  }
};

const generateTransactionId = (): string => {
  return `hospelia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isGoogleAdsLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}; 