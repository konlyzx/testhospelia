import React from 'react';
import Image from 'next/image';

interface HLoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const HLoader: React.FC<HLoaderProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <Image
          src="/favicon.ico"
          alt="Cargando..."
          width={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
          height={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
          className={`${sizeClasses[size]} animate-spin`}
        />
        {/* Agregar un pulse effect para mejor visibilidad */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-500 opacity-20 rounded-full animate-ping`}></div>
      </div>
    </div>
  );
};

export default HLoader; 