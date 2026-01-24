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
    slug: 'predicciones-viaje-2026-hospedaje-colombia',
    title: 'Predicciones de Viaje 2026: Cómo cambiará el hospedaje en Colombia',
    category: 'tendencias',
    date: '2026-01-24',
    excerpt: 'Las predicciones de viaje para 2026 revelan cómo el alquiler de apartamentos amoblados en Colombia superará a hoteles tradicionales. Análisis, comparativas y recomendaciones.',
    cover: 'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?q=80&w=2670&auto=format&fit=crop',
    coverAlt: 'Vista panorámica de ciudad colombiana desde un apartamento amoblado moderno',
    tags: ['predicciones de viaje 2026', 'apartamentos amoblados Colombia', 'tendencias turismo 2026', 'nómadas digitales'],
    featured: true,
    content: `
    <div class="space-y-8 text-gray-800 leading-relaxed">
      <p class="text-xl md:text-2xl font-light text-gray-600 border-l-4 border-blue-500 pl-4 italic">
        "En 2026, viajar ya no se trata solo de dormir en un lugar. Los viajeros buscan flexibilidad, experiencias auténticas y espacios que se adapten a su ritmo."
      </p>

      <p>
        La industria del turismo en Colombia está atravesando su transformación más profunda en décadas. Lo que antes era una elección binaria entre "hotel de lujo" o "hostal económico" se ha fragmentado en un abanico de opciones donde la <strong>experiencia de vida</strong> prima sobre el servicio de habitación.
      </p>
      
      <p>
        Para el año 2026, las predicciones son claras: la línea entre "viajar" y "vivir" se borrará. Los nómadas digitales, las familias en "workations" y los turistas médicos no buscan un lobby con recepcionista; buscan una cocina equipada, internet de alta velocidad y la sensación de llegar a su propio hogar en Cali o Medellín. En este contexto, <a href="/" class="text-blue-600 hover:text-blue-800 font-bold underline decoration-2 decoration-blue-200 hover:decoration-blue-600 transition-all">Hospelia.co</a> se posiciona no solo como una plataforma, sino como el estándar de calidad para esta nueva era.
      </p>

      <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-6 flex items-center">
        <span class="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg">1</span>
        Tendencia Global: El fin de las reservas rígidas
      </h3>
      
      <p>
        Las búsquedas de viajes de último minuto y las estancias de duración indefinida han crecido un <strong>40% interanual</strong>. El viajero de 2026 prioriza la espontaneidad. Ya no se planifican vacaciones de 15 días exactos con seis meses de antelación. Ahora, vemos:
      </p>
      
      <ul class="list-disc pl-6 space-y-2 marker:text-blue-500">
        <li><strong>Micro-escapadas:</strong> Fines de semana largos decididos el miércoles anterior.</li>
        <li><strong>Estancias Híbridas:</strong> Ejecutivos que extienden su viaje de negocios por dos semanas para trabajar remotamente.</li>
        <li><strong>Turismo Lento (Slow Travel):</strong> Viajeros que se quedan 1 o 2 meses en una ciudad para absorber realmente su cultura.</li>
      </ul>

      <p class="mb-8">
        Esto favorece enormemente a los alojamientos flexibles. Un hotel tradicional, con sus tarifas rígidas y falta de cocina, simplemente no puede competir con un apartamento amoblado cuando la estancia supera las 4 noches.
      </p>

      <div class="my-10 overflow-hidden border border-gray-200 rounded-xl shadow-lg bg-white">
        <h3 class="text-xl font-bold bg-gray-50 p-4 border-b border-gray-200">
          <span class="bg-blue-100 text-blue-600 rounded-lg px-2 py-1 text-sm mr-2">Comparativa</span>
          Hotel vs Airbnb vs Hospelia
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <th class="p-4 font-semibold text-sm uppercase tracking-wider">Factor</th>
                <th class="p-4 font-semibold text-sm uppercase tracking-wider">Hotel Tradicional</th>
                <th class="p-4 font-semibold text-sm uppercase tracking-wider">Airbnb Genérico</th>
                <th class="p-4 font-semibold text-sm uppercase tracking-wider bg-blue-600">Experiencia Hospelia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">Flexibilidad de fechas</td>
                <td class="p-4 text-gray-600">Baja (Check-in estricto)</td>
                <td class="p-4 text-gray-600">Media</td>
                <td class="p-4 text-blue-700 font-semibold bg-blue-50/30">Alta y personalizada</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">Espacio y privacidad</td>
                <td class="p-4 text-gray-600">Limitado (Solo habitación)</td>
                <td class="p-4 text-gray-600">Variable (Sorpresas)</td>
                <td class="p-4 text-blue-700 font-semibold bg-blue-50/30">Amplio y 100% verificado</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">Ideal estancias largas</td>
                <td class="p-4 text-gray-600">No (Costoso e incómodo)</td>
                <td class="p-4 text-gray-600">A veces</td>
                <td class="p-4 text-blue-700 font-semibold bg-blue-50/30">Sí (Diseñado para vivir)</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">Soporte al cliente</td>
                <td class="p-4 text-gray-600">Recepción física</td>
                <td class="p-4 text-gray-600">Limitado (Solo chat)</td>
                <td class="p-4 text-blue-700 font-semibold bg-blue-50/30">Agentes locales 24/7</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="p-4 font-medium text-gray-900">Confiabilidad</td>
                <td class="p-4 text-gray-600">Alta</td>
                <td class="p-4 text-gray-600">Variable</td>
                <td class="p-4 text-blue-700 font-semibold bg-blue-50/30">Garantizada (Propiedades Premium)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center">
        <span class="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg">3</span>
        Colombia en el radar global 2026
      </h3>
      
      <p>
        Colombia no es una moda pasajera; es un destino que ha madurado. Ciudades como <strong>Medellín, Bogotá, Cali y Cartagena</strong> ofrecen una infraestructura que rivaliza con grandes capitales, pero a un costo de vida significativamente menor.
      </p>
      
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h4 class="font-bold text-gray-900 mb-2 text-lg">🇨🇴 Para el Nómada Digital</h4>
          <p class="text-sm text-gray-600">Con la nueva visa de nómada digital, el país espera recibir más de 100,000 trabajadores remotos en 2026. Hospelia atiende esta demanda con apartamentos que garantizan <strong>zonas de trabajo ergonómicas y fibra óptica</strong>.</p>
        </div>
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h4 class="font-bold text-gray-900 mb-2 text-lg">🏥 Para el Turismo Médico</h4>
          <p class="text-sm text-gray-600">Cali sigue liderando en cirugía estética y odontología. Estos pacientes requieren recuperación en ambientes privados, tranquilos y accesibles (sin escaleras, baños adaptados), algo que los hoteles estándar no siempre ofrecen.</p>
        </div>
      </div>

      <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
        Recomendaciones estratégicas
      </h3>
      
      <p class="mb-6">Si planeas visitar Colombia en 2026, tu elección de alojamiento definirá el éxito de tu viaje. Hemos categorizado las mejores opciones según tu perfil:</p>

      <div class="my-8 overflow-hidden border border-gray-200 rounded-xl shadow-md bg-white">
         <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-blue-50 text-blue-900">
                <th class="p-4 font-bold border-b border-blue-100">Tipo de viajero</th>
                <th class="p-4 font-bold border-b border-blue-100">Prioridad Principal</th>
                <th class="p-4 font-bold border-b border-blue-100">Nuestra Recomendación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="p-4 font-semibold text-gray-800">Turista Internacional</td>
                <td class="p-4 text-gray-600">Seguridad y Experiencia Local</td>
                <td class="p-4 text-blue-600 font-medium">Apartamento en zona gastronómica (Granada, El Peñón)</td>
              </tr>
              <tr>
                <td class="p-4 font-semibold text-gray-800">Nómada Digital</td>
                <td class="p-4 text-gray-600">Conectividad y Comunidad</td>
                <td class="p-4 text-blue-600 font-medium">Loft moderno con coworking cercano</td>
              </tr>
              <tr>
                <td class="p-4 font-semibold text-gray-800">Viaje Corporativo</td>
                <td class="p-4 text-gray-600">Eficiencia y Facturación</td>
                <td class="p-4 text-blue-600 font-medium">Apartamentos Corporativos Hospelia (Sur de Cali)</td>
              </tr>
              <tr>
                <td class="p-4 font-semibold text-gray-800">Familias</td>
                <td class="p-4 text-gray-600">Cocina y Lavandería</td>
                <td class="p-4 text-blue-600 font-medium">Apartamento de 3 habitaciones en conjunto cerrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-6 flex items-center">
        <span class="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg">5</span>
        ¿Por qué Hospelia es el futuro?
      </h3>
      
      <p>
        A diferencia de los marketplaces masivos donde cualquiera puede subir una propiedad, <strong>Hospelia cura su portafolio</strong>. Entendemos que en 2026, el lujo no es necesariamente el mármol en el piso, sino la certeza de que el internet funciona, las sábanas están impecables y hay alguien a quien llamar si necesitas ayuda.
      </p>

      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white mt-12 shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-white/10 transform -skew-y-3 group-hover:skew-y-0 transition-transform duration-700"></div>
        <h3 class="text-3xl font-bold mb-4 relative z-10">¿Listo para vivir la experiencia 2026 hoy?</h3>
        <p class="text-blue-100 mb-8 max-w-xl mx-auto text-lg relative z-10">No esperes al futuro. Descubre nuestra colección exclusiva de apartamentos amoblados en las mejores zonas de Colombia.</p>
        <a href="/" class="relative z-10 inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300">
          Explorar Apartamentos
        </a>
      </div>
    </div>`
  },
  {
    slug: 'inversion-alquiler-apartamentos-amoblados-colombia',
    title: 'Inversión y Alquiler de Apartamentos Amoblados en Colombia: Guía 2025',
    category: 'inversion',
    date: '2026-01-24',
    excerpt: 'Descubre cómo el mercado de apartamentos amoblados en Colombia está transformando las inversiones inmobiliarias. Guía para propietarios y viajeros.',
    cover: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop',
    coverAlt: 'Apartamento amoblado de lujo con vista a la ciudad',
    tags: ['inversion', 'bienes raices', 'renta corta', 'colombia', 'negocios'],
    featured: true,
    content: `<p>El mercado inmobiliario en Colombia está viviendo una revolución impulsada por el turismo y los nómadas digitales. La demanda de <strong>apartamentos amoblados para alquiler y venta</strong> ha crecido exponencialmente, convirtiéndose en una de las opciones de inversión más rentables del momento. En esta guía, exploramos por qué este modelo es el futuro y cómo <a href="/">Hospelia.co</a> se posiciona como tu mejor aliado.</p>

<h3>El Auge de la Renta Corta en Colombia</h3>

<p>Ciudades como Cali, Medellín y Bogotá se han posicionado en el radar internacional. Ya no solo se busca un hotel; los viajeros prefieren la experiencia local y la comodidad que ofrecen los <strong>apartamentos amoblados</strong>. Esto ha abierto una oportunidad de oro para propietarios que desean monetizar sus activos a través de plataformas digitales, pero con una gestión profesional.</p>

<h3>Ventajas de Alquilar tu Propiedad Amoblada</h3>

<ul>
  <li><strong>Mayor Rentabilidad:</strong> La renta corta puede generar hasta un 40% más de ingresos comparado con el alquiler tradicional a largo plazo.</li>
  <li><strong>Flexibilidad de Uso:</strong> Como propietario, puedes reservar fechas para tu uso personal o para vender el inmueble sin estar atado a contratos de años.</li>
  <li><strong>Mantenimiento Constante:</strong> Al tener rotación de huéspedes y limpieza profesional frecuente, tu inmueble se mantiene en mejores condiciones que con un inquilino fijo descuidado.</li>
</ul>

<h3>Venta de Apartamentos Amoblados: Inversión "Llave en Mano"</h3>

<p>Cada vez más inversionistas buscan comprar propiedades que ya estén generando ingresos. Vender un apartamento amoblado y con historial de reservas en plataformas es un valor agregado inmenso. En <strong>Hospelia</strong>, conectamos vendedores con inversionistas que buscan negocios listos para operar desde el día uno.</p>

<h3>¿Por qué gestionar con Hospelia?</h3>

<p>Administrar una propiedad a distancia o sin experiencia puede ser un dolor de cabeza. Nosotros nos encargamos de todo:</p>

<ol>
  <li><strong>Atención al Huésped 24/7:</strong> Garantizamos respuestas rápidas y soluciones efectivas para asegurar reseñas de 5 estrellas.</li>
  <li><strong>Mantenimiento y Limpieza:</strong> Coordinamos todo para que tu apartamento siempre esté impecable.</li>
</ol>

<p>Si estás pensando en invertir en <strong>bienes raíces en Colombia</strong> o ya tienes una propiedad y quieres maximizar sus ingresos, el alquiler de apartamentos amoblados es el camino. <a href="/contacto">Contáctanos hoy en Hospelia</a> y llevemos tu inversión al siguiente nivel.</p>`
  },
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

export const categories = ['guia', 'zonas', 'consejos', 'inversion', 'tendencias']
