import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTrips } from '../api/tripsApi'
import type { SearchParams } from '../api/tripsApi'
import RideCard from '../components/ui/RideCard'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-40 mb-3" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>
    </div>
  )
}

export default function Search() {
  const [form, setForm] = useState({ startingCity: '', arrivalCity: '', tripDate: '' })
  const [submitted, setSubmitted] = useState<SearchParams | null>(null)

  const { data: trips, isLoading, isError } = useQuery({
    queryKey: ['trips', 'search', submitted],
    queryFn: () => searchTrips(submitted!),
    enabled: submitted !== null,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted({
      startingCity: form.startingCity.trim() || undefined,
      arrivalCity: form.arrivalCity.trim() || undefined,
      tripDate: form.tripDate || undefined,
    })
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A365D] mb-6">Rechercher un trajet</h1>

        {/* Formulaire */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville de départ
              </label>
              <input
                type="text"
                value={form.startingCity}
                onChange={(e) => setForm((f) => ({ ...f, startingCity: e.target.value }))}
                placeholder="Paris"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville d'arrivée
              </label>
              <input
                type="text"
                value={form.arrivalCity}
                onChange={(e) => setForm((f) => ({ ...f, arrivalCity: e.target.value }))}
                placeholder="Lyon"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.tripDate}
              onChange={(e) => setForm((f) => ({ ...f, tripDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1A365D] text-white font-semibold py-2 rounded-lg hover:bg-[#162d52] transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Résultats */}
        <div className="space-y-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

          {isError && (
            <p className="text-center text-red-500 py-8">Erreur lors de la recherche.</p>
          )}

          {submitted && !isLoading && !isError && trips?.length === 0 && (
            <p className="text-center text-gray-500 py-12">Aucun résultat pour cette recherche.</p>
          )}

          {trips?.map((ride) => <RideCard key={ride.id} ride={ride} />)}
        </div>
      </div>
    </div>
  )
}
