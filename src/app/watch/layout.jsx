import Header from '../../components/Frontpage/Header'
import Footer from '../../components/Frontpage/Footer'

const WatchLayout = ({ children }) => {
    return (
        <>
            <Header />
            <div className='min-h-screen bg-gray-50'>{children}</div>
            <Footer />
        </>
    )
}

export default WatchLayout
