declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
        event_category?: string;
        event_label?: string;
        value?: number;
        currency?: string;
        send_to?: string;
        transaction_id?: string;
        conversion_id?: string;
        popup_id?: number;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_term?: string;
        utm_content?: string;
        gclid?: string;
        fbclid?: string;
      }
    ) => void;
    flatpickr: any;
    
    // Facebook Conversions API functions
    sendFacebookConversion: (eventData: any) => Promise<any>;
    trackPurchase: (purchaseData: {
      email?: string;
      phone?: string;
      currency?: string;
      value: string;
    }) => Promise<any>;
    
    // Facebook Pixel
    fbq: (command: string, event: string, data?: any) => void;
  }
}

export {};
