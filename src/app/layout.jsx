import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import ReduxProvider from '../ui/molecules/ReduxProvider'
import ReactQueryContainer from '@/container/HOC/ReactQueryContainer'
import BProgressProvider from '../ui/molecules/BProgressProvider'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  title: 'Mero UNI ',
  description: 'Mero Uni is a platform where you can find your dream education.'
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ReduxProvider>
          <ReactQueryContainer>
            <BProgressProvider>
              <main>{children}</main>
            </BProgressProvider>
            <ToastContainer
              position='top-right'
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
            />
          </ReactQueryContainer>
        </ReduxProvider>
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-C5JXZHZZC2'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C5JXZHZZC2');
          `}
        </Script>
      </body>
    </html>
  )
}
