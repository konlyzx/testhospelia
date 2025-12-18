export type BlogPost = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  cover: string
  coverAlt?: string
  tags?: string[]
  featured?: boolean
  content: string
}

export const posts: BlogPost[] = [
  {
    slug: 'alojamientos-en-cali-guia-completa',
    title: 'Alojamientos en Cali: Guía completa 2025',
    category: 'guia',
    date: '2025-01-05',
    excerpt: 'Descubre las mejores opciones de hospedaje en Cali. Desde zonas exclusivas hasta consejos de seguridad y precios para tu estancia perfecta.',
    cover: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop',
    coverAlt: 'Apartamento amoblado moderno y luminoso en el sur de Cali',
    tags: ['alojamientos', 'cali', 'turismo', 'guia', 'seguridad'],
    featured: true,
    content: `<p>Cali, la vibrante "Sucursal del Cielo", se ha consolidado como uno de los destinos más atractivos de Colombia, no solo por ser la Capital Mundial de la Salsa, sino también por su creciente turismo médico, de negocios y ecológico. Si estás planeando tu visita en 2025, elegir el <strong>alojamiento en Cali</strong> adecuado es crucial para disfrutar de una experiencia inolvidable.</p>

<h3>¿Por qué elegir un Apartamento Amoblado sobre un Hotel?</h3>

<p>La tendencia en <strong>hospedaje en Cali</strong> ha cambiado drásticamente. Cada vez más viajeros optan por <strong>apartamentos amoblados</strong> en lugar de hoteles tradicionales. ¿La razón? Privacidad, espacio y economía. Alquilar un apartamento te permite vivir como un local, cocinar tus propias comidas (ahorrando significativamente en restaurantes) y disfrutar de áreas sociales más amplias, ideal si viajas en familia o grupo. En Hospelia, ofrecemos propiedades verificadas que combinan la comodidad de un hogar con servicios de primera calidad.</p>

<h3>Factores Clave al Buscar Alojamiento</h3>

<ol>
  <li><strong>Ubicación y Seguridad:</strong> Cali es una ciudad grande y diversa. Para estancias tranquilas, recomendamos el <strong>Sur de Cali</strong> (Ciudad Jardín, Pance, Bochalema) por su seguridad, zonas verdes y cercanía a los mejores centros comerciales y clínicas. El <strong>Oeste</strong> (El Peñón, San Antonio) es perfecto si buscas gastronomía y cultura a pie.</li>
  <li><strong>Movilidad:</strong> Verifica la cercanía a estaciones del MIO o vías principales. Zonas como Bochalema tienen excelente conexión con universidades y el sur de la ciudad.</li>
  <li><strong>Clima y Comodidades:</strong> El clima de Cali es cálido. Asegúrate de que tu alojamiento cuente con buena ventilación o aire acondicionado. Además, el <strong>WiFi de alta velocidad</strong> es innegociable si eres un nómada digital.</li>
</ol>

<h3>Precios Promedio en 2025</h3>

<p>El costo de vida en Cali sigue siendo competitivo. Un apartaestudio moderno en una buena zona puede oscilar entre los $120.000 y $200.000 COP por noche, mientras que propiedades de lujo para familias pueden rondar los $400.000 COP. Reservar con antelación y por periodos más largos (semanas o meses) suele garantizar mejores tarifas.</p>

<p>En conclusión, tu elección dependerá del propósito de tu viaje. Ya sea que vengas por una cirugía, estudios o simplemente a bailar salsa, en <strong>Hospelia</strong> tenemos el espacio ideal esperando por ti.</p>`
  },
  {
    slug: 'mejores-zonas-para-alojarte-en-cali',
    title: 'Las mejores zonas para alojarte en Cali: Sur, Norte y Oeste',
    category: 'zonas',
    date: '2025-01-10',
    excerpt: 'Análisis detallado de los barrios más seguros y estratégicos de Cali. Encuentra tu ubicación ideal según tu estilo de vida.',
    cover: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1920&h=1080&fit=crop',
    coverAlt: 'Vista panorámica desde un apartamento en el oeste de Cali',
    tags: ['zonas', 'barrios', 'sur de cali', 'bochalema', 'ciudad jardin'],
    featured: true,
    content: `<p>Elegir la ubicación correcta es el 90% del éxito de tu viaje. Cali se divide en zonas muy marcadas, cada una con su propia personalidad y ventajas. Aquí te desglosamos las <strong>mejores zonas para alojarte en Cali</strong> para que tomes una decisión informada.</p>

<h3>1. El Sur de Cali: Modernidad y Naturaleza</h3>

<p>Es la zona de mayor expansión y valorización. Aquí encontrarás barrios como <strong>Ciudad Jardín, Pance y Bochalema</strong>.</p>
<ul>
  <li><strong>Ideal para:</strong> Turismo médico (cerca a la Fundación Valle del Lili), estudiantes (cerca a Icesi, Javeriana, Autónoma) y familias que buscan tranquilidad.</li>
  <li><strong>Ventajas:</strong> Centros comerciales modernos (Jardín Plaza, Unicentro), amplias zonas verdes, aire más puro y urbanizaciones cerradas con alta seguridad.</li>
  <li><strong>Hospelia recomienda:</strong> Nuestros <strong>apartamentos en Bochalema</strong> son los más solicitados por su excelente relación calidad-precio y ambiente moderno.</li>
</ul>

<h3>2. El Oeste: Cultura y Gastronomía</h3>

<p>Barrios como <strong>El Peñón, San Antonio y Santa Teresita</strong>.</p>
<ul>
  <li><strong>Ideal para:</strong> Turistas culturales, amantes de la gastronomía y la vida nocturna bohemia.</li>
  <li><strong>Ventajas:</strong> Arquitectura colonial, los mejores restaurantes de la ciudad, brisa fresca de la tarde y cercanía al Gato de Tejada y el Bulevar del Río.</li>
</ul>

<h3>3. El Norte: Negocios y Vida Nocturna</h3>

<p>Barrios como <strong>Granada, Versalles y Juanambú</strong>.</p>
<ul>
  <li><strong>Ideal para:</strong> Viajes de negocios y amantes de la rumba.</li>
  <li><strong>Ventajas:</strong> Cerca al centro financiero, zona rosa de la Avenida 6ta y fácil acceso al aeropuerto.</li>
</ul>

<h3>¿Cuál elegir?</h3>

<p>Si buscas una estancia larga, tranquila y segura, el <strong>Sur de Cali</strong> es sin duda tu mejor opción. La infraestructura es nueva y tendrás todo a la mano. Si vienes por pocos días y quieres fiesta y turismo intenso, el Oeste o el Norte podrían ajustarse mejor. En Hospelia, nos especializamos en el Sur por ser la zona de mayor confort para nuestros huéspedes.</p>`
  },
  {
    slug: 'apartamentos-por-dias-en-cali',
    title: 'Apartamentos por días en Cali: Ventajas y qué debes saber',
    category: 'consejos',
    date: '2025-01-15',
    excerpt: 'Todo lo que necesitas saber antes de rentar un apartamento por días. Evita estafas y asegura tu comodidad.',
    cover: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1920&h=1080&fit=crop',
    coverAlt: 'Interior de apartamento confortable con amenidades completas',
    tags: ['alquiler temporal', 'por dias', 'consejos', 'ahorro'],
    featured: false,
    content: `<p>El mercado de <strong>apartamentos por días en Cali</strong> ha explotado en los últimos años. Plataformas como Airbnb y Booking han popularizado esta modalidad, pero reservar directamente con operadores locales confiables como <strong>Hospelia</strong> te ofrece garantías adicionales. Aquí te contamos por qué esta es la opción inteligente para tu próximo viaje.</p>

<h3>Ventajas del Alquiler Temporal</h3>

<ul>
  <li><strong>Economía para Grupos:</strong> Si viajas con 3 o 4 personas, pagar un hotel se vuelve costoso. Un apartamento te permite dividir gastos sin sacrificar comodidad.</li>
  <li><strong>Cocina Equipada:</strong> Poder preparar tu desayuno o una cena ligera no solo es saludable, sino que reduce drásticamente tu presupuesto de viaje.</li>
  <li><strong>Libertad:</strong> Entras y sales sin pasar por un lobby de hotel, recibes visitas (según las reglas de la propiedad) y te sientes en tu propio espacio.</li>
</ul>

<h3>Qué buscar al reservar</h3>

<p>Para evitar sorpresas desagradables, verifica siempre estos puntos:</p>
<ol>
  <li><strong>Conectividad:</strong> Pregunta por la velocidad del internet. En Hospelia garantizamos conexión estable para teletrabajo.</li>
  <li><strong>Dotación Real:</strong> Asegúrate de que "cocina equipada" incluya ollas, sartenes y utensilios básicos. No hay nada peor que querer cocinar y no tener con qué.</li>
  <li><strong>Reseñas y Verificación:</strong> Desconfía de precios absurdamente bajos en redes sociales. Busca propiedades con reseñas reales o gestionadas por empresas constituidas.</li>
</ol>

<h3>Seguridad ante todo</h3>

<p>Lamentablemente, las estafas en alquileres vacacionales existen. Nunca realices giros a cuentas personales desconocidas sin verificar la propiedad. En Hospelia, ofrecemos múltiples métodos de pago seguros y atención personalizada para que tu única preocupación sea disfrutar de la Sultana del Valle.</p>`
  }
]

export const categories = ['guia', 'zonas', 'consejos']
