import { wasiService } from '@/services/wasi'
import type { Metadata } from 'next'
import Link from 'next/link'
import VisitCounter from '@/app/components/VisitCounter'
import PaginationControls from '@/app/components/ui/PaginationControls'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

const FIELDS_MAX = 255

type DestProperty = {
  codigo_unico: number
  titulo: string
  pais: string
  region: string
  ciudad: string
  zona: string
  area_total: number
  area_construida: number
  alcobas: number
  banos: number
  parqueaderos: number
  estado: string
  disponibilidad: string
  tipo: string
  encargado: string
  imagen: string
}

function toDestProperty(p: any): DestProperty {
  const text = (s: any) => String(s || '').slice(0, FIELDS_MAX)
  const num = (n: any) => {
    const v = parseInt(String(n || '0'), 10)
    return Number.isFinite(v) ? v : 0
  }
  return {
    codigo_unico: num(p?.id_property),
    titulo: text(p?.title),
    pais: text(p?.country_label || 'Colombia'),
    region: text(p?.region_label || ''),
    ciudad: text(p?.city_label || ''),
    zona: text(p?.zone_label || ''),
    area_total: num(p?.area),
    area_construida: num(p?.built_area),
    alcobas: num(p?.bedrooms),
    banos: num(p?.bathrooms),
    parqueaderos: num(p?.garages),
    estado: text(p?.property_condition_label || ''),
    disponibilidad: text(p?.availability_label || ''),
    tipo: text(p?.property_type_label || ''),
    encargado: text(p?.user_label || 'Hospelia'),
    imagen: p?.main_image?.url_original || p?.main_image?.url_big || p?.main_image?.url || '/zona-default.jpg'
  }
}

export const metadata: Metadata = {
  title: 'Todas las Propiedades | Hospelia',
  description: 'Explora todas nuestras propiedades disponibles en distintas zonas de Cali. Encuentra el hogar perfecto para ti con acabados de lujo y totalmente amoblado.',
  alternates: { canonical: 'https://hospelia.co/propiedades' }
}

export default async function PropertiesPage(props: { searchParams: Promise<{ page?: string, order?: string }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt(String(searchParams?.page || '1'), 10) || 1
  const take = 12
  const skip = (page - 1) * take
  const order = (searchParams?.order || 'created_at') as 'created_at' | 'sale_price' | 'rent_price' | 'visits'
  
  // Usar searchProperties para obtener todas las propiedades
  const res = await wasiService.searchProperties({ 
    scope: 3, 
    id_availability: 1, 
    take, 
    skip, 
    order: 'desc', 
    order_by: order 
  })
  
  const keys = Object.keys(res).filter(k => !isNaN(parseInt(k)))
  const items = keys.map(k => toDestProperty(res[k]))

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: p.titulo,
      url: `https://hospelia.co/propiedad/${p.titulo.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')}-${p.codigo_unico}`
    }))
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      {/* Schema.org ItemList */}
      <Script
        id="schema-itemlist-propiedades"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />

      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white min-h-[80vh] flex items-center relative">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Todas las Propiedades</h1>
          <p className="mt-2 text-white/90">Explora nuestra selección completa de alojamientos amoblados en Cali.</p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Resultados ({res.total || 0})</h2>
        </div>
        
        <PaginationControls page={page} hasNext={items.length >= take} order={order} basePath="/propiedades" />
        
        {items.length === 0 ? (
          <div className="text-gray-600 text-center py-10">No hay propiedades disponibles en este momento.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p.codigo_unico} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imagen} alt={p.titulo} className="object-cover w-full h-full" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-blue-600">
                    {p.tipo}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate flex-1" title={p.titulo}>{p.titulo}</h3>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {p.zona && (p.zona + ', ')}{p.ciudad}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900">{p.alcobas}</span>
                      <span className="text-gray-500">Hab</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-gray-200">
                      <span className="font-bold text-gray-900">{p.banos}</span>
                      <span className="text-gray-500">Baños</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-gray-200">
                      <span className="font-bold text-gray-900">{p.area_total}</span>
                      <span className="text-gray-500">m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <Link 
                      href={`/propiedad/${p.titulo.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')}-${p.codigo_unico}`} 
                      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Ver detalle
                    </Link>
                    <VisitCounter id={p.codigo_unico} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8">
            <PaginationControls page={page} hasNext={items.length >= take} order={order} basePath="/propiedades" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
