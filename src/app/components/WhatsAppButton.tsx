"use client";

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { trackWhatsAppConversion } from '@/utils/googleAds';

const WhatsAppButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappLink = "https://api.whatsapp.com/send?phone=573017546634&text=%C2%A1Hola,%20equipo%20de%20HOSPELIA!%20Estoy%20buscando%20alquilar%20un%20apartamento%20amoblado%20en%20Cali%20quisiera%20m%C3%A1s%20INFORMACI%C3%93N.";

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50, // Empieza un poco abajo
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeIn" }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const buttonIconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="whatsapp-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-34 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl p-0 overflow-hidden z-[1000]"
          >
            <div className="bg-green-500 text-white p-4">
              <div className="flex items-center mb-2">
                <FaWhatsapp size={24} className="mr-3" />
                <h3 className="text-lg font-semibold">Iniciar una conversación</h3>
              </div>
              <p className="text-sm">
                ¡Hola! Haga clic en uno de nuestros miembros a continuación para chatear por WhatsApp
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">
                El equipo suele responder en unos minutos.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200 group"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(false);
                  return trackWhatsAppConversion(whatsappLink);
                }}
              >
                <div className="w-1.5 h-10 bg-green-500 rounded-full mr-3"></div>
                <FaWhatsapp size={28} className="text-green-500 mr-3" />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 group-hover:text-green-600">Asesoría Hospelia</p>
                  <p className="text-sm text-gray-600">Asesoría Hospelia</p>
                </div>
                <FaWhatsapp size={20} className="text-green-400" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 ease-out z-[1001] focus:outline-none transform hover:scale-110 active:scale-100"
        aria-label={isModalOpen ? "Cerrar modal de WhatsApp" : "Abrir chat de WhatsApp"}
      >
        <motion.div
          variants={buttonIconVariants}
          animate={isModalOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        >
          {isModalOpen ? <IoMdClose size={24} /> : <FaWhatsapp size={24} />}
        </motion.div>
      </button>
    </>
  );
};

export default WhatsAppButton; 