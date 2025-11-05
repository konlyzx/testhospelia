import React from 'react';
import Image from 'next/image';

interface DummyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function DummyImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  priority = false,
  fill = false,
  sizes,
  style
}: DummyImageProps) {
  // Comprobamos si la ruta de la imagen es una de las que necesitamos reemplazar
  const isDummyImage = src.startsWith('/') && 
    !src.startsWith('/next') && 
    !src.startsWith('/vercel') && 
    !src.startsWith('/globe') && 
    !src.startsWith('/file') && 
    !src.startsWith('/window');
  
  if (isDummyImage) {
    // Si es una imagen que necesitamos reemplazar, devolvemos un div con un color de fondo y un ícono
    if (fill) {
      return (
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${className}`} style={style}>
          <svg className="w-1/4 h-1/4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
          {alt && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{alt}</span>}
        </div>
      );
    }
    
    return (
      <div 
        className={`relative bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-lg overflow-hidden ${className}`}
        style={{width: width || '100%', height: height || 'auto', ...style}}
      >
        <svg className="w-1/4 h-1/4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
        </svg>
        {alt && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{alt}</span>}
      </div>
    );
  }
  
  // Si no es una de nuestras imágenes dummy, pasamos la imagen normal
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        style={{ objectFit: "cover", ...style }}
      />
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={style}
    />
  );
} 