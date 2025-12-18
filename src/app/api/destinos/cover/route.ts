import { NextRequest, NextResponse } from 'next/server'
import { wasiService } from '@/services/wasi'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function slugToQuery(slug: string) {
  const mapping: Record<string, string> = {
    'apartamentos-en-el-sur-de-cali': 'Sur de Cali',
    'apartamentos-por-dias-en-cali': 'Por días Cali',
    'apartamentos-en-bochalema': 'Bochalema Cali',
    'apartamentos-cerca-de-univalle': 'Univalle Cali'
  }
  return mapping[slug] || slug.replace(/-/g, ' ')
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug') || ''
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }
    const q = slugToQuery(slug)
    const res = await wasiService.searchPropertiesByText(q, { scope: 3, id_availability: 1, take: 12, order: 'desc', order_by: 'created_at' })
    const keys = Object.keys(res).filter(k => !isNaN(parseInt(k)))
    let imageUrl = '/zona-default.jpg'
    for (const k of keys) {
      const p: any = res[k]
      const main = p?.main_image?.url_original || p?.main_image?.url_big || p?.main_image?.url
      if (main) { imageUrl = main; break }
      const galleries = p?.galleries ? Object.values(p.galleries) : []
      const found = (galleries as any[]).find((g: any) => g && (g.url_original || g.url_big || g.url))
      if (found) { imageUrl = (found.url_original || found.url_big || found.url); break }
    }
    const resp = NextResponse.json({ imageUrl })
    resp.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return resp
  } catch (e: any) {
    return NextResponse.json({ error: 'failed', details: e?.message }, { status: 500 })
  }
}

