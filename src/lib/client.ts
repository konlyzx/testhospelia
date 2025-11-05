export async function graphqlRequest(query: string, variables = {}) {
  try {
    const endpoint = 'https://wp.hospelia.co/graphql';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error en la petición GraphQL: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('Errores en la respuesta GraphQL:', json.errors);
      throw new Error(`Error en la consulta GraphQL: ${json.errors[0].message}`);
    }

    return json.data;
  } catch (error) {
    console.error('Error en la petición a GraphQL:', error);
    throw error;
  }
} 