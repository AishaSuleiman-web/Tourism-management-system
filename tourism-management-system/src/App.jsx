import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails'
import MyBookings from './pages/MyBookings'
import Home from "./pages/Home";
import About from "./pages/About"
import NotFound from "./pages/NotFound";
import Contact from "./pages/contact"
import AdminRoute from "./components/AdminRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminHotels from "./pages/admin/AdminHotels"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminBookings from "./pages/admin/AdminBookings"
import ResetPassword from './pages/ResetPassword'
import GuideDetails from './pages/GuideDetails'
import Guides from './pages/Guides'
import Packages from './pages/Packages'
import PackageDetails from './pages/PackageDetails'
import AdminPackages from "./pages/admin/AdminPackages"
import AdminGuides from "./pages/admin/AdminGuides"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/guides" element={<Guides />} />
              <Route path="/guide/:id" element={<GuideDetails />} />

              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:id" element={<PackageDetails />} />

         <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="guides" element={<AdminGuides />} />
                </Route>
          <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>

          
  )
}

export default App