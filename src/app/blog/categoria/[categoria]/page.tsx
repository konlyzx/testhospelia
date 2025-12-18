import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { posts, categories } from '@/content/blog/posts'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return categories.map(c => ({ categoria: c }))
}

export async function generateMetadata({ params }: { params: { categoria: string } }): Promise<Metadata> {
  const title = `Blog categoría: ${params.categoria}`
  const url = `https://hospelia.co/blog/categoria/${params.categoria}`
  return { title, description: 'Artículos por categoría', alternates: { canonical: url } }
}

export default async function BlogCategoryPage(props: { params: Promise<{ categoria: string }> }) {
  const params = await props.params;
  const list = posts.filter(p => p.category === params.categoria)
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categoría: {params.categoria}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((p) => (
            <div key={p.slug} className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="relative h-40">
                <Image src={p.cover} alt={p.coverAlt || p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500">{p.date}</div>
                <h2 className="text-lg font-bold text-gray-900">{p.title}</h2>
                <p className="text-sm text-gray-700">{p.excerpt}</p>
                <div className="pt-2">
                  <Link href={`/blog/${p.slug}`} className="text-blue-600 font-semibold">Leer artículo</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
