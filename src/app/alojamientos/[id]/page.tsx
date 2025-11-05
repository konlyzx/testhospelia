"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import Image from "next/image";
import ReviewsSection from "../../components/ReviewsSection";
import { getPropertyById, WordPressProperty } from "../../../services/wordpress";

export default function AlojamientoDetalle() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 5))
  });
  const [huespedes, setHuespedes] = useState(2);
  const [property, setProperty] = useState<WordPressProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  // Imágenes adicionales para la galería (simuladas)
  const galleryImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("ID de alojamiento no válido");
          setLoading(false);
          return;
        }
        
        // Usar el servicio de WordPress para obtener una propiedad por ID
        const data = await getPropertyById(Number(id));
        
        if (!data) {
          setError("Alojamiento no encontrado");
          setLoading(false);
          return;
        }
        
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError("Error al cargar los detalles. Por favor, inténtalo de nuevo.");
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Función para manejar la reserva
  const handleReserva = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    // Aquí se implementaría la lógica para procesar la reserva
    alert(`Reserva realizada exitosamente para ${huespedes} huéspedes del ${format(dateRange.from, 'dd/MM/yyyy')} al ${format(dateRange.to, 'dd/MM/yyyy')}`);
  };

  // Calcular el total de la reserva
  const calcularTotal = () => {
    if (!dateRange?.from || !dateRange?.to || !property?.acf?.price) return 0;
    
    const dias = differenceInDays(dateRange.to, dateRange.from) + 1;
    return property.acf.price * dias;
  };

  // Crear un alojamiento fallback en caso de que no haya datos
  const alojamiento = property ? {
    id: property.id,
    titulo: property.title.rendered,
    ubicacion: property.acf?.location || "Ubicación no disponible",
    precio: property.acf?.price || 150,
    puntuacion: property.acf?.rating || 4.7,
    imagen: property.featured_media_url || galleryImages[0],
    descripcion: property.content.rendered || "Sin descripción disponible",
    caracteristicas: [
      `${property.acf?.guests || 2} huéspedes`,
      `${property.acf?.bedrooms || 1} habitaciones`,
      `${property.acf?.bathrooms || 1} baños`
    ],
    categoria: property.acf?.category || "Sin categoría",
    comodidades: property.acf?.features || [
      "Wifi gratis", 
      "Cocina completa", 
      "Estacionamiento gratuito", 
      "TV con Netflix", 
      "Aire acondicionado"
    ],
    normas: [
      "No se permiten mascotas",
      "No fumar",
      "No fiestas o eventos",
      "Check-in: 15:00 - 22:00",
      "Check-out: 11:00"
    ],
    ubicacionMapa: {
      lat: 25.7617,
      lng: -80.1918
    }
  } : null;

  // Crear la lista completa de imágenes para la galería
  const allImages = alojamiento ? [alojamiento.imagen, ...galleryImages.filter(img => img !== alojamiento.imagen)] : galleryImages;

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
    
    // Si se muestra el calendario, hacer scroll suave hasta él
    if (!showCalendar) {
      setTimeout(() => {
        const calendarElement = document.getElementById('calendar-section');
        if (calendarElement) {
          calendarElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Animaciones para la página
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            />
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-gray-600 mb-8">
              No pudimos encontrar el alojamiento que estás buscando.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/alojamientos")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los alojamientos
            </motion.button>
          </motion.div>
        ) : alojamiento ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Título y ubicación */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: alojamiento.titulo }} />
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {alojamiento.ubicacion}
              </div>
            </motion.div>

            {/* Galería de imágenes */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative h-96 rounded-2xl overflow-hidden">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={allImages[activeImage]}
                    alt={alojamiento.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 font-semibold">{alojamiento.puntuacion}</span>
                    </div>
                  </div>
                  
                  {/* Controles de navegación */}
                  <button 
                    onClick={() => setActiveImage((activeImage - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                  >
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => setActiveImage((activeImage + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                  >
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Miniaturas de la galería */}
                <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-4 h-96 overflow-hidden">
                  {allImages.slice(0, 4).map((img, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`relative rounded-xl overflow-hidden cursor-pointer ${activeImage === index ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img} 
                        alt={`Galería ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {/* Características */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-8 pb-8 border-b border-gray-200"
                >
                  <div className="flex flex-wrap gap-4 mb-6">
                    {alojamiento.caracteristicas.map((caracteristica, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ y: -3 }}
                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                      >
                        {caracteristica}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Descripción */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-10 pb-10 border-b border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                  <div className="prose text-gray-600" dangerouslySetInnerHTML={{ __html: alojamiento.descripcion }} />
                </motion.div>

                {/* Reseñas */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-10 pb-10 border-b border-gray-200"
                >
                  <ReviewsSection propertyId={alojamiento.id} />
                </motion.div>

                {/* Comodidades */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-10 pb-10 border-b border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Comodidades</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alojamiento.comodidades.map((comodidad, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{comodidad}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Normas de la casa */}
                <motion.div 
                  variants={itemVariants}
                  className="mb-10"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Normas de la casa</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alojamiento.normas.map((norma, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-700">{norma}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Reserva */}
              <div className="lg:col-span-1">
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg p-6 sticky top-32"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${alojamiento.precio}</span>
                      <span className="text-gray-600"> / noche</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 font-semibold">{alojamiento.puntuacion}</span>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fechas</label>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      onClick={handleCalendarToggle}
                      className="flex justify-between border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <div className="text-gray-900">
                        {dateRange?.from ? format(dateRange.from, 'PPP', { locale: es }) : 'Check-in'}
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-gray-900">
                        {dateRange?.to ? format(dateRange.to, 'PPP', { locale: es }) : 'Check-out'}
                      </div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {showCalendar && (
                        <motion.div 
                          id="calendar-section"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 border border-gray-200 rounded-lg"
                        >
                          {/* Aquí iría el componente de calendario */}
                          <p className="text-center text-gray-500 my-4">Calendario (Simulado)</p>
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Check-in</p>
                              <p>{dateRange?.from ? format(dateRange.from, 'PPP', { locale: es }) : '-'}</p>
                            </div>
                            <div>
                              <p className="font-medium">Check-out</p>
                              <p>{dateRange?.to ? format(dateRange.to, 'PPP', { locale: es }) : '-'}</p>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <button 
                              onClick={() => setShowCalendar(false)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Cerrar calendario
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Huéspedes */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Huéspedes</label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <span className="text-gray-900">{huespedes} huéspedes</span>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        >
                          -
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setHuespedes(Math.min(10, huespedes + 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Resumen de precio */}
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">${alojamiento.precio} x {dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0} noches</span>
                      <span className="text-gray-900">${calcularTotal()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tarifa de limpieza</span>
                      <span className="text-gray-900">$50</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tarifa de servicio</span>
                      <span className="text-gray-900">$30</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>${calcularTotal() + 80}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReserva}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reservar
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alojamiento no disponible</h2>
            <p className="text-gray-600 mb-8">
              No pudimos encontrar la información del alojamiento que estás buscando.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/alojamientos")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los alojamientos
            </motion.button>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}