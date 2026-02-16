import Footer from '@/components/Frontpage/Footer'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-gray-50 py-20 px-4">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="relative">
                        <h1 className="text-9xl font-black text-blue-600/10">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-4xl font-bold text-gray-900">Oops!</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xl font-semibold text-gray-700">Page Not Found</p>
                        <p className="text-gray-500">
                            The page you are looking for might have been removed, had its name
                            changed, or is temporarily unavailable.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
