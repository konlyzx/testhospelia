import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Chatbot from "./components/Chatbot";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { RecommendationProvider } from '@/contexts/RecommendationContext';
import AppInitializer from "@/components/AppInitializer";

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
  title: "Hospelia.co | Alojamientos en Cali",
  description: "Encuentra apartamentos amoblados, céntricos y con todas las comodidades en Cali.",
  keywords: "apartamentos, alojamientos, Cali, amoblados, hospedaje",
  openGraph: {
    title: "Hospelia.co | Alojamientos en Cali",
    description: "Encuentra apartamentos amoblados, céntricos y con todas las comodidades en Cali.",
    type: "website",
    locale: "es_CO",
  },
  robots: {
    index: true,
    follow: true,
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

        {/* Ahrefs Web Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="+KTC6G4Kj1NHAuKA/N3UtA" async></script>
      </head>
      <body className="antialiased">
        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
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

        <WhatsAppButton />
        <Chatbot />

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
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    user_data: {
                      em: purchaseData.email ? [purchaseData.email] : [null],
                      ph: purchaseData.phone ? [purchaseData.phone] : [null]
                    },
                    attribution_data: {
                      attribution_share: "0.3"
                    },
                    custom_data: {
                      currency: purchaseData.currency || "USD",
                      value: purchaseData.value || "0"
                    },
                    original_event_data: {
                      event_name: "Purchase",
                      event_time: Math.floor(Date.now() / 1000)
                    }
                  }]
                };
                
                return await window.sendFacebookConversion(eventData);
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
