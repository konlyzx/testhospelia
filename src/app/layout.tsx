import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { RecommendationProvider } from '@/contexts/RecommendationContext';
import AppInitializer from "@/components/AppInitializer";
import DeferredWidgets from "./components/DeferredWidgets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hospelia.co | Alojamientos en Cali con apartamentos amoblados",
  description:
    "Encuentra alojamientos y apartamentos amoblados en Cali: ubicaciones céntricas, comodidades completas y reservas seguras para estancias cortas y largas.",
  keywords: "apartamentos, alojamientos, Cali, amoblados, hospedaje, estancias cortas, reservas",
  openGraph: {
    title: "Hospelia.co | Alojamientos en Cali",
    description:
      "Encuentra alojamientos y apartamentos amoblados en Cali: ubicaciones céntricas, comodidades completas y reservas seguras.",
    type: "website",
    locale: "es_CO",
    url: "https://hospelia.co/",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://hospelia.co/",
    languages: {
      "es-CO": "https://hospelia.co/",
      "x-default": "https://hospelia.co/",
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Global Error Catcher */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function (e) {
                document.body.innerHTML = '<pre style="background:#000;color:#f00;padding:1rem;">' +
                  'Error: ' + e.message + '\\n' +
                  'Source: ' + e.filename + ':' + e.lineno + ':' + e.colno + '\\n' +
                  (e.error && e.error.stack ? e.error.stack : '') +
                '</pre>';
              });
              window.addEventListener('unhandledrejection', function (e) {
                document.body.innerHTML = '<pre style="background:#000;color:#f00;padding:1rem;">' +
                  'UnhandledRejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason) + '\\n' +
                  (e.reason && e.reason.stack ? e.reason.stack : '') +
                '</pre>';
              });
            `,
          }}
        />

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://wp.hospelia.co" />

        <meta charSet="utf-8" />
        {/* Ahrefs site verification */}
        <meta
          name="ahrefs-site-verification"
          content="d38b90f794d34e4f448cd4a6a012383e96b4dade508d2f76817a058989e5d842"
        />

        {/* JSON-LD: Organization */}
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Hospelia',
              url: 'https://hospelia.co/',
              logo: 'https://hospelia.co/img/logo-hospelia.webp',
              sameAs: [
                'https://www.facebook.com/hospelia',
                'https://www.instagram.com/hospelia',
                'https://www.linkedin.com/company/hospelia',
                'https://x.com/hospelia',
                'https://www.youtube.com/@hospelia'
              ]
            }),
          }}
        />
        {/* JSON-LD: Website */}
        <Script
          id="schema-org-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Hospelia',
              url: 'https://hospelia.co/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://hospelia.co/alojamientos?query={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />

        {/* Ahrefs Web Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="+KTC6G4Kj1NHAuKA/N3UtA"
          async
        ></script>
      </head>
      <body className="antialiased">
        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?"&l="+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ND6BWZ2P');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-ND6BWZ2P"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <LanguageProvider>
          <CurrencyProvider>
            <RecommendationProvider>
              <LocaleProvider>
                <AppInitializer />
                {children}
              </LocaleProvider>
            </RecommendationProvider>
          </CurrencyProvider>
        </LanguageProvider>

        {/* Deferred client-only widgets to improve INP/TBT */}
        <DeferredWidgets />

        {/* Minimal Social Links Footer */}
        <footer className="mt-8 p-4 text-sm text-center text-gray-500">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://www.facebook.com/hospelia" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/hospelia" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/hospelia" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://x.com/hospelia" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.youtube.com/@hospelia" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </footer>

        {/* Google Analytics optimizado con next/script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-943201081"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'AW-943201081', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script
          id="gtag-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                  'send_to': 'AW-943201081/8GhRCMusjZICELm24MED',
                  'event_callback': callback
                });
                return false;
              }
            `,
          }}
        />

        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-24KSR9DCWR"
        />
        <Script
          id="gtag-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-24KSR9DCWR');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2059684518101612');
              fbq('track', 'PageView');
            `,
          }}
        />
        
        {/* Meta Pixel Noscript */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2059684518101612&ev=PageView&noscript=1"
            alt="Facebook Pixel tracking pixel"
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Facebook Conversions API - Función para enviar eventos */}
        <Script
          id="facebook-conversions-api"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Función para enviar eventos de conversión a Facebook Conversions API
              window.sendFacebookConversion = async function(eventData) {
                try {
                  const response = await fetch('/api/facebook/conversions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData)
                  });
                  
                  if (!response.ok) {
                    throw new Error('Error al enviar evento a Facebook Conversions API');
                  }
                  
                  const result = await response.json();
                  console.log('Evento enviado exitosamente:', result);
                  return result;
                } catch (error) {
                  console.error('Error al enviar evento:', error);
                  throw error;
                }
              };

              // Función específica para eventos de compra
              window.trackPurchase = async function(purchaseData) {
                const eventData = {
                  data: [{
                    event_name: "Purchase",
                  }]
                };
                return window.sendFacebookConversion(eventData);
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
