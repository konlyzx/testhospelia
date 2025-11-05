// Ejemplo de uso de Facebook Conversions API
// Este archivo muestra cómo usar las funciones de tracking de Facebook

import { trackPurchaseEvent, sendCustomEvent, createPurchaseEventData } from './facebookTracking';

// Ejemplo 1: Tracking de una compra
export const handlePurchase = async () => {
  try {
    const purchaseData = {
      email: "usuario@ejemplo.com",
      phone: "+573001234567",
      currency: "USD",
      value: "142.52"
    };

    // Método 1: Usando la función helper
    const result = await trackPurchaseEvent(purchaseData);
    console.log('Compra trackeada:', result);

    // Método 2: Usando el evento personalizado
    const eventData = createPurchaseEventData(purchaseData);
    const result2 = await sendCustomEvent(eventData);
    console.log('Evento personalizado enviado:', result2);

  } catch (error) {
    console.error('Error al trackear compra:', error);
  }
};

// Ejemplo 2: Tracking desde un componente React
export const PurchaseButton = () => {
  const handleClick = async () => {
    try {
      // Simular datos de compra
      const purchaseData = {
        email: "cliente@hospelia.co",
        currency: "USD",
        value: "99.99"
      };

      // Trackear la compra
      await trackPurchaseEvent(purchaseData);
      
      // Continuar con la lógica de compra...
      console.log('Compra procesada exitosamente');
      
    } catch (error) {
      console.error('Error en el proceso de compra:', error);
    }
  };

  return (
    <button onClick={handleClick}>
      Comprar Ahora
    </button>
  );
};

// Ejemplo 3: Tracking de evento personalizado
export const trackCustomEvent = async () => {
  const customEventData = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: {
        em: ["lead@ejemplo.com"],
        ph: ["+573001234567"]
      },
      attribution_data: {
        attribution_share: "0.3"
      },
      custom_data: {
        currency: "USD",
        value: "0"
      },
      original_event_data: {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000)
      }
    }]
  };

  try {
    const result = await sendCustomEvent(customEventData);
    console.log('Lead trackeado:', result);
  } catch (error) {
    console.error('Error al trackear lead:', error);
  }
};
