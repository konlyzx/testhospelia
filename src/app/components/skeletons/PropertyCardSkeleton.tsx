import React from 'react';

interface PropertyCardSkeletonProps {
  count?: number;
}

const PropertyCardSkeleton = ({ count = 1 }: PropertyCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          role="status"
          aria-label="Cargando propiedad"
        >
          {/* Imagen skeleton */}
          <div className="h-56 bg-gray-200" />
          
          {/* Contenido skeleton */}
          <div className="p-5 space-y-3">
            {/* Precio y tipo */}
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-16" />
            </div>
            
            {/* Título */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            
            {/* Línea divisoria */}
            <div className="h-0.5 bg-gray-200 rounded w-16" />
            
            {/* Características */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
            </div>
            
            {/* Botón */}
            <div className="h-10 bg-gray-200 rounded-full w-full mt-4" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyCardSkeleton;

// Grid de skeletons
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton para filtros
export function FiltersSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md sticky top-20 animate-pulse">
      <div className="bg-gray-300 h-6 w-16 rounded mb-4"></div>
      
      {/* Zonas skeleton */}
      <div className="mb-6">
        <div className="bg-gray-300 h-5 w-12 rounded mb-2"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-gray-300 h-4 w-4 rounded mr-2"></div>
              <div className="bg-gray-300 h-4 w-24 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Precio skeleton */}
      <div className="mb-6">
        <div className="bg-gray-300 h-5 w-16 rounded mb-2"></div>
        <div className="space-y-3">
          <div>
            <div className="bg-gray-300 h-4 w-12 rounded mb-1"></div>
            <div className="bg-gray-300 h-2 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-20 rounded mt-1"></div>
          </div>
          <div>
            <div className="bg-gray-300 h-4 w-12 rounded mb-1"></div>
            <div className="bg-gray-300 h-2 w-full rounded"></div>
            <div className="bg-gray-300 h-4 w-20 rounded mt-1"></div>
          </div>
        </div>
      </div>
      
      {/* Habitaciones skeleton */}
      <div className="mb-6">
        <div className="bg-gray-300 h-5 w-20 rounded mb-2"></div>
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-300 h-8 w-12 rounded-full"></div>
          ))}
        </div>
      </div>
      
      {/* Botón reset skeleton */}
      <div className="bg-gray-300 h-10 w-full rounded-lg"></div>
    </div>
  );
} 