import { Poppins } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import ReduxProvider from '../components/ReduxProvider'
import ReactQueryContainer from '@/container/HOC/ReactQueryContainer'
import BProgressProvider from '../components/BProgressProvider'

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
      </body>
    </html>
  )
}
