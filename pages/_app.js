import SSRProvider from 'react-bootstrap/SSRProvider'
import Router from 'next/router'
import Head from 'next/head'
import NProgress from 'nprogress'
import { SessionProvider } from 'next-auth/react'
import ScrollTopButton from '../components/ScrollTopButton'
import '../scss/theme.scss'
import { QueryClient,QueryClientProvider,} from '@tanstack/react-query'

const queryClient = new QueryClient();
const Finder = ({ Component, pageProps: { session, ...pageProps }}) => {

  // Bind NProgress to Next Router events (Page loading animation)
  Router.events.on('routeChangeStart', () => NProgress.start())
  Router.events.on('routeChangeComplete', () => NProgress.done())
  Router.events.on('routeChangeError', () => NProgress.done())
  
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ImmoAsk | Immobilier, Foncier, Tourisme, Décoration, BTP</title>
        <meta name='description' content='Immobilier au Togo' />
        <meta name='keywords' content='immobilier, foncier, location, vente,gestion, patrimoine' />
        <meta name='author' content='Omnisoft Africa' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link rel='mask-icon' color='#5bbad5' href='/favicon/safari-pinned-tab.svg' />
        <meta name='msapplication-TileColor' content='#766df4' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} basePath='/api/auth' baseUrl='http://beta.immoask.com'>
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

export default Finder