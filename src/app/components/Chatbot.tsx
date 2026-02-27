"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  id: string;
  text: string;
  value: string;
}

interface ChatbotKnowledge {
  [key: string]: {
    response: string;
    quickReplies?: QuickReply[];
  };
}

const hospeliaChatbot: ChatbotKnowledge = {
  // Saludo inicial
  "inicio": {
    response: "¡Hola! 😊 Soy el asistente virtual de **Hospelia**.\n\nTe ayudo con información sobre nuestros apartamentos amoblados en Cali. ¿Qué te interesa saber?",
    quickReplies: [
      { id: "precios", text: "💰 Ver precios", value: "precios" },
      { id: "ubicaciones", text: "📍 Ubicaciones", value: "zonas" },
      { id: "servicios", text: "🏨 Servicios", value: "servicios" },
      { id: "reservar", text: "📅 Cómo reservar", value: "como reservar" }
    ]
  },

  // Información de precios
  "precios": {
    response: "💰 **Nuestros Precios Mensuales:**\n\n🏠 **Zona Norte:** $3,000,000 - $4,500,000\n🏠 **Zona Sur:** $3,500,000 - $4,300,000\n🏠 **Zona Oeste:** $3,800,000 aprox.\n\n✨ *Todos incluyen servicios y están completamente amoblados*",
    quickReplies: [
      { id: "zona_norte", text: "🌟 Zona Norte", value: "zona norte" },
      { id: "zona_sur", text: "🌆 Zona Sur", value: "zona sur" },
      { id: "incluye", text: "❓ ¿Qué incluye?", value: "servicios" },
      { id: "reservar", text: "📞 Contactar", value: "contacto" }
    ]
  },

  // Zonas
  "zonas": {
    response: "📍 **Nuestras Ubicaciones en Cali:**\n\n🌟 **Zona Norte** - 4 propiedades\n• La Flora Norte\n• San Vicente\n\n🌆 **Zona Sur** - 19 propiedades\n• Bochalema\n• Valle del Lili\n\n🏙️ **Zona Oeste** - 1 propiedad\n\n*Todas en las zonas más exclusivas de la ciudad*",
    quickReplies: [
      { id: "zona_norte_info", text: "🌟 Ver Zona Norte", value: "zona norte" },
      { id: "zona_sur_info", text: "🌆 Ver Zona Sur", value: "zona sur" },
      { id: "precios_zona", text: "💰 Precios por zona", value: "precios" },
      { id: "mascotas", text: "🐕 ¿Permiten mascotas?", value: "mascotas" }
    ]
  },

  "zona norte": {
    response: "🌟 **Zona Norte de Cali:**\n\n🏠 **4 propiedades disponibles**\n📍 Ubicaciones: La Flora Norte, San Vicente\n💰 Precios: $3,000,000 - $4,500,000/mes\n\n✨ Apartamentos modernos con excelente conectividad y cerca de centros comerciales",
    quickReplies: [
      { id: "caracteristicas", text: "🏠 Características", value: "amoblados" },
      { id: "servicios", text: "🏨 Servicios incluidos", value: "servicios" },
      { id: "otras_zonas", text: "📍 Otras zonas", value: "zonas" },
      { id: "reservar", text: "📞 Quiero reservar", value: "como reservar" }
    ]
  },

  "zona sur": {
    response: "🌆 **Zona Sur de Cali:**\n\n🏠 **19 propiedades disponibles**\n📍 Ubicaciones: Bochalema, Valle del Lili\n💰 Precios: $3,500,000 - $4,300,000/mes\n\n✨ Nuestra mayor oferta, zona premium con excelente infraestructura",
    quickReplies: [
      { id: "disponibilidad", text: "📅 Disponibilidad", value: "visita" },
      { id: "servicios", text: "🏨 ¿Qué incluye?", value: "servicios" },
      { id: "otras_zonas", text: "📍 Otras zonas", value: "zonas" },
      { id: "contacto", text: "📞 Contactar ahora", value: "contacto" }
    ]
  },

  // Servicios
  "servicios": {
    response: "🏨 **Servicios Incluidos:**\n\n✅ Apartamentos completamente amoblados\n✅ Internet de alta velocidad\n✅ Servicios públicos incluidos\n✅ Mantenimiento y seguridad\n✅ Limpieza según la unidad\n✅ **100% Pet-friendly** 🐕\n\n*Todo incluido como un hotel, pero con la privacidad de tu hogar*",
    quickReplies: [
      { id: "mascotas_info", text: "🐕 Info mascotas", value: "mascotas" },
      { id: "amoblado", text: "🛏️ ¿Qué incluye amoblado?", value: "amoblados" },
      { id: "contrato", text: "📄 Duración contrato", value: "contrato" },
      { id: "reservar", text: "📅 Quiero reservar", value: "como reservar" }
    ]
  },

  "mascotas": {
    response: "🐕 **¡Sí, somos Pet-Friendly!**\n\n✅ Aceptamos mascotas en **TODOS** nuestros apartamentos\n✅ Sin restricciones de tamaño o raza\n✅ Ambiente seguro para tu mascota\n✅ Espacios apropiados para paseos\n\n*¡Tu familia completa es bienvenida en Hospelia!* 🐾",
    quickReplies: [
      { id: "requisitos_mascotas", text: "📋 ¿Hay requisitos?", value: "contrato" },
      { id: "zonas_mascotas", text: "📍 Mejores zonas", value: "zonas" },
      { id: "servicios", text: "🏨 Otros servicios", value: "servicios" },
      { id: "reservar", text: "📞 Reservar ahora", value: "contacto" }
    ]
  },

  // Proceso de reserva
  "como reservar": {
    response: "📅 **Proceso de Reserva (4 pasos):**\n\n1️⃣ **Elige** tu apartamento ideal\n2️⃣ **Reserva** con solo unos clics\n3️⃣ **Paga** de manera segura\n4️⃣ **Disfruta** tu nueva experiencia\n\n⚡ *Proceso rápido y seguro garantizado*",
    quickReplies: [
      { id: "contacto_directo", text: "📞 Hablar con asesor", value: "contacto" },
      { id: "visita", text: "👀 Agendar visita", value: "visita" },
      { id: "pago", text: "💳 Formas de pago", value: "pago anticipado" },
      { id: "duracion", text: "📄 Duración mínima", value: "contrato" }
    ]
  },

  "contrato": {
    response: "📄 **Información del Contrato:**\n\n⏰ **Duración mínima:** 1 mes\n💳 **Pago anticipado** asegura tu reserva\n📋 Flexibilidad para tus necesidades\n✅ Contrato transparente y claro\n\n*Nos adaptamos a tu situación específica*",
    quickReplies: [
      { id: "pago_info", text: "💳 Info de pagos", value: "pago anticipado" },
      { id: "visita", text: "👀 Ver antes de firmar", value: "visita" },
      { id: "contacto", text: "📞 Hablar con asesor", value: "contacto" },
      { id: "servicios", text: "🏨 ¿Qué incluye?", value: "servicios" }
    ]
  },

  "visita": {
    response: "👀 **¡Por supuesto puedes visitarnos!**\n\n✅ Agenda una visita **sin compromiso**\n✅ Conoce el apartamento en persona\n✅ Confirma que es ideal para ti\n✅ Resuelve todas tus dudas\n\n*Ver es creer - ¡Te esperamos!* 🏠",
    quickReplies: [
      { id: "contacto_visita", text: "📞 Agendar ahora", value: "contacto" },
      { id: "horarios", text: "🕐 ¿Horarios?", value: "contacto" },
      { id: "requisitos", text: "📋 ¿Qué necesito?", value: "contrato" },
      { id: "zonas", text: "📍 Ver ubicaciones", value: "zonas" }
    ]
  },

  // Contacto
  "contacto": {
    response: "📞 **Contáctanos Ahora:**\n\n📱 **WhatsApp/Teléfono:** (+57) 301 7546 634\n📧 **Email:** hospelia007@gmail.com\n\n⚡ **Respuesta rápida garantizada**\n🕐 Horario de atención: Lunes a Domingo\n\n*¡Estamos aquí para ayudarte!*",
    quickReplies: [
      { id: "whatsapp", text: "💬 Abrir WhatsApp", value: "whatsapp" },
      { id: "email", text: "📧 Enviar email", value: "email" },
      { id: "mas_info", text: "ℹ️ Más información", value: "servicios" },
      { id: "inicio", text: "🏠 Menú principal", value: "inicio" }
    ]
  },

  "whatsapp": {
    response: "💬 **¡Perfecto!**\n\nTe voy a conectar con nuestro WhatsApp donde un asesor real te atenderá inmediatamente.\n\n📱 **Número:** (+57) 301 7546 634\n\n*¡Haz clic en el botón verde de WhatsApp! 🟢*",
    quickReplies: [
      { id: "email_alt", text: "📧 Prefiero email", value: "email" },
      { id: "mas_preguntas", text: "❓ Más preguntas", value: "inicio" },
      { id: "servicios", text: "🏨 Ver servicios", value: "servicios" }
    ]
  }
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: hospeliaChatbot.inicio.response,
      isUser: false,
      timestamp: new Date(),
      quickReplies: hospeliaChatbot.inicio.quickReplies
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userInput: string): { response: string; quickReplies?: QuickReply[] } => {
    const input = userInput.toLowerCase();
    
    // Buscar coincidencias exactas primero
    for (const [key, data] of Object.entries(hospeliaChatbot)) {
      if (input.includes(key)) {
        return data;
      }
    }

    // Palabras clave relacionadas
    if (input.includes('precio') || input.includes('costo') || input.includes('valor')) {
      return hospeliaChatbot.precios;
    }
    
    if (input.includes('ubicacion') || input.includes('donde') || input.includes('zona')) {
      return hospeliaChatbot.zonas;
    }
    
    if (input.includes('servicio') || input.includes('incluye') || input.includes('que incluye')) {
      return hospeliaChatbot.servicios;
    }
    
    if (input.includes('mascota') || input.includes('perro') || input.includes('gato') || input.includes('pet')) {
      return hospeliaChatbot.mascotas;
    }

    if (input.includes('reservar') || input.includes('reserva') || input.includes('booking')) {
      return hospeliaChatbot["como reservar"];
    }

    if (input.includes('contacto') || input.includes('telefono') || input.includes('llamar')) {
      return hospeliaChatbot.contacto;
    }

    // Respuesta por defecto
    return {
      response: "🤔 No estoy seguro de entender eso específicamente.\n\n¿Te puedo ayudar con alguno de estos temas?",
      quickReplies: [
        { id: "precios", text: "💰 Precios", value: "precios" },
        { id: "ubicaciones", text: "📍 Ubicaciones", value: "zonas" },
        { id: "servicios", text: "🏨 Servicios", value: "servicios" },
        { id: "contacto", text: "📞 Contacto", value: "contacto" }
      ]
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular tiempo de respuesta
    setTimeout(() => {
      const botResponseData = findBestResponse(textToSend);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseData.response,
        isUser: false,
        timestamp: new Date(),
        quickReplies: botResponseData.quickReplies
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text: string) => {
    // Convertir markdown básico para renderizado tipo Svelte
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Botón del chatbot */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-[88px] z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hidden md:block"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -180 }}
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Ventana del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header mejorado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg font-bold">H</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Hospelia Assistant</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-xs opacity-90">En línea • Apartamentos amoblados</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages mejorados */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end space-x-2 max-w-[85%]">
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        H
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          message.isUser
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                        }`}
                      >
                        <div className={`text-sm leading-relaxed ${!message.isUser ? 'whitespace-pre-line' : ''}`}>
                          {message.isUser ? message.text : formatMessage(message.text)}
                        </div>
                      </div>
                      
                      {/* Quick Replies */}
                      {message.quickReplies && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-wrap gap-2 mt-3 pl-10"
                        >
                          {message.quickReplies.map((reply) => (
                            <motion.button
                              key={reply.id}
                              onClick={() => handleQuickReply(reply)}
                              className="bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-400 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {reply.text}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        TÚ
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      H
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input mejorado */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Usa los botones para respuestas rápidas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 
