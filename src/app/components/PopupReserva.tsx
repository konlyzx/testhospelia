'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { trackReservationConversion, trackWhatsAppClick } from '@/utils/googleAds';
import { useSearchParams, useRouter } from 'next/navigation';


declare global {
  interface Window {
    flatpickr: any;
  }
}

interface PopupReservaProps {
  isOpen: boolean;
  onClose: () => void;
  popupId?: number;
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

interface FormData {
  nombre: string;
  prefijo: string;
  telefono: string;
  telefono_completo: string;
  habitaciones: string;
  presupuesto: string;
  email: string;
  fechas: string;
}

export default function PopupReserva({ isOpen, onClose, popupId }: PopupReservaProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [flatpickrLoaded, setFlatpickrLoaded] = useState<boolean>(false);
  const [utmParams, setUtmParams] = useState<UTMParams>({});
  const [conversionId, setConversionId] = useState<string>('');
  const popupRef = useRef<HTMLDivElement>(null);
  const flatpickrRef = useRef<any>(null);
  const fechasInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    prefijo: '+57',
    telefono: '',
    telefono_completo: '+57',
    habitaciones: '1 HABITACION',
    presupuesto: '2.800.000 - 3.200.000',
    email: '',
    fechas: ''
  });


  useEffect(() => {
    if (isOpen && !flatpickrLoaded) {
      loadFlatpickr();
    }
  }, [isOpen, flatpickrLoaded]);

  // Capturar parámetros UTM y generar ID de conversión
  useEffect(() => {
    if (isOpen) {
      // Capturar parámetros UTM de la URL
      const params: UTMParams = {
        utm_source: searchParams.get('utm_source') || undefined,
        utm_medium: searchParams.get('utm_medium') || undefined,
        utm_campaign: searchParams.get('utm_campaign') || undefined,
        utm_term: searchParams.get('utm_term') || undefined,
        utm_content: searchParams.get('utm_content') || undefined,
        gclid: searchParams.get('gclid') || undefined,
        fbclid: searchParams.get('fbclid') || undefined,
      };
      
      // Filtrar parámetros vacíos
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      );
      
      setUtmParams(filteredParams);
      
      // Generar ID único para esta conversión
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      setConversionId(`conv_${timestamp}_${randomId}`);
      
      // Trackear apertura del popup
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'popup_opened', {
          event_category: 'engagement',
          event_label: 'reservation_popup',
          popup_id: popupId,
          conversion_id: `conv_${timestamp}_${randomId}`,
          ...filteredParams
        });

        // Page view virtual para que aparezca una URL específica en GA
        window.gtag('event', 'page_view', {
          page_title: 'Popup Reserva',
          page_location: `${window.location.origin}/popup-reserva`,
          page_path: '/popup-reserva'
        });
      }
    }
  }, [isOpen, searchParams, popupId]);

  // Reinicializar formulario cada vez que se abre el popup
  useEffect(() => {
    if (isOpen) {
      const initialData = {
        nombre: '',
        prefijo: '+57',
        telefono: '',
        telefono_completo: '+57',
        habitaciones: '1 HABITACION',
        presupuesto: '2.800.000 - 3.200.000',
        email: '',
        fechas: ''
      };
      setFormData(initialData);
    }
  }, [isOpen]);


  useEffect(() => {
    if (isOpen && flatpickrLoaded && fechasInputRef.current && !flatpickrRef.current) {
      initializeFlatpickr();
    }
  }, [isOpen, flatpickrLoaded]);

  // Desactivar el scroll en el body cuando el popup está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Detectar clics fuera del popup para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // No cerrar si el clic es dentro del popup
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      
      // No cerrar si el clic es dentro del calendario de Flatpickr
      if (target && (target as Element).closest) {
        const flatpickrCalendar = (target as Element).closest('.flatpickr-calendar');
        const hospeliaPicker = (target as Element).closest('.hospelia-datepicker');
        if (flatpickrCalendar || hospeliaPicker) {
          return;
        }
      }
      
      // No cerrar si el clic es en elementos relacionados con Flatpickr
      if (target && (target as Element).classList) {
        const classList = (target as Element).classList;
        if (classList.contains('flatpickr-day') || 
            classList.contains('flatpickr-month') || 
            classList.contains('flatpickr-year') ||
            classList.contains('flatpickr-prev-month') ||
            classList.contains('flatpickr-next-month') ||
            classList.contains('flatpickr-current-month') ||
            classList.contains('flatpickr-calendar') ||
            classList.contains('hospelia-datepicker')) {
          return;
        }
      }
      
      // Si llegamos aquí, es seguro cerrar el popup
      onClose();
    };

    if (isOpen) {
      // Usar capture: true para interceptar el evento antes que Flatpickr
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  // Limpiar Flatpickr cuando se cierra el popup
  useEffect(() => {
    if (!isOpen && flatpickrRef.current) {
      flatpickrRef.current.destroy();
      flatpickrRef.current = null;
    }
  }, [isOpen]);

  // Función para cargar Flatpickr dinámicamente
  const loadFlatpickr = async () => {
    try {
      // Verificar si ya está cargado
      if (window.flatpickr) {
        setFlatpickrLoaded(true);
        return;
      }

      // Cargar CSS de Flatpickr
      if (!document.querySelector('link[href*="flatpickr"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
        document.head.appendChild(link);
      }

      // Cargar JS de Flatpickr
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      
      script.onload = () => {
        setFlatpickrLoaded(true);
      };
      
      script.onerror = () => {
        setError('Error al cargar el selector de fechas');
      };
      
      document.body.appendChild(script);
      
          } catch (err) {
        setError('Error al cargar el selector de fechas');
      }
  };

  // Función para inicializar Flatpickr
  const initializeFlatpickr = () => {
    if (!fechasInputRef.current || !window.flatpickr) return;

    try {
      flatpickrRef.current = window.flatpickr(fechasInputRef.current, {
        mode: "range",
        dateFormat: "d/m/Y",
        rangeSeparator: " - ",
        minDate: "today",
        clickOpens: true,
        allowInput: true, // Permitir escritura manual
        closeOnSelect: false, // No cerrar automáticamente al seleccionar
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
          },
          months: {
            shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          },
        },
        onChange: (selectedDates: Date[], dateStr: string) => {
          setFormData(prev => ({ ...prev, fechas: dateStr }));
          // Cerrar el calendario después de seleccionar un rango completo
          if (selectedDates.length === 2) {
            setTimeout(() => {
              if (flatpickrRef.current) {
                flatpickrRef.current.close();
              }
            }, 100);
          }
        },
        onReady: () => {
          const calendar = document.querySelector('.flatpickr-calendar');
          if (calendar) {
            calendar.classList.add('hospelia-datepicker');
          }
        },
        onOpen: () => {
          const calendar = document.querySelector('.flatpickr-calendar');
          if (calendar) {
            (calendar as HTMLElement).style.zIndex = '9999';
          }
        }
      });
    } catch (err) {
      // Silent fail
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Actualizar teléfono completo cuando cambie prefijo o teléfono
      if (name === 'prefijo' || name === 'telefono') {
        newData.telefono_completo = `${name === 'prefijo' ? value : prev.prefijo}${name === 'telefono' ? value : prev.telefono}`;
      }
      
      return newData;
    });
  };

  // Manejar envío del formulario con FormSubmit y Wasi CRM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear FormData para envío a FormSubmit
      const form = e.target as HTMLFormElement;
      const formDataToSend = new FormData(form);
      
      // Asegurar que el teléfono completo esté actualizado
      formDataToSend.set('telefono_completo', `${formData.prefijo}${formData.telefono}`);
      
      // Datos para Wasi CRM con identificador de fuente para etiqueta de Cliente
      const wasiData = {
        nombres: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        telefono_completo: `${formData.prefijo}${formData.telefono}`,
        habitaciones: formData.habitaciones,
        presupuesto: formData.presupuesto,
        fechas: formData.fechas,
        source: 'popup-cliente' // Identificador para crear etiqueta de Cliente
      };

      // Enviar a ambos servicios en paralelo
      const [formSubmitResponse, wasiResponse] = await Promise.allSettled([
        // FormSubmit (correo)
        fetch('https://formsubmit.co/hospelia007@gmail.com', {
          method: 'POST',
          body: formDataToSend
        }),
        // Wasi CRM
        fetch('/api/wasi/client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(wasiData)
        })
      ]);

      // Verificar resultados
      let formSubmitSuccess = false;
      let wasiSuccess = false;
      let errors = [];

      if (formSubmitResponse.status === 'fulfilled' && formSubmitResponse.value.ok) {
        formSubmitSuccess = true;
      } else {
        errors.push('Error al enviar correo');
      }

      if (wasiResponse.status === 'fulfilled' && wasiResponse.value.ok) {
        const wasiResult = await wasiResponse.value.json();
        if (wasiResult.success) {
          wasiSuccess = true;
        } else {
          errors.push('Error al registrar en Wasi CRM');
        }
      } else {
        errors.push('Error al conectar con Wasi CRM');
      }

      if (formSubmitSuccess || wasiSuccess) {
        setSubmitted(true);
        
        // Trackear conversión con datos UTM y ID único
        const conversionData = {
          ...formData,
          conversion_id: conversionId,
          popup_id: popupId,
          utm_params: utmParams,
          timestamp: new Date().toISOString(),
          success_channels: {
            email: formSubmitSuccess,
            crm: wasiSuccess
          }
        };
        
        trackReservationConversion(conversionData);
        
        // Enviar evento de conversión a Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'conversion', {
            event_category: 'lead_generation',
            event_label: 'reservation_form_completed',
            value: 1,
            currency: 'COP',
            conversion_id: conversionId,
            popup_id: popupId,
            ...utmParams
          });
          
          // Evento específico para Google Ads si hay gclid
          if (utmParams.gclid) {
            window.gtag('event', 'conversion', {
              send_to: 'AW-943201081/8GhRCMusjZICELm24MED',
              value: 1,
              currency: 'COP',
              transaction_id: conversionId
            });
          }
        }

        const createWhatsAppMessage = () => {
          let mensaje = `¡Hola, equipo de HOSPELIA! 
          
Soy ${formData.nombre} y estoy interesado/a en alquilar un apartamento amoblado en Cali.

📋 **Mis datos de contacto:**
• Nombre: ${formData.nombre}
• Teléfono: ${formData.prefijo}${formData.telefono}
• Email: ${formData.email}

🏠 **Información de búsqueda:**
• Habitaciones: ${formData.habitaciones}
• Presupuesto: ${formData.presupuesto} COP`;

          if (formData.fechas) {
            mensaje += `
• Fechas: ${formData.fechas}`;
          }

          mensaje += `

¡Espero su respuesta para más información!`;

          return encodeURIComponent(mensaje);
        };

        // Abrir WhatsApp en nueva pestaña y redirigir a Página de Gracias para medición
        // Abrir WhatsApp (nueva pestaña) y redirigir inmediatamente con router
        const whatsappUrl = `https://api.whatsapp.com/send?phone=573017546634&text=${createWhatsAppMessage()}`;
        const whatsappData = {
          conversion_id: conversionId,
          popup_id: popupId,
          utm_params: utmParams,
          user_data: { nombre: formData.nombre, telefono: formData.telefono_completo }
        };
        trackWhatsAppClick(whatsappData);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'post_conversion_whatsapp', conversion_id: conversionId, popup_id: popupId, ...utmParams });
        }
        try { window.open(whatsappUrl, '_blank'); } catch {}
        
        // Calcular valor numérico del presupuesto para Google Ads
        let budgetValue = 1.0;
        if (formData.presupuesto.includes('-')) {
          const parts = formData.presupuesto.split('-').map(p => parseFloat(p.replace(/\./g, '').trim()));
          if (parts.length === 2) budgetValue = (parts[0] + parts[1]) / 2;
        } else if (formData.presupuesto.includes('+')) {
          budgetValue = parseFloat(formData.presupuesto.replace(/[^\d]/g, ''));
        }

        const sp = new URLSearchParams({ 
          conv: conversionId, 
          popup: String(popupId || ''), 
          value: budgetValue.toString(),
          currency: 'COP',
          ...(utmParams as any) 
        });
        router.push(`/gracias?${sp.toString()}`);
      } else {
        throw new Error(`Errores: ${errors.join(', ')}`);
      }
      
    } catch (err) {
      setError('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Variantes de animación mejoradas para el popup
  const backdropVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const popupVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            ref={popupRef}
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
              aria-label="Cerrar"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>

            {/* Contenido del popup */}
            <div className="p-8">
              {submitted ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Formulario enviado exitosamente!</h3>
                  <p className="text-gray-600">Te contactaremos pronto para ayudarte a encontrar tu espacio ideal.</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="popup-card-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Encuentra tu espacio perfecto
                  </h2>
                  <p className="text-gray-600 mb-6 text-center">
                    Diligencia este formulario y te ayudaremos a encontrar el espacio perfecto para ti.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">

                    
                    {/* Campos ocultos para FormSubmit */}
                    <input type="hidden" name="_next" value="javascript:void(0);" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_subject" value="Nueva solicitud de reserva - Hospelia" />
                    <input type="hidden" name="_template" value="table" />
                    
                    {/* Campos ocultos para tracking */}
                    <input type="hidden" name="conversion_id" value={conversionId} />
                    <input type="hidden" name="popup_id" value={popupId || ''} />
                    <input type="hidden" name="utm_source" value={utmParams.utm_source || ''} />
                    <input type="hidden" name="utm_medium" value={utmParams.utm_medium || ''} />
                    <input type="hidden" name="utm_campaign" value={utmParams.utm_campaign || ''} />
                    <input type="hidden" name="utm_term" value={utmParams.utm_term || ''} />
                    <input type="hidden" name="utm_content" value={utmParams.utm_content || ''} />
                    <input type="hidden" name="gclid" value={utmParams.gclid || ''} />
                    <input type="hidden" name="fbclid" value={utmParams.fbclid || ''} />
                    
                    {/* Nombre Completo */}
                    <div className="popup-field">
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="popup-field">
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                        Número de celular
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="prefijo"
                          name="prefijo"
                          required
                          value={formData.prefijo}
                          onChange={handleInputChange}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                        >
                          <option value="+57">Colombia (+57)</option>
                          <option value="+1">USA (+1)</option>
                          <option value="+34">España (+34)</option>
                          <option value="+598">Uruguay (+598)</option>
                          <option value="+58">Venezuela (+58)</option>
                          <option value="+593">Ecuador (+593)</option>
                          <option value="+503">El Salvador (+503)</option>
                          <option value="+502">Guatemala (+502)</option>
                          <option value="+504">Honduras (+504)</option>
                          <option value="+52">México (+52)</option>
                          <option value="+505">Nicaragua (+505)</option>
                          <option value="+507">Panamá (+507)</option>
                          <option value="+595">Paraguay (+595)</option>
                          <option value="+51">Perú (+51)</option>
                          <option value="+54">Argentina (+54)</option>
                          <option value="+591">Bolivia (+591)</option>
                          <option value="+56">Chile (+56)</option>
                          <option value="+506">Costa Rica (+506)</option>
                          <option value="+53">Cuba (+53)</option>
                        </select>
                        <input
                          id="telefono"
                          name="telefono"
                          type="text"
                          required
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="12345678"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <input
                        id="telefono_completo"
                        name="telefono_completo"
                        type="hidden"
                        value={formData.telefono_completo}
                      />
                    </div>

                    {/* Habitaciones */}
                    <div className="popup-field">
                      <label htmlFor="habitaciones" className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Cuántas habitaciones necesitas?
                      </label>
                      <select
                        id="habitaciones"
                        name="habitaciones"
                        required
                        value={formData.habitaciones}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                      >
                        <option value="1 HABITACION">1 HABITACIÓN</option>
                        <option value="2 HABITACIONES">2 HABITACIONES</option>
                        <option value="3 HABITACIONES">3 HABITACIONES</option>
                      </select>
                    </div>

                    {/* Presupuesto */}
                    <div className="popup-field">
                      <label htmlFor="presupuesto" className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Cuál es tu presupuesto?
                      </label>
                      <select
                        id="presupuesto"
                        name="presupuesto"
                        required
                        value={formData.presupuesto}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                      >
                        <option value="2.800.000 - 3.200.000">2.800.000 - 3.200.000</option>
                        <option value="+4.000.000">+4.000.000</option>
                      </select>
                    </div>

                    {/* Email */}
                    <div className="popup-field">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Usa tu correo activo, donde podamos contactarte"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Fechas */}
                    <div className="popup-field">
                      <label htmlFor="fechas" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de reserva
                      </label>
                      <input
                        ref={fechasInputRef}
                        id="fechas"
                        name="fechas"
                        type="text"
                        required
                        value={formData.fechas}
                        onChange={handleInputChange}
                        placeholder={flatpickrLoaded ? "Selecciona un rango de fechas" : "Cargando selector de fechas..."}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                      {!flatpickrLoaded && (
                        <p className="text-xs text-gray-500 mt-1">Cargando selector de fechas...</p>
                      )}
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-red-600 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Botón de envío */}
                    <div className="popup-btn-wrapper">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Enviando...
                          </>
                        ) : (
                          'Encuentra Mi Espacio Ideal'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
