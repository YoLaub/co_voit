import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMyProfil } from '../api/profilApi'
import { useAuthStore } from '../store/authStore'
import ProfileCard from '../components/ProfileCard'

interface QuickLinkProps {
  to: string
  label: string
  icon: string
}

function QuickLink({ to, label, icon }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3.5 hover:border-[#1A365D]/20 hover:shadow-sm transition-all"
    >
      <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const { data: profil, isLoading, isError } = useQuery({
    queryKey: ['profil', 'me'],
    queryFn: () => getMyProfil(),
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !profil || !user) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <p className="text-red-500">Impossible de charger le profil.</p>
      </div>
    )
  }

  return (
    <div className=" bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-[#1A365D]">Mon profil</h1>

        {/* Carte profil */}
        <ProfileCard profil={profil} authUser={user} />

        {/* Bouton modifier */}
        <Link
          to="/profile/edit"
          className="flex items-center justify-center w-full bg-[#1A365D] text-white font-semibold py-3 rounded-xl hover:bg-[#162d52] transition-colors"
        >
          Modifier mon profil
        </Link>

        {/* Liens rapides */}
        <div className="space-y-2 pt-2">
          <QuickLink to="/my-trips" label="Mes trajets" icon="🚗" />
          <QuickLink to="/my-reservations" label="Mes réservations" icon="🎫" />
          <QuickLink to="/vehicle" label="Mon véhicule" icon="🔧" />
        </div>

        {/* Déconnexion */}
        <button
          type="button"
          onClick={logout}
          className="w-full border border-gray-300 text-gray-500 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors mt-4"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
