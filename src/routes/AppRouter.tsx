import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CompleteProfil from '../pages/CompleteProfil'
import CreateRide from '../pages/CreateRide'
import Ride from '../pages/Ride'
import Search from '../pages/Search'
import RideDetails from '../pages/RideDetails'
import MyRide from '../pages/MyRide'
import MyReservations from '../pages/MyReservations'
import Vehicle from '../pages/Vehicle'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import AppLayout from '../components/layout/AppLayout'

export default function AppRouter() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/" element={<Ride />} />
      <Route path="/complete-profil" element={<CompleteProfil />} />
      <Route path="/create-trip" element={<CreateRide />} />
      <Route path="/trips/:id" element={<RideDetails />} />
      <Route path="/search" element={<Search />} />
      <Route path="/my-trips" element={<MyRide />} />
      <Route path="/my-reservations" element={<MyReservations />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/vehicle" element={<Vehicle />} />
      </Route>
    </Routes>
  )
}
