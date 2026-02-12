'use client'; 
  
 import { useState, useEffect } from 'react'; 
 import Link from 'next/link'; 
 import { usePathname } from 'next/navigation'; 
 import { FaBars, FaUserCircle, FaGlobe, FaTimes, FaWhatsapp, FaTh, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa'; 
 import { useLanguage } from '@/contexts/LanguageContext'; 
  
 export default function Navbar() { 
   const [isScrolled, setIsScrolled] = useState(false); 
   const [showLanguageMenu, setShowLanguageMenu] = useState(false); 
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
   const { language, setLanguage, t } = useLanguage(); 
   const pathname = usePathname(); 
  
   const isHomePage = pathname === '/'; 
  
   useEffect(() => { 
     const handleScroll = () => { 
       if (window.scrollY > 10) { 
         setIsScrolled(true); 
       } else { 
         setIsScrolled(false); 
       } 
     }; 
  
     window.addEventListener('scroll', handleScroll); 
     return () => window.removeEventListener('scroll', handleScroll); 
   }, []); 
  
   const handleBookNow = () => { 
     // Generate WhatsApp link with tracking ref 
     const phoneNumber = '573017546634'; 
     // Get the current full URL or at least the pathname to track where they came from 
     // We'll use window.location.origin + pathname if available, otherwise just pathname 
     let sourceUrl = pathname; 
     if (typeof window !== 'undefined') { 
       sourceUrl = window.location.origin + pathname; 
     } 
      
     const message = language === 'es'  
       ? `Hola, estoy interesado en reservar. Vengo de: ${sourceUrl}` 
       : `Hello, I'm interested in booking. I came from: ${sourceUrl}`; 
        
     const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`; 
      
     // Open in new tab 
     window.open(whatsappUrl, '_blank'); 
      
     // Close sidebar if open 
     setIsSidebarOpen(false); 
   }; 
  
   const useDarkStyle = isScrolled || !isHomePage; 
  
   const textColorClass = useDarkStyle ? 'text-gray-800 hover:text-blue-600' : 'text-white/95 hover:text-white'; 
   const iconColorClass = useDarkStyle ? 'text-gray-600' : 'text-white/90'; 
   const borderColorClass = useDarkStyle ? 'border-gray-200/50 bg-gray-50/50 hover:bg-white hover:shadow-md' : 'border-white/20 bg-white/10 hover:bg-white/20'; 
   const languageButtonClass = useDarkStyle ? 'hover:bg-gray-100' : 'hover:bg-white/10'; 
  
   return ( 
     <> 
       <header 
         className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${ 
           isScrolled 
             ? 'bg-white/70 backdrop-blur-2xl border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-3 supports-[backdrop-filter]:bg-white/60' 
             : !isHomePage  
               ? 'bg-white/70 backdrop-blur-md border-gray-200/50 py-4 shadow-sm' // Estilo inicial para páginas que no son home 
               : 'bg-transparent border-transparent py-5' // Estilo inicial para home 
         }`} 
       > 
         <div className="container mx-auto px-4 md:px-8"> 
           <div className="flex items-center justify-between"> 
             {/* Logo */} 
             <Link href="/" className="flex-shrink-0 flex items-center gap-2 z-50 group"> 
               <div className="relative h-10 w-32 transition-transform duration-300 group-hover:scale-105"> 
                 <img 
                   src="/img/logo-hospelia.webp" 
                   alt="Hospelia Logo" 
                   className={`w-full h-full object-contain object-left transition-all duration-500 ${!useDarkStyle ? 'brightness-0 invert' : ''}`} 
                   loading="eager"
                   decoding="async"
                 /> 
               </div> 
             </Link> 
  
             {/* Right Menu */} 
             <div className="flex items-center gap-4 md:gap-8"> 
               <nav className="hidden md:flex items-center gap-8"> 
                 <Link  
                   href="/blog"  
                   className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`} 
                 > 
                   {t('nav.blog')} 
                 </Link> 
  
                 <Link  
                   href="/hazte-anfitrion"  
                   className={`text-sm font-medium transition-colors duration-300 ${textColorClass}`} 
                 > 
                   {t('Hazte Anfitrión')} 
                 </Link> 
               </nav> 
                
               <div className="flex items-center gap-3"> 
                 {/* Language Selector */} 
                 <div className="relative"> 
                   <button  
                     onClick={() => setShowLanguageMenu(!showLanguageMenu)} 
                     className={`p-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${textColorClass} ${languageButtonClass}`} 
                   > 
                     <FaGlobe size={16} /> 
                     <span className="text-xs font-bold uppercase tracking-wide">{language}</span> 
                   </button> 
  
                   {/* Language Dropdown */} 
                   {showLanguageMenu && ( 
                     <div className="absolute top-full right-0 mt-4 w-44 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5"> 
                       <button 
                         onClick={() => { setLanguage('es'); setShowLanguageMenu(false); }} 
                         className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50/80 flex items-center justify-between transition-colors ${ 
                           language === 'es' ? 'font-bold text-blue-600' : 'text-gray-700' 
                         }`} 
                       > 
                         <span>Español</span> 
                         {language === 'es' && <span className="text-blue-600">✓</span>} 
                       </button> 
                       <button 
                         onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }} 
                         className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50/80 flex items-center justify-between transition-colors ${ 
                           language === 'en' ? 'font-bold text-blue-600' : 'text-gray-700' 
                         }`} 
                       > 
                         <span>English</span> 
                         {language === 'en' && <span className="text-blue-600">✓</span>} 
                       </button> 
                     </div> 
                   )} 
                 </div> 
  
                 {/* Desktop Functional Menu (Book Now WhatsApp) */} 
                 <div className="hidden md:flex items-left gap-3"> 
                   <button  
                     onClick={handleBookNow} 
                     className="text-sm font-bold bg-green-500 text-white px-5 py-2.5 rounded-full hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2" 
                   > 
                     <FaWhatsapp size={18} /> 
                     {t('nav.bookNow')} 
                   </button> 
                 </div> 
  
                 {/* Mobile Menu Toggle (Sidebar Trigger) */} 
                 <button  
                   className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200/50 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 ${textColorClass}`} 
                   onClick={() => setIsSidebarOpen(true)} 
                 > 
                   <FaTh size={16} /> 
                   <span className="text-sm font-semibold">Menú</span> 
                 </button> 
               </div> 
             </div> 
           </div> 
         </div> 
       </header> 
  
       {/* Mobile Bottom Sheet Menu */} 
       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}> 
         {/* Backdrop */} 
         <div  
           className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
           onClick={() => setIsSidebarOpen(false)} 
         /> 
          
         {/* Bottom Sheet Content */} 
         <div  
           className={`absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full'}`} 
         > 
           {/* Handle bar for visual cue */} 
           <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsSidebarOpen(false)}> 
             <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div> 
           </div> 
  
           <div className="p-6 pb-8"> 
             <div className="flex justify-between items-center mb-6"> 
               <h2 className="text-xl font-bold text-gray-900">Hospelia</h2> 
               <button  
                 onClick={() => setIsSidebarOpen(false)} 
                 className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" 
               > 
                 <FaTimes size={20} /> 
               </button> 
             </div> 
  
             {/* Grid Navigation */} 
             <div className="grid grid-cols-2 gap-4 mb-8"> 
               <Link  
                 href="/blog"  
                 onClick={() => setIsSidebarOpen(false)} 
                 className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors flex flex-col gap-2" 
               > 
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"> 
                   <FaInfoCircle size={20} /> 
                 </div> 
                 <div> 
                   <h3 className="font-bold text-gray-900 text-sm">{t('nav.blog')}</h3> 
                   <p className="text-xs text-gray-500">Guías y artículos</p> 
                 </div> 
               </Link> 
  
               <Link  
                 href="/hazte-anfitrion"  
                 onClick={() => setIsSidebarOpen(false)} 
                 className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors flex flex-col gap-2" 
               > 
                 <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"> 
                   <FaHome size={20} /> 
                 </div> 
                 <div> 
                   <h3 className="font-bold text-gray-900 text-sm">{t('nav.host')}</h3> 
                   <p className="text-xs text-gray-500">Gana dinero</p> 
                 </div> 
               </Link> 
  
               <button  
                 onClick={() => { setLanguage(language === 'es' ? 'en' : 'es'); }} 
                 className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors flex flex-col gap-2 text-left" 
               > 
                 <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"> 
                   <FaGlobe size={20} /> 
                 </div> 
                 <div> 
                   <h3 className="font-bold text-gray-900 text-sm">Idioma</h3> 
                   <p className="text-xs text-gray-500">{language === 'es' ? 'Español (ES)' : 'English (EN)'}</p> 
                 </div> 
               </button> 
  
               <Link  
                 href="#"  
                 onClick={() => setIsSidebarOpen(false)} 
                 className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors flex flex-col gap-2" 
               > 
                 <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"> 
                   <FaUserCircle size={20} /> 
                 </div> 
                 <div> 
                   <h3 className="font-bold text-gray-900 text-sm">{t('nav.login')}</h3> 
                   <p className="text-xs text-gray-500">Mi cuenta</p> 
                 </div> 
               </Link> 
             </div> 
  
             {/* Big Action Buttons */} 
             <div className="space-y-3"> 
               <button  
                 onClick={handleBookNow} 
                 className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform" 
               > 
                 <FaWhatsapp size={24} /> 
                 {t('nav.bookNow')} 
               </button> 
                
               <button  
                 onClick={() => setIsSidebarOpen(false)} 
                 className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform" 
               > 
                 <FaEnvelope size={20} /> 
                 Contactar 
               </button> 
             </div> 
  
           </div> 
         </div> 
       </div> 
     </> 
   ); 
 }
