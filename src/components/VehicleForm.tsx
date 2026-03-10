import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getBrands, getModelsByBrand, createCar, updateCar } from '../api/carsApi'
import type { VehicleResponse } from '../api/carsApi'

const REGISTRATION_REGEX = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/

interface VehicleFormProps {
  vehicle?: VehicleResponse
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const navigate = useNavigate()
  const isEdit = !!vehicle

  const [brandId, setBrandId] = useState<number | null>(null)
  const [brand, setBrand] = useState(vehicle?.brand ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [seats, setSeats] = useState(vehicle?.seats ?? 1)
  const [carregistration, setCarregistration] = useState(vehicle?.carregistration ?? '')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  })

  // En mode édition, pré-sélectionner le brandId quand les marques sont chargées
  useEffect(() => {
    if (vehicle && brands && !brandId) {
      const match = brands.find((b) => b.label === vehicle.brand)
      if (match) setBrandId(match.id)
    }
  }, [vehicle, brands, brandId])

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', brandId],
    queryFn: () => getModelsByBrand(brandId!),
    enabled: !!brandId,
  })

  const mutation = useMutation({
    mutationFn: (payload: { brand: string; model: string; seats: number; carregistration: string }) =>
      isEdit ? updateCar(vehicle.id, payload) : createCar(payload),
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => navigate('/vehicle'), 1500)
    },
    onError: () => {
      setFormError('Erreur lors de l\'enregistrement, réessayez')
    },
  })

  const validate = (): string => {
    if (!brand) return 'La marque est requise'
    if (!model.trim()) return 'Le modèle est requis'
    if (!REGISTRATION_REGEX.test(carregistration)) return 'Immatriculation invalide (ex: AB-123-CD)'
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setFormError(err); return }
    setFormError('')
    mutation.mutate({ brand, model: model.trim(), seats, carregistration })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Marque */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
        <select
          value={brandId ?? ''}
          onChange={(e) => {
            const selected = brands?.find((b) => b.id === Number(e.target.value))
            setBrandId(selected?.id ?? null)
            setBrand(selected?.label ?? '')
            setModel('')
          }}
          disabled={brandsLoading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D] disabled:bg-gray-100"
        >
          <option value="">— Sélectionner —</option>
          {brands?.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
      </div>

      {/* Modèle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!brandId || modelsLoading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D] disabled:bg-gray-100"
        >
          <option value="">{!brandId ? 'Choisissez d\'abord une marque' : '— Sélectionner —'}</option>
          {models?.map((m) => (
            <option key={m.id} value={m.label}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Places */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de places
        </label>
        <select
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Immatriculation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
        <input
          type="text"
          value={carregistration}
          onChange={(e) => setCarregistration(e.target.value.toUpperCase())}
          placeholder="AB-123-CD"
          maxLength={9}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D] uppercase"
        />
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 text-center font-medium">
          {isEdit ? 'Véhicule mis à jour !' : 'Véhicule ajouté !'}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending || success}
        className="w-full bg-[#E97A2B] text-white font-semibold py-2.5 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
      >
        {mutation.isPending ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Ajouter le véhicule'}
      </button>
    </form>
  )
}
