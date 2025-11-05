"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Agregamos una interfaz para el tipo TikTok global
declare global {
  interface Window {
    TikTok?: {
      reloadEmbeds: () => void;
    };
  }
}

const TikTokSlider = () => {
  const containerRef = useRef(null);
 
  const videos = [
    {
      id: 1,
      type: "tiktok",
      embedCode: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@hospelia/video/7198187877140827397" data-video-id="7198187877140827397" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@hospelia" href="https://www.tiktok.com/@hospelia?refer=embed">@hospelia</a> Hermoso apartaestudio en el Norte de Cali contáctanos 322 893-5606 <a title="apartamentosamoblados" target="_blank" href="https://www.tiktok.com/tag/apartamentosamoblados?refer=embed">#apartamentosamoblados</a> <a title="rentascortas" target="_blank" href="https://www.tiktok.com/tag/rentascortas?refer=embed">#rentascortas</a> <a title="cali" target="_blank" href="https://www.tiktok.com/tag/cali?refer=embed">#cali</a> <a title="colombia" target="_blank" href="https://www.tiktok.com/tag/colombia?refer=embed">#colombia</a> <a target="_blank" title="♬ Still Don't Know My Name - Labrinth" href="https://www.tiktok.com/music/Still-Don't-Know-My-Name-6817120527187020549?refer=embed">♬ Still Don't Know My Name - Labrinth</a> </section> </blockquote>`,
      title: "Hermoso apartaestudio en el Norte de Cali",
      views: "45.2K"
    },
    {
      id: 2,
      type: "tiktok",
      embedCode: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@hospelia/video/7198179391564729605" data-video-id="7198179391564729605" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@hospelia" href="https://www.tiktok.com/@hospelia?refer=embed">@hospelia</a> Apartamento amoblado en Cali,Co Valle del lili contáctanos 322 893-5606 <a title="apartamentoamoblado" target="_blank" href="https://www.tiktok.com/tag/apartamentoamoblado?refer=embed">#apartamentoamoblado</a> <a title="cali" target="_blank" href="https://www.tiktok.com/tag/cali?refer=embed">#cali</a> <a title="colombia" target="_blank" href="https://www.tiktok.com/tag/colombia?refer=embed">#colombia</a> <a title="rentascortas" target="_blank" href="https://www.tiktok.com/tag/rentascortas?refer=embed">#rentascortas</a> <a target="_blank" title="♬ Sweet Dreams - Trinix" href="https://www.tiktok.com/music/Sweet-Dreams-6795037315535210498?refer=embed">♬ Sweet Dreams - Trinix</a> </section> </blockquote>`,
      title: "Apartamento amoblado en Cali, Valle del lili",
      views: "32.7K"
    },
    {
      id: 3,
      type: "youtube",
      embedCode: `<iframe width="605px" height="325px" src="https://www.youtube.com/embed/cMQFnjy87uc" title="Hermoso apartamento amoblado, valle del Lili st tropez" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
      title: "Hermoso apartamento amoblado, valle del Lili st tropez",
      views: "28.9K"
    },
    {
      id: 4,
      type: "youtube",
      embedCode: `<iframe width="605px" height="325px" src="https://www.youtube.com/embed/I0EmWSx2NlA" title="Apartamento amoblado ciudad 200 sur de Cali." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
      title: "Apartamento amoblado ciudad 200 sur de Cali",
      views: "52.1K"
    },
  ];

  // Efecto para cargar el script de TikTok cuando el componente esté visible
  useEffect(() => {
    // Cargar el script de TikTok en el cliente
    const loadTikTokScript = () => {
      if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
      
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    };

    loadTikTokScript();
    
    // Función para manejar cuando los componentes TikTok están visibles
    if (typeof window !== 'undefined' && window.TikTok) {
      window.TikTok.reloadEmbeds();
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Texto de cabecera con animación */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hospelia en Videos</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros alojamientos a través de recorridos virtuales.
          </p>
        </motion.div>
        
        {/* Carrusel de Videos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              1024: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
            }}
            navigation
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            className="mySwiper rounded-xl overflow-hidden"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id} className="p-2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group min-h-[600px]">
                  {/* Video embebido */}
                  <div className="flex justify-center items-center pt-4">
                    <div dangerouslySetInnerHTML={{ __html: video.embedCode }} />
                  </div>
                  
                  {/* Información del video */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{video.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg 
                        className="w-4 h-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {video.views} visualizaciones
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        
        {/* CTA para seguir en TikTok */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a 
            href="https://www.tiktok.com/@hospelia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#fe2c55] text-white font-semibold rounded-full shadow-lg hover:bg-[#ee1d49] transition-all duration-300 hover:scale-105"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 448 512" 
              fill="currentColor"
              className="mr-2"
            >
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
            Síguenos en TikTok
          </a>
        </motion.div>
      </div>
      
      {/* Decoraciones/SVGs en el fondo */}
      <div className="absolute top-12 left-0 opacity-5 -rotate-12">
        <svg width="120" height="120" viewBox="0 0 448 512" fill="#000"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
      </div>
      <div className="absolute bottom-12 right-0 opacity-5 rotate-12">
        <svg width="120" height="120" viewBox="0 0 448 512" fill="#000"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
      </div>
    </section>
  );
};

export default TikTokSlider; 