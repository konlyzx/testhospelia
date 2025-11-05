// Utilidades para tracking de Facebook Conversions API

export interface PurchaseData {
  email?: string;
  phone?: string;
  currency?: string;
  value: string;
}

export interface FacebookEventData {
  event_name: string;
  event_time: number;
  action_source: string;
  user_data: {
    em: string[] | null[];
    ph: string[] | null[];
  };
  attribution_data: {
    attribution_share: string;
  };
  custom_data: {
    currency: string;
    value: string;
  };
  original_event_data: {
    event_name: string;
    event_time: number;
  };
}

/**
 * Función para enviar eventos de compra a Facebook Conversions API
 * @param purchaseData Datos de la compra
 * @returns Promise con la respuesta de la API
 */
export const trackPurchaseEvent = async (purchaseData: PurchaseData): Promise<any> => {
  if (typeof window === 'undefined') {
    console.warn('trackPurchaseEvent solo puede ejecutarse en el cliente');
    return null;
  }

  try {
    const result = await window.trackPurchase(purchaseData);
    return result;
  } catch (error) {
    console.error('Error al trackear compra:', error);
    throw error;
  }
};

/**
 * Función para enviar eventos personalizados a Facebook Conversions API
 * @param eventData Datos del evento
 * @returns Promise con la respuesta de la API
 */
export const sendCustomEvent = async (eventData: { data: FacebookEventData[] }): Promise<any> => {
  if (typeof window === 'undefined') {
    console.warn('sendCustomEvent solo puede ejecutarse en el cliente');
    return null;
  }

  try {
    const result = await window.sendFacebookConversion(eventData);
    return result;
  } catch (error) {
    console.error('Error al enviar evento personalizado:', error);
    throw error;
  }
};

/**
 * Función para crear datos de evento de compra
 * @param purchaseData Datos de la compra
 * @returns Objeto con los datos del evento formateados
 */
export const createPurchaseEventData = (purchaseData: PurchaseData): { data: FacebookEventData[] } => {
  const currentTime = Math.floor(Date.now() / 1000);
  
  return {
    data: [{
      event_name: "Purchase",
      event_time: currentTime,
      action_source: "website",
      user_data: {
        em: purchaseData.email ? [purchaseData.email] : [null],
        ph: purchaseData.phone ? [purchaseData.phone] : [null]
      },
      attribution_data: {
        attribution_share: "0.3"
      },
      custom_data: {
        currency: purchaseData.currency || "USD",
        value: purchaseData.value
      },
      original_event_data: {
        event_name: "Purchase",
        event_time: currentTime
      }
    }]
  };
};
