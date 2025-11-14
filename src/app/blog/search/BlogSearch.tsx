"use client";

import { useState } from 'react'
import { posts } from '@/content/blog/posts'
import Link from 'next/link'

export default function BlogSearch() {
  const [q, setQ] = useState('')
  const results = q
    ? posts.filter(p => (p.title + ' ' + p.excerpt + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q.toLowerCase()))
    : []
  return (
    <div className="relative w-full sm:w-80">
      <label htmlFor="blog-search" className="sr-only">Buscar artículos</label>
      <input id="blog-search" name="blog-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar artículos" className="w-full px-3 py-2 border rounded-md text-sm" />
      {q && (
        <div className="absolute z-10 left-0 right-0 mt-2 bg-white border rounded-md shadow-lg max-h-64 overflow-auto">
          {results.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">Sin resultados</div>
          ) : results.map(r => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="block p-3 text-sm text-gray-900 hover:bg-gray-50">
              {r.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
