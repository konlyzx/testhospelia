import Link from 'next/link';
import { DestProperty } from '@/utils/propertyUtils';
import HeartIcon from '@/app/components/HeartIcon';

interface PropertyListItemProps {
  property: DestProperty;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function PropertyListItem({ property, isFavorite, onToggleFavorite }: PropertyListItemProps) {
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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col sm:flex-row h-auto sm:h-56 mb-6 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative w-full sm:w-72 h-48 sm:h-full flex-shrink-0">
        <Link href={`/propiedad/${slug}`} className="block w-full h-full">
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
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
             <div>
                <Link href={`/propiedad/${slug}`} className="block">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors" title={titulo}>
                    {titulo}
                    </h3>
                </Link>
                <div className="flex items-center text-gray-500 mb-3 text-sm">
                    <svg className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">
                    {zona ? `${zona}, ` : ''}{ciudad}
                    </span>
                </div>
             </div>
             <div className="hidden sm:block text-right">
                <span className="bg-gray-50 text-gray-900 px-3 py-1.5 rounded-lg text-lg font-extrabold">
                    {displayPrice}
                </span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mt-2">
              <div className="flex items-center text-gray-700">
                   <span className="font-bold mr-1">{alcobas}</span> <span className="text-sm text-gray-500">Habitaciones</span>
              </div>
              <div className="flex items-center text-gray-700">
                   <span className="font-bold mr-1">{banos}</span> <span className="text-sm text-gray-500">Baños</span>
              </div>
              <div className="flex items-center text-gray-700">
                   <span className="font-bold mr-1">{area_total}</span> <span className="text-sm text-gray-500">m²</span>
              </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4 sm:mt-0">
             <span className="sm:hidden text-lg font-extrabold text-gray-900">
                {displayPrice}
             </span>
             <Link
                href={`/propiedad/${slug}`}
                className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ml-auto"
            >
                Ver detalles
            </Link>
        </div>
      </div>
    </div>
  );
}
