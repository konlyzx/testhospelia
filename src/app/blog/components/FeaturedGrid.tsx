import Image from 'next/image'
import Link from 'next/link'
import { posts } from '@/content/blog/posts'

export default function FeaturedGrid() {
  const featured = posts.filter(p => p.featured)
  const first = featured[0]
  const rest = featured.slice(1)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {first && (
        <article className="md:col-span-2 border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-60 md:h-80">
            <Image src={first.cover} alt={first.coverAlt || first.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 66vw" />
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-600">{first.date} · {first.category}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{first.title}</h2>
            <p className="text-sm text-gray-700">{first.excerpt}</p>
            <div className="pt-2">
              <Link href={`/blog/${first.slug}`} className="text-blue-600 font-semibold">Leer artículo</Link>
            </div>
          </div>
        </article>
      )}
      {rest.map(p => (
        <article key={p.slug} className="border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-40">
            <Image src={p.cover} alt={p.coverAlt || p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-600">{p.date} · {p.category}</div>
            <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
            <p className="text-sm text-gray-700">{p.excerpt}</p>
            <div className="pt-2">
              <Link href={`/blog/${p.slug}`} className="text-blue-600 font-semibold">Leer artículo</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

