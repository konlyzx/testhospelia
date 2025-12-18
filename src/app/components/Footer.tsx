'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de suscripción
    setEmail("");
    alert("¡Gracias por suscribirte!");
  };

  const footerLinks = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: "/sobre-nosotros" },
        { name: t('footer.careers'), href: "/empleo" },
        { name: t('footer.press'), href: "/prensa" },
        { name: t('footer.help'), href: "/ayuda" },
      ],
    },
    {
      title: t('footer.discover'),
      links: [
        { name: t('footer.lodgings'), href: "/propiedades" },
        { name: t('footer.experiences'), href: "/experiencias" },
      ],
    },
    {
      title: t('footer.zones'),
      links: [
        { name: "Apartamentos amoblados en Cali", href: "/apartamentos-amoblados-en-cali" },
        { name: "Alquiler temporal en Cali", href: "/alquiler-temporal-en-cali" },
        { name: "Apartamentos en Bochalema", href: "/apartamentos-en-bochalema" },
        { name: "Apartamentos en el sur de Cali", href: "/apartamentos-en-el-sur-de-cali" },
        { name: "Apartamentos por días en Cali", href: "/apartamentos-por-dias-en-cali" },
        { name: "Airbnb en Cali", href: "/airbnb-en-cali" },
        { name: "Alojamiento amoblado en Cali", href: "/alojamiento-amoblado-en-cali" },
        { name: "Apartamentos cerca de Univalle", href: "/apartamentos-cerca-de-univalle" },
        { name: "Alquiler apartamentos turísticos Cali", href: "/alquiler-apartamentos-turisticos-cali" },
        { name: "Apartamentos amoblados económicos Cali", href: "/apartamentos-amoblados-economicos-cali" },
      ],
    },
    {
      title: t('footer.hosts'),
      links: [
        { name: t('footer.become_host'), href: "/hazte-anfitrion" },
        { name: t('footer.resources'), href: "/recursos-anfitrion" },
        { name: t('footer.community'), href: "/comunidad" },
        { name: t('footer.help_center'), href: "/centro-ayuda" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <FaFacebook className="h-5 w-5" />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <FaInstagram className="h-5 w-5" />,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: <FaTwitter className="h-5 w-5" />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: <FaYoutube className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="bg-gray-50 text-gray-600 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
               <img src="/img/logo-hospelia.webp" alt="Hospelia" className="h-10 w-auto" />
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={item.name}
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:pl-12 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('footer.newsletter.title')}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {t('footer.newsletter.subtitle')}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {t('footer.newsletter.button')}
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-200 mb-12" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-500 hover:text-blue-600 transition-colors text-sm hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} <span className="font-semibold text-gray-700">Hospelia</span>. {t('footer.rights_reserved') || 'Todos los derechos reservados.'}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/terminos" 
              className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              {t('footer.terms')}
            </Link>
            <Link 
              href="/privacidad" 
              className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              {t('footer.privacy')}
            </Link>
            <Link 
              href="/cookies" 
              className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              {t('footer.cookies')}
            </Link>
            <Link 
              href="/accesibilidad" 
              className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              {t('footer.accessibility')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
