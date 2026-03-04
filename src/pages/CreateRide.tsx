import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from '../components/ui/Stepper'
import AddressInput from '../components/ui/AddressInput'
import { toAddressRequest } from '../utils/formatAddress'
import { haversineKm } from '../utils/distance'
import { createTrip } from '../api/tripsApi'
import type { AddressSuggestion, AddressRequest } from '../utils/formatAddress'

const STEPS = ['Départ', 'Arrivée', 'Détails', 'Récapitulatif']

interface RideForm {
  startLabel: string
  startAddress: AddressRequest | null
  arrivalLabel: string
  arrivalAddress: AddressRequest | null
  date: string
  time: string
  seats: number
}

export default function CreateRide() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<RideForm>({
    startLabel: '',
    startAddress: null,
    arrivalLabel: '',
    arrivalAddress: null,
    date: '',
    time: '',
    seats: 1,
  })

  const distance =
    form.startAddress && form.arrivalAddress
      ? haversineKm(
          form.startAddress.latitude,
          form.startAddress.longitude,
          form.arrivalAddress.latitude,
          form.arrivalAddress.longitude,
        )
      : null

  const validateStep = (): string => {
    if (currentStep === 0 && !form.startAddress) return "Sélectionnez une adresse de départ"
    if (currentStep === 1 && !form.arrivalAddress) return "Sélectionnez une adresse d'arrivée"
    if (currentStep === 2) {
      if (!form.date) return 'La date est requise'
      if (!form.time) return "L'heure est requise"
    }
    return ''
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setCurrentStep((s) => s + 1)
  }

  const handlePrev = () => {
    setError('')
    setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    if (!form.startAddress || !form.arrivalAddress || !distance) return
    setLoading(true)
    setError('')
    try {
      const tripDatetime = new Date(`${form.date}T${form.time}:00`).toISOString()
      await createTrip({
        kms: distance,
        availableSeats: form.seats,
        tripDatetime,
        startingAddress: form.startAddress,
        arrivalAddress: form.arrivalAddress,
      })
      navigate('/my-trips')
    } catch {
      setError('Erreur lors de la publication, réessayez')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-[#1A365D] mb-8 text-center">
          Publier un trajet
        </h1>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
        >
          {/* Étape 1 — Départ */}
          {currentStep === 0 && (
            <AddressInput
              label="Adresse de départ"
              placeholder="Rue, ville..."
              value={form.startLabel}
              onChange={(val) => setForm((f) => ({ ...f, startLabel: val, startAddress: null }))}
              onSelect={(s: AddressSuggestion) =>
                setForm((f) => ({ ...f, startLabel: s.label, startAddress: toAddressRequest(s) }))
              }
            />
          )}

          {/* Étape 2 — Arrivée */}
          {currentStep === 1 && (
            <AddressInput
              label="Adresse d'arrivée"
              placeholder="Rue, ville..."
              value={form.arrivalLabel}
              onChange={(val) => setForm((f) => ({ ...f, arrivalLabel: val, arrivalAddress: null }))}
              onSelect={(s: AddressSuggestion) =>
                setForm((f) => ({
                  ...f,
                  arrivalLabel: s.label,
                  arrivalAddress: toAddressRequest(s),
                }))
              }
            />
          )}

          {/* Étape 3 — Détails */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Places disponibles
                </label>
                <select
                  value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                >
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Étape 4 — Récapitulatif */}
          {currentStep === 3 && (
            <div className="space-y-3 text-sm">
              <div className="bg-[#F3F4F6] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A365D] w-20 shrink-0">Départ</span>
                  <span className="text-gray-700">{form.startLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A365D] w-20 shrink-0">Arrivée</span>
                  <span className="text-gray-700">{form.arrivalLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A365D] w-20 shrink-0">Distance</span>
                  <span className="text-gray-700">{distance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A365D] w-20 shrink-0">Date</span>
                  <span className="text-gray-700">
                    {new Date(`${form.date}T${form.time}`).toLocaleString('fr-FR', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A365D] w-20 shrink-0">Places</span>
                  <span className="text-gray-700">{form.seats}</span>
                </div>
              </div>
              {loading && (
                <p className="text-center text-sm text-gray-500">Publication en cours...</p>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </Stepper>
      </div>
    </div>
  )
}
