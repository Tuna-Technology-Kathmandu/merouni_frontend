import Header from '../../components/Frontpage/Header'
import Footer from '../../components/Frontpage/Footer'
import Navbar from '@/components/Frontpage/Navbar'

const WatchLayout = ({ children }) => {
    return (
        <>
            <Header />
            <Navbar/>
            <div className='min-h-screen bg-gray-50'>{children}</div>
            <Footer />
        </>
    )
}

export default WatchLayout
