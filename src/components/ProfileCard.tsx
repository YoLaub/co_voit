import type { ProfilResponse } from '../api/profilApi'
import type { AuthUser } from '../store/authStore'

interface ProfileCardProps {
  profil: ProfilResponse
  authUser: AuthUser
}

export default function ProfileCard({ profil, authUser }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar initiales */}
        <div className="w-14 h-14 rounded-full bg-[#1A365D] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {profil.firstname[0]}{profil.lastname[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1A365D]">
            {profil.firstname} {profil.lastname}
          </h2>
          <p className="text-sm text-gray-500">{authUser.email}</p>
        </div>
        {profil.hasVehicle && (
          <span className="ml-auto text-xs font-semibold bg-[#1A365D]/10 text-[#1A365D] px-2.5 py-1 rounded-full">
            Conducteur
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Téléphone :</span> {profil.phone}
      </div>
    </div>
  )
}
