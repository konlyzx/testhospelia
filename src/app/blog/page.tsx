import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { posts, categories } from '@/content/blog/posts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import BlogSearch from './search/BlogSearch'
import FeaturedGrid from './components/FeaturedGrid'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Blog de Alojamientos en Cali',
  description: 'Artículos optimizados para SEO local sobre alojamientos en Cali.',
  alternates: { canonical: 'https://hospelia.co/blog' }
}

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Alojamientos en Cali</h1>
          <p className="mt-3 text-lg sm:text-xl text-white/90 max-w-2xl">Guías y consejos optimizados para SEO local sobre hospedaje en Cali.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/alojamientos" className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg">Ver alojamientos</Link>
            <Link href="/contacto" className="px-6 py-3 border border-white/70 text-white font-semibold rounded-lg">Contáctanos</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Artículos destacados</h2>
            <FeaturedGrid />
          </div>
          <aside className="w-full md:w-64 flex-shrink-0">
            <BlogSearch />
            <div className="mt-4 bg-white border rounded-xl shadow-sm">
              <div className="px-4 py-3 font-bold text-gray-900">Categorías</div>
              <ul className="px-2 py-2">
                {categories.map((c) => (
                  <li key={c} className="px-2 py-1">
                    <Link href={`/blog/categoria/${c}`} className="text-blue-700 font-semibold">{c}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Todos los artículos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((p) => (
              <article key={p.slug} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="relative h-40">
                  <Image src={p.cover} alt={p.coverAlt || p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-600">{p.date}</div>
                  <h2 className="text-lg font-bold text-gray-900">{p.title}</h2>
                  <p className="text-sm text-gray-700">{p.excerpt}</p>
                  <div className="pt-2 flex items-center gap-3">
                    <Link href={`/blog/${p.slug}`} className="text-blue-600 font-semibold">Leer artículo</Link>
                    {p.tags && (
                      <div className="text-xs text-gray-600">{p.tags.join(' · ')}</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
