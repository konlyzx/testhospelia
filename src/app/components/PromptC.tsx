import React from 'react';

export default function PromptC() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Tu rincón ideal ⚡
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Teclea dónde quieres vivir y descubre lofts, estudios y apartaestudios en segundos.
        </p>
      </div>
      
      <div className="w-full">
        <div className="flex flex-col md:flex-row w-full gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <input 
            type="text" 
            placeholder="Zona, precio o tipo…" 
            className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors">
            ¡Muéstrame!
          </button>
        </div>
      </div>
    </div>
  );
} 