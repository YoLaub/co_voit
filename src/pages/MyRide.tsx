import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyTrips, deleteTrip } from '../api/tripsApi'
import { useAuthStore } from '../store/authStore'
import type { RouteResponse } from '../api/tripsApi'

function RideRow({ ride, onDelete }: { ride: RouteResponse; onDelete: (id: number) => void }) {
  const navigate = useNavigate()

  const dt = new Date(ride.tripDatetime)
  const date = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      {/* Infos cliquables */}
      <button
        type="button"
        onClick={() => navigate(`/trips/${ride.id}`)}
        className="flex-1 text-left"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-[#1A365D]">{ride.startingAddress.cityName}</span>
          <span className="text-gray-400 text-sm">→</span>
          <span className="font-semibold text-[#1A365D]">{ride.arrivalAddress.cityName}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{date}</span>
          <span>{time}</span>
          <span
            className={[
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              ride.availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
            ].join(' ')}
          >
            {ride.availableSeats > 0 ? `${ride.availableSeats} place${ride.availableSeats > 1 ? 's' : ''}` : 'Complet'}
          </span>
        </div>
      </button>

      {/* Bouton supprimer */}
      <button
        type="button"
        onClick={() => onDelete(ride.id)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
        aria-label="Supprimer ce trajet"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default function MyRide() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: trips, isLoading, isError } = useQuery({
    queryKey: ['my-trips', user?.accountId],
    queryFn: () => getMyTrips(user!.accountId),
    enabled: !!user,
  })

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce trajet ?')) return
    try {
      await deleteTrip(id)
      await queryClient.invalidateQueries({ queryKey: ['my-trips', user?.accountId] })
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className=" bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A365D]">Mes trajets</h1>
          <Link
            to="/create-trip"
            className="bg-[#E97A2B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#d06b22] transition-colors"
          >
            + Publier
          </Link>
        </div>

        {/* Contenu */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-16" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-8">Erreur lors du chargement.</p>
        )}

        {!isLoading && !isError && trips?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore publié de trajet.</p>
            <Link
              to="/create-trip"
              className="inline-block bg-[#E97A2B] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#d06b22] transition-colors"
            >
              Publier un trajet
            </Link>
          </div>
        )}

        {trips && trips.length > 0 && (
          <div className="space-y-3">
            {trips.map((ride) => (
              <RideRow key={ride.id} ride={ride} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
