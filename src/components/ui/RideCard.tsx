import { useNavigate } from 'react-router-dom'
import type { RouteResponse } from '../../api/tripsApi'

interface RideCardProps {
  ride: RouteResponse
}

export default function RideCard({ ride }: RideCardProps) {
  const navigate = useNavigate()

  const dt = new Date(ride.tripDatetime)
  const date = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <button
      type="button"
      onClick={() => navigate(`/trips/${ride.id}`)}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-[#1A365D]/20 transition-all"
    >
      {/* Trajet */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-[#1A365D]">
          {ride.startingAddress.cityName}
        </span>
        <span className="text-gray-400">→</span>
        <span className="font-semibold text-[#1A365D]">
          {ride.arrivalAddress.cityName}
        </span>
        <span className="ml-auto text-xs text-gray-400">{ride.kms} km</span>
      </div>

      {/* Détails */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{date}</span>
        <span className="font-medium">{time}</span>
      </div>

      {/* Bas de carte */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm text-gray-500">{ride.driverName}</span>
        <span
          className={[
            'text-xs font-semibold px-2.5 py-1 rounded-full',
            ride.availableSeats > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600',
          ].join(' ')}
        >
          {ride.availableSeats > 0 ? `${ride.availableSeats} place${ride.availableSeats > 1 ? 's' : ''}` : 'Complet'}
        </span>
      </div>
    </button>
  )
}
