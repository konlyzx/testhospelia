"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUserFriends, FaShieldAlt, FaChartLine, FaDollarSign, FaSpinner } from 'react-icons/fa';

export default function HazteAnfitrion() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombres: "",
    email: "",
    telefono: "",
    ubicacion: "",
    tipoAlojamiento: "Apartamento",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      // Preparar datos para Wasi CRM con identificador de fuente
      const wasiData = {
        nombres: formData.nombres,
        email: formData.email,
        telefono: formData.telefono,
        ubicacion: formData.ubicacion,
        tipoAlojamiento: formData.tipoAlojamiento,
        source: 'hazte-anfitrion' // Identificador para crear etiqueta de Anfitrión
      };

      // Enviar a Wasi CRM
      const wasiResponse = await fetch('/api/wasi/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wasiData)
      });

      if (wasiResponse.ok) {
        const wasiResult = await wasiResponse.json();
        setSubmitted(true);
        
        // Cerrar el mensaje después de 5 segundos
        setTimeout(() => {
          setSubmitted(false);
    setFormData({
        nombres: "",
        email: "",
        telefono: "",
        ubicacion: "",
        tipoAlojamiento: "Apartamento",
    });
        }, 5000);
      } else {
        const errorResult = await wasiResponse.json();
        throw new Error(errorResult.details || 'Error al registrar en Wasi CRM');
      }

    } catch (err) {
      console.error('Error al procesar formulario de anfitrión:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar el formulario');
    } finally {
      setLoading(false);
    }
  };

  const beneficios = [
    {
      titulo: "Consigue más clientes para tu alojamiento",
      icono: <FaUserFriends size={40} className="text-white mb-4" />,
    },
    {
      titulo: "Renta con seguridad y confianza",
      icono: <FaShieldAlt size={40} className="text-white mb-4" />,
    },
    {
      titulo: "Superamos las fluctuaciones estacionales con estrategias innovadoras",
      icono: <FaChartLine size={40} className="text-white mb-4" />,
    },
    {
      titulo: "Genera más ingresos mientras disfrutas tu día a día",
      icono: <FaDollarSign size={40} className="text-white mb-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      
      <section className="relative min-h-[80vh] flex items-center pt-24 pb-12 hero-gradient">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Rentar tu alojamiento en Cali con Hospelia es fácil y seguro. Más clientes, más ganancias y sin complicaciones.
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              ¡Tu aliado estratégico para que triunfes como anfitrión!
            </p>
            <button 
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
            >
              ¡Registra tu Alojamiento Ahora!
            </button>
          </div>
          <div className="relative w-full flex justify-center">
            <img 
              src="/img/Banners-home-2.webp"
              alt="Anfitriones Hospelia" 
              className="relative w-full max-w-lg mx-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div
                key={index}
                className="bg-blue-500 p-8 rounded-lg text-white text-center shadow-xl transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-center items-center mb-4">
                  {beneficio.icono}
                </div>
                <h3 className="text-xl font-semibold">{beneficio.titulo}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Déjanos tus datos y uno de nuestros asesores se pondrá en contacto para que publiques tu alojamiento completamente GRATIS.
            </h2>
          </div>
          
          {submitted ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Registro exitoso!</h3>
              <p className="text-gray-600">
                Gracias por tu interés. Uno de nuestros asesores se pondrá en contacto contigo pronto 
                para ayudarte a publicar tu alojamiento completamente GRATIS.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
                NOMBRES *
              </label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                EMAIL *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                NÚMERO DE TELÉFONO *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                UBICACIÓN *
              </label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="tipoAlojamiento" className="block text-sm font-medium text-gray-700 mb-1">
                TIPO DE ALOJAMIENTO *
              </label>
              <select
                id="tipoAlojamiento"
                name="tipoAlojamiento"
                value={formData.tipoAlojamiento}
                onChange={handleChange}
                required
                  disabled={loading}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-gray-900 w-full shadow-sm hover:shadow-md transition-all duration-200 appearance-none disabled:opacity-50"
              >
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Habitación</option>
                <option>Otro</option>
              </select>
            </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
            <button
              type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  '¡Registra tu Alojamiento Ahora!'
                )}
            </button>
          </form>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xl italic text-gray-700 mb-6">
            "Recomendar Hospelia como anfitrión es un placer. La flexibilidad que ofrece para gestionar mi propio espacio y establecer mis tarifas ha sido fundamental para mi éxito. Mi ingreso adicional como anfitrión ha sido una gran ayuda, ¡y no puedo esperar para seguir siendo parte de esta increíble plataforma!"
          </p>
          <p className="font-semibold text-gray-900">Ricardo Phetter</p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 
