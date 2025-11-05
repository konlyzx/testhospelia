import { GraphQLClient, Variables } from 'graphql-request';

// Reemplaza esta URL con la URL de tu endpoint GraphQL de WordPress
const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'https://wp.hospelia.co/graphql';

// Puedes añadir headers de autenticación aquí si tu API GraphQL está protegida
// const headers = { authorization: 'Bearer YOUR_TOKEN' };

export const graphqlClient = new GraphQLClient(endpoint /*, { headers }*/);

// Exporta una función para hacer requests, opcionalmente manejando errores comunes
export async function request<T = any, V extends Variables = Variables>(
  query: string, 
  variables?: V
): Promise<T> {
  try {
    // Usa el operador de propagación para pasar 'variables' solo si está definido.
    // Esto ayuda a TypeScript a hacer coincidir la firma correcta de la función 'request'.
    return await graphqlClient.request<T, V>(query, ...(variables ? [variables] : []));
  } catch (error) {
    console.error("Error en la petición GraphQL:", error);
    // Podrías lanzar un error más específico o devolver un valor por defecto
    throw new Error("No se pudo completar la petición GraphQL.");
  }
} 