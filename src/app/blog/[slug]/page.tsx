import type { Metadata } from 'next'
import { posts } from '@/content/blog/posts'
import Image from 'next/image'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'
import Link from 'next/link'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find(p => p.slug === params.slug)
  const title = post?.title || 'Artículo'
  const description = post?.excerpt || 'Alojamientos en Cali'
  const url = `https://hospelia.co/blog/${params.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', images: post?.cover ? [post.cover] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: post?.cover ? [post.cover] : undefined }
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return null
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative h-60 rounded-xl overflow-hidden mb-6">
          <Image src={post.cover} alt={post.coverAlt || post.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 60vw" />
        </div>
        <div className="text-xs text-gray-600">{post.date} · {post.category}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>
        <div className="prose max-w-none text-gray-900">
          <p>{post.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}`} target="_blank" className="text-blue-600">Compartir en Facebook</Link>
          <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}&text=${encodeURIComponent(post.title)}`} target="_blank" className="text-blue-600">Compartir en X</Link>
          <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}`} target="_blank" className="text-blue-600">Compartir en LinkedIn</Link>
        </div>
      </div>
      <Script id="schema-blogposting" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: [post.cover], datePublished: post.date, mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hospelia.co/blog/${post.slug}` } }) }} />
      <Footer />
    </div>
  )
}
