# Configuración de Facebook Conversions API

## Variables de Entorno Configuradas

Se han configurado las siguientes variables de entorno en el archivo `env.example`:

```env
FACEBOOK_ACCESS_TOKEN=EAALZCts0mRjsBPRLZCMzzdGzNZBGrGjRXHsWgK2uRPauYnjKHt6uK1bnpqpoqbXTZAv24eT7kIrdqu2TxgJ6tVjpjoF80Du1Kq7fFLmtlx1l2UrlwtrTbb8ZBFg7C1JcoB3ZCrjuy2I3JxRt24lTxJvT9diKQmRaWgfZC6ZCAd9rvj7Ki1pU301AcLY9EOBdW77pmgZDZD
FACEBOOK_PIXEL_ID=2059684518101612
```

## Configuración Completa

### 1. Crear archivo .env.local
Copia el archivo `env.example` y renómbralo a `.env.local`:

```bash
cp env.example .env.local
```

### 2. Verificar configuración
- ✅ **Access Token**: Configurado
- ✅ **Pixel ID**: Configurado en layout.tsx
- ✅ **API Route**: Creada en `/api/facebook/conversions`
- ✅ **Funciones JavaScript**: Disponibles en window object

## Uso de la API

### Tracking de Compras
```javascript
// Ejemplo de uso
await window.trackPurchase({
  email: "usuario@ejemplo.com",
  phone: "+573001234567",
  currency: "USD",
  value: "142.52"
});
```

### Envío de Eventos Personalizados
```javascript
// Ejemplo de evento personalizado
const eventData = {
  data: [{
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    user_data: {
      em: ["usuario@ejemplo.com"],
      ph: ["+573001234567"]
    },
    attribution_data: {
      attribution_share: "0.3"
    },
    custom_data: {
      currency: "USD",
      value: "142.52"
    },
    original_event_data: {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000)
    }
  }]
};

await window.sendFacebookConversion(eventData);
```

## Archivos Modificados/Creados

1. **`src/app/layout.tsx`** - Scripts de Facebook Pixel y Conversions API
2. **`src/app/api/facebook/conversions/route.ts`** - API endpoint
3. **`src/utils/facebookTracking.ts`** - Utilidades TypeScript
4. **`src/utils/facebookExample.tsx`** - Ejemplos de uso
5. **`src/types/gtag.d.ts`** - Tipos TypeScript actualizados
6. **`env.example`** - Variables de entorno de ejemplo

## Testing

Para probar la integración:

1. Crear un archivo `.env.local` con las variables
2. Ejecutar la aplicación en modo desarrollo
3. Abrir las herramientas de desarrollador
4. Ejecutar en consola: `window.trackPurchase({value: "10.00"})`

## Seguridad

⚠️ **Importante**: 
- El access token está configurado en el archivo de ejemplo
- En producción, usar variables de entorno seguras
- El token tiene permisos limitados para Conversions API
- No exponer el token en el código del cliente

## Próximos Pasos

1. Configurar `.env.local` en tu entorno local
2. Probar la integración con eventos de prueba
3. Implementar tracking en componentes de compra
4. Monitorear eventos en Facebook Events Manager
