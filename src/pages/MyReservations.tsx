import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyReservations, cancelReservation } from '../api/reservationsApi'
import type { ReservationResponse } from '../api/reservationsApi'

const STATUS_STYLES: Record<ReservationResponse['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<ReservationResponse['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
}

interface ConfirmModalProps {
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}

function ConfirmModal({ onConfirm, onClose, isPending }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-[#1A365D] mb-2">Annuler la réservation ?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Cette action est irréversible. Le trajet récupérera une place disponible.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Annulation...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface ReservationRowProps {
  reservation: ReservationResponse
  onCancel: (reservation: ReservationResponse) => void
}

function ReservationRow({ reservation, onCancel }: ReservationRowProps) {
  const navigate = useNavigate()
  const { route, status } = reservation

  const dt = new Date(route.tripDatetime)
  const date = dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <button
        type="button"
        onClick={() => navigate(`/trips/${route.id}`)}
        className="w-full text-left mb-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-[#1A365D]">{route.startingAddress.cityName}</span>
          <span className="text-gray-400">→</span>
          <span className="font-semibold text-[#1A365D]">{route.arrivalAddress.cityName}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{date}</span>
          <span>{time}</span>
          <span className="text-gray-400">· {route.driverName}</span>
        </div>
      </button>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        {status !== 'cancelled' && (
          <button
            type="button"
            onClick={() => onCancel(reservation)}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyReservations() {
  const queryClient = useQueryClient()
  const [toCancel, setToCancel] = useState<ReservationResponse | null>(null)
  const [successId, setSuccessId] = useState<number | null>(null)

  const { data: reservations, isLoading, isError } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: getMyReservations,
  })

  const mutation = useMutation({
    mutationFn: (tripId: number) => cancelReservation(tripId),
    onSuccess: () => {
      const id = toCancel?.id ?? null
      setToCancel(null)
      setSuccessId(id)
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] })
      setTimeout(() => setSuccessId(null), 3000)
    },
  })

  const handleConfirmCancel = () => {
    if (toCancel) mutation.mutate(toCancel.route.id)
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A365D] mb-6">Mes réservations</h1>

        {/* Toast succès */}
        {successId !== null && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 text-center font-medium">
            Réservation annulée.
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-20" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-8">Erreur lors du chargement.</p>
        )}

        {!isLoading && !isError && reservations?.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucune réservation pour le moment.</p>
        )}

        {reservations && reservations.length > 0 && (
          <div className="space-y-3">
            {reservations.map((r) => (
              <ReservationRow key={r.id} reservation={r} onCancel={setToCancel} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      {toCancel && (
        <ConfirmModal
          onConfirm={handleConfirmCancel}
          onClose={() => setToCancel(null)}
          isPending={mutation.isPending}
        />
      )}
    </div>
  )
}
