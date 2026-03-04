import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTripById } from '../api/tripsApi'
import { reserveTrip } from '../api/reservationsApi'
import { useAuthStore } from '../store/authStore'

interface FieldProps {
  label: string
  value: string
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  )
}

export default function RideDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: trip, isLoading, isError } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTripById(Number(id)),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: () => reserveTrip(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <p className="text-red-500">Trajet introuvable.</p>
      </div>
    )
  }

  const dt = new Date(trip.tripDatetime)
  const date = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const isDriver = user?.email === trip.driver.email
  const noSeats = trip.availableSeats === 0
  const canReserve = !isDriver && !noSeats && !mutation.isSuccess

  const errorMessage = mutation.isError
    ? ((mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Erreur lors de la réservation, réessayez')
    : ''

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#1A365D] flex-1 text-center">Détails trajet</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            aria-label="Retour"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Champs */}
        <div className="space-y-2 mb-6">
          <Field label="Conducteur" value={`${trip.driver.firstname} ${trip.driver.lastname}`} />
          <Field label="Départ" value={`${trip.startingAddress.streetName}, ${trip.startingAddress.cityName}`} />
          <Field label="Arrivée" value={`${trip.arrivalAddress.streetName}, ${trip.arrivalAddress.cityName}`} />
          <Field label="Date" value={date} />
          <Field label="Heure" value={time} />
          <Field label="Nombre de kilomètres" value={`${trip.kms} km`} />
          <Field label="Nombre de places" value={`${trip.availableSeats}`} />
          {trip.vehicle && (
            <>
              <Field label="Marque voiture" value={trip.vehicle.brand} />
              <Field label="Modèle de voiture" value={trip.vehicle.model} />
            </>
          )}
        </div>

        {/* Toast inline */}
        {mutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 text-center font-medium">
            Réservation confirmée !
          </div>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-3 text-center">{errorMessage}</p>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <a
            href={`tel:${trip.driver.phone}`}
            className="flex-1 bg-[#1A365D] text-white font-semibold py-3 rounded-xl text-center hover:bg-[#162d52] transition-colors"
          >
            Contacter
          </a>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={!canReserve || mutation.isPending}
            className="flex-1 bg-[#E97A2B] text-white font-semibold py-3 rounded-xl hover:bg-[#d06b22] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? '...' : mutation.isSuccess ? 'Réservé' : 'Réserver'}
          </button>
        </div>
      </div>
    </div>
  )
}
