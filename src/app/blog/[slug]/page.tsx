import type { Metadata } from 'next'
import { posts } from '@/content/blog/posts'
import Image from 'next/image'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaLinkedin, FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return null

  const relatedPosts = posts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2)

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors">
            <FaArrowLeft className="mr-2" /> Volver al blog
          </Link>

          {/* Header */}
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-500">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium uppercase tracking-wide text-xs border border-blue-100">
                <FaTag className="mr-1.5 w-3 h-3" />
                {post.category}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-1.5 w-3 h-3" />
                {post.date}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-12 ring-1 ring-gray-900/5">
            <Image
              src={post.cover}
              alt={post.coverAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg prose-blue mx-auto text-gray-800 leading-loose [&>p:first-of-type::first-letter]:text-7xl [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-gray-900 [&>p:first-of-type::first-letter]:mr-3 [&>p:first-of-type::first-letter]:float-left"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">¿Te gustó este artículo? Compártelo</h3>
            <div className="flex justify-center gap-4">
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}`}
                target="_blank"
                className="flex items-center justify-center w-12 h-12 bg-[#1877F2] text-white rounded-full hover:bg-[#166fe5] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-200"
                aria-label="Compartir en Facebook"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                className="flex items-center justify-center w-12 h-12 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1a91da] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-200"
                aria-label="Compartir en Twitter"
              >
                <FaTwitter size={24} />
              </Link>
              <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://hospelia.co/blog/' + post.slug)}`}
                target="_blank"
                className="flex items-center justify-center w-12 h-12 bg-[#0A66C2] text-white rounded-full hover:bg-[#0958a8] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-200"
                aria-label="Compartir en LinkedIn"
              >
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Artículos relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(rp => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block h-full">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={rp.cover} 
                        alt={rp.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-blue-600">
                        {rp.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs text-gray-500 mb-2">{rp.date}</div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {rp.title}
                      </h4>
                      <p className="text-gray-600 line-clamp-2 text-sm flex-1">
                        {rp.excerpt}
                      </p>
                      <div className="mt-4 text-blue-600 font-semibold text-sm flex items-center">
                        Leer artículo <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Script id="schema-blogposting" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: [post.cover], datePublished: post.date, mainEntityOfPage: { '@type': 'WebPage', '@id': `https://hospelia.co/blog/${post.slug}` } }) }} />
      <Footer />
    </div>
  )
}
