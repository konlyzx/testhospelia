import Link from 'next/link';
import VisitCounter from '@/app/components/VisitCounter';
import { DestProperty } from '@/utils/propertyUtils';

interface PropertyCardProps {
  property: DestProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    codigo_unico,
    titulo,
    ciudad,
    zona,
    alcobas,
    banos,
    area_total,
    imagen,
    tipo,
    precio_venta,
    precio_alquiler,
    moneda_venta,
    moneda_alquiler,
  } = property;

  const slug = `${titulo
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')}-${codigo_unico}`;

  const formatPrice = (price: number, currency: string) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice =
    precio_venta > 0
      ? formatPrice(precio_venta, moneda_venta)
      : precio_alquiler > 0
      ? formatPrice(precio_alquiler, moneda_alquiler) + '/mes'
      : 'Consultar precio';

  const isSale = precio_venta > 0;
  const isRent = precio_alquiler > 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <Link href={`/propiedad/${slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
           <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
             isSale ? 'bg-green-500 text-white' : isRent ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'
           }`}>
             {tipo}
           </span>
           {(isSale || isRent) && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {isSale ? 'Venta' : 'Alquiler'}
              </span>
           )}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-500 text-white shadow-lg scale-110"
                    : "bg-white/90 text-gray-600 hover:bg-white hover:scale-105"
                } backdrop-blur-sm shadow-md hover:shadow-lg`}
              >
                <HeartIcon
                  size={18}
                  filled={isFavorite}
                  className={isFavorite ? "text-white" : "text-gray-600"}
                />
              </button>
            )}
        </div>
        <div className="absolute bottom-3 right-3">
             <span className="bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-lg text-sm font-extrabold shadow-lg">
                {displayPrice}
             </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
            <Link href={`/propiedad/${slug}`} className="block">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors" title={titulo}>
                {titulo}
                </h3>
            </Link>
            
            <div className="flex items-center text-gray-500 mb-4 text-sm">
                <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">
                {zona ? `${zona}, ` : ''}{ciudad}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700 font-bold">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {alcobas}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">Habitaciones</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700 font-bold">
                         <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {banos}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">Baños</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-700 font-bold">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {area_total}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">m²</span>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <VisitCounter id={codigo_unico} />
            <Link
                href={`/propiedad/${slug}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform"
            >
                Ver detalles
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
      </div>
    </div>
  );
}
