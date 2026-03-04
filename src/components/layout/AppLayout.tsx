import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex mt-15">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}