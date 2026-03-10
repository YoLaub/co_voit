import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyCar, deleteCar } from '../api/carsApi'
import VehicleForm from '../components/VehicleForm'

function ConfirmDeleteModal({
  onConfirm,
  onClose,
  isPending,
}: {
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-[#1A365D] mb-2">Supprimer le véhicule ?</h2>
        <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Vehicle() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['my-car'],
    queryFn: getMyCar,
    retry: false,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteCar(vehicle!.id),
    onSuccess: () => {
      setShowDeleteModal(false)
      queryClient.invalidateQueries({ queryKey: ['my-car'] })
    },
  })

  if (isLoading) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hasVehicle = !isError && !!vehicle

  return (
    <div className=" bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-[#1A365D] mb-6">Mon véhicule</h1>

        {/* Pas de véhicule → formulaire création */}
        {!hasVehicle && !editing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-5">Vous n'avez pas encore ajouté de véhicule.</p>
            <VehicleForm />
          </div>
        )}

        {/* Véhicule existant — vue détail */}
        {hasVehicle && !editing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold text-[#1A365D]">
                {vehicle.brand} {vehicle.model}
              </h2>
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {vehicle.carregistration}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">{vehicle.seats}</span> place{vehicle.seats > 1 ? 's' : ''}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex-1 bg-[#1A365D] text-white font-semibold py-2.5 rounded-xl hover:bg-[#162d52] transition-colors"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 border border-red-300 text-red-500 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* Formulaire édition */}
        {hasVehicle && editing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1A365D]">Modifier le véhicule</h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Annuler
              </button>
            </div>
            <VehicleForm vehicle={vehicle} />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={() => deleteMutation.mutate()}
          onClose={() => setShowDeleteModal(false)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  )
}
