import { wasiService } from '@/services/wasi'
import type { Metadata } from 'next'
import Link from 'next/link'
import VisitCounter from '@/app/components/VisitCounter'
import DestinosControls from './Controls'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export const dynamic = 'force-static'
export const dynamicParams = false

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

function slugToQuery(slug: string) {
  const mapping: Record<string, string> = {
    'apartamentos-en-el-sur-de-cali': 'Sur de Cali',
    'apartamentos-por-dias-en-cali': 'Por días Cali',
    'apartamentos-en-bochalema': 'Bochalema Cali',
    'apartamentos-cerca-de-univalle': 'Univalle Cali'
  }
  return mapping[slug] || slug.replace(/-/g, ' ')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = `Destinos: ${params.slug.replace(/-/g,' ')}`
  const url = `https://hospelia.co/destinos/${params.slug}`
  return { title, description: `Explora propiedades en ${title}`, alternates: { canonical: url } }
}

export default async function DestinoSlugPage({ params, searchParams }: { params: { slug: string }, searchParams?: { page?: string, order?: string } }) {
  const page = parseInt(String(searchParams?.page || '1'), 10) || 1
  const take = 12
  const skip = (page - 1) * take
  const order = (searchParams?.order || 'created_at') as 'created_at' | 'sale_price' | 'rent_price' | 'visits'
  const q = slugToQuery(params.slug)
  const res = await wasiService.searchPropertiesByText(q, { scope: 3, id_availability: 1, take, skip, order: 'desc', order_by: order })
  const keys = Object.keys(res).filter(k => !isNaN(parseInt(k)))
  const items = keys.map(k => toDestProperty(res[k]))

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Destinos: {q}</h1>
          <p className="mt-2 text-white/90">Explora propiedades en {q} con filtros y ordenamientos.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Resultados</h2>
        </div>
        <DestinosControls page={page} hasNext={items.length >= take} order={order} basePath={`/destinos/${params.slug}`} />
        {items.length === 0 ? (
          <div className="text-gray-600">No hay propiedades para este destino.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p.codigo_unico} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="relative h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imagen} alt={p.titulo} className="object-cover w-full h-full" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate" title={p.titulo}>{p.titulo}</h3>
                    <span className="text-xs text-gray-500">#{p.codigo_unico}</span>
                  </div>
                  <div className="text-sm text-gray-700">{p.zona && (p.zona + ', ')}{p.ciudad}, {p.region}, {p.pais}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                    <div>Área: {p.area_total} m²</div>
                    <div>Construida: {p.area_construida} m²</div>
                    <div>Alcobas: {p.alcobas}</div>
                    <div>Baños: {p.banos}</div>
                    <div>Parqueaderos: {p.parqueaderos}</div>
                    <div>Estado: {p.estado}</div>
                    <div>Disponibilidad: {p.disponibilidad}</div>
                    <div>Tipo: {p.tipo}</div>
                  </div>
                  <div className="text-xs text-gray-500">Encargado: {p.encargado}</div>
                  <div className="flex items-center justify-between pt-2">
                    <Link href={`/propiedad/${p.titulo.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-')}-${p.codigo_unico}`} className="text-blue-600 font-semibold">Ver detalle</Link>
                    <VisitCounter id={p.codigo_unico} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <DestinosControls page={page} hasNext={items.length >= take} order={order} basePath={`/destinos/${params.slug}`} />
      </div>
      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  return [
    { slug: 'apartamentos-en-el-sur-de-cali' },
    { slug: 'apartamentos-por-dias-en-cali' },
    { slug: 'apartamentos-en-bochalema' },
    { slug: 'apartamentos-cerca-de-univalle' }
  ]
}
