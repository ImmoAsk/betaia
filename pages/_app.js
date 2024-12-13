import SSRProvider from 'react-bootstrap/SSRProvider'
import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import { SessionProvider } from 'next-auth/react'
import ScrollTopButton from '../components/ScrollTopButton'
import '../scss/theme.scss'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { useEffect } from 'react';
import Script from 'next/script';
const GA_MEASUREMENT_ID = 'G-2K9WB0X66W'; // Replace with your Measurement ID
const queryClient = new QueryClient();
const ImmoAsk = ({ Component, pageProps: { session, ...pageProps } }) => {

  // Bind NProgress to Next Router events (Page loading animation)
  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())
  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    };
    const router = require('next/router').default;
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ImmoAsk | Immobilier, Foncier, Tourisme, Décoration, BTP au Togo</title>
        <meta name='description' content='Découvrez les meilleures offres immobilières au Togo. Trouvez facilement un logement urbain ou rural à louer, ainsi que des terrains et immeubles à acheter en toute sécurité. ImmoAsk vous accompagne dans l&rsquo;achat, la vente, la location et la gestion de patrimoine immobilier.' />
        <meta name='keywords' content='immobilier Togo, foncier, location, vente, gestion de patrimoine, agent immobilier IA, tourisme, décoration, BTP' />
        <meta name='author' content='Omnisoft Africa' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='icon' type='image/x-icon' href='/favicon/favicon.ico' />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link rel='mask-icon' color='#5bbad5' href='/favicon/safari-pinned-tab.svg' />
        <meta name='msapplication-TileColor' content='#766df4' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          {/* Google Analytics Script */}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>

      <ScrollTopButton
        showOffset={600}
        duration={800}
        easing='easeInOutQuart'
        tooltip='En haut'
      />
    </SSRProvider>
  )
}

export default ImmoAsk