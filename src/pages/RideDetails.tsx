import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTripById } from '../api/tripsApi'
import { reserveTrip, getTripPassengers  } from '../api/reservationsApi'
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

  const { data: passengers } = useQuery({
    queryKey: ['trip-passengers', id],
    queryFn: () => getTripPassengers(Number(id)),
    enabled: !!id,
})

const mutation = useMutation({
    mutationFn: () => reserveTrip(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] })
      queryClient.invalidateQueries({ queryKey: ['trip-passengers', id] })
    },
})

  if (isLoading) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !trip) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <p className="text-red-500">Trajet introuvable.</p>
      </div>
    )
  }

  const dt = new Date(`${trip.date}T${trip.hour}`)
  const date = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const isDriver = user?.email === trip.driver.email
  const isPassenger = passengers?.some((p) => p.email === user?.email) ?? false
  const noSeats = trip.availableSeats === 0
  const canReserve = !isDriver && !isPassenger && !noSeats && !mutation.isSuccess
  const canContact = !isDriver && !noSeats && !mutation.isSuccess

  const errorMessage = mutation.isError
    ? ((mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message
      ?? 'Erreur lors de la réservation, réessayez')
    : ''

  return (
    <div className=" bg-[#F3F4F6] py-8 px-4">
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
          <Field label="Départ" value={`${trip.departure.streetName}, ${trip.departure.cityName}`} />
          <Field label="Arrivée" value={`${trip.arrival.streetName}, ${trip.arrival.cityName}`} />
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
            hidden={!canContact || mutation.isPending}
            className="w-12 h-12 bg-[#1A365D] text-white rounded-xl flex items-center justify-center hover:bg-[#162d52] transition-colors shrink-0"
            aria-label="Appeler"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
          <a
            href={`mailto:${trip.driver.email}`}
            hidden={!canContact || mutation.isPending}
            className="w-12 h-12 bg-[#1A365D] text-white rounded-xl flex items-center justify-center hover:bg-[#162d52] transition-colors shrink-0"
            aria-label="Envoyer un email"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            hidden={!canReserve || mutation.isPending}
            className="flex-1 bg-[#E97A2B] text-white font-semibold py-3 rounded-xl hover:bg-[#d06b22] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? '...' : mutation.isSuccess ? 'Réservé' : 'Réserver'}
          </button>
        </div>
      </div>
    </div>
  )
}
