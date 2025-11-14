"use client";

import React from 'react'

export default function DestinosControls({
  page,
  hasNext,
  order,
  basePath
}: {
  page: number
  hasNext: boolean
  order: 'created_at' | 'sale_price' | 'rent_price' | 'visits'
  basePath: string
}) {
  const setOrder = (o: string) => {
    const sp = new URLSearchParams(window.location.search)
    sp.set('order', o)
    sp.set('page', '1')
    window.location.search = sp.toString()
  }
  const prev = () => {
    const p = Math.max(1, page - 1)
    const sp = new URLSearchParams(window.location.search)
    sp.set('page', String(p))
    window.location.search = sp.toString()
  }
  const next = () => {
    const p = page + 1
    const sp = new URLSearchParams(window.location.search)
    sp.set('page', String(p))
    window.location.search = sp.toString()
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordenar:</span>
        <div className="relative">
          <label htmlFor="order" className="sr-only">Orden</label>
          <select id="order" name="order" defaultValue={order} onChange={(e) => setOrder(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-gray-900 min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 appearance-none pr-10">
            <option value="created_at">Más recientes</option>
            <option value="rent_price">Precio renta</option>
            <option value="sale_price">Precio venta</option>
            <option value="visits">Visitas</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 border rounded-md" disabled={page<=1} onClick={prev}>Anterior</button>
        <button className="px-4 py-2 border rounded-md" disabled={!hasNext} onClick={next}>Siguiente</button>
      </div>
    </div>
  )
}

