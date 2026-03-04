import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllTrips } from '../api/tripsApi'
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

export default function Ride() {
  const { data: trips, isLoading, isError } = useQuery({
    queryKey: ['trips'],
    queryFn: getAllTrips,
  })

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A365D]">Les trajets</h1>
          <Link
            to="/create-trip"
            className="bg-[#E97A2B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#d06b22] transition-colors"
          >
            + Publier
          </Link>
        </div>

        {/* Lien recherche */}
        <Link
          to="/search"
          className="flex items-center gap-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 text-sm mb-6 hover:border-[#1A365D]/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          Rechercher un trajet...
        </Link>

        {/* Liste */}
        <div className="space-y-3">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {isError && (
            <p className="text-center text-red-500 py-8">Erreur lors du chargement des trajets.</p>
          )}

          {!isLoading && !isError && trips?.length === 0 && (
            <p className="text-center text-gray-500 py-12">Aucun trajet disponible.</p>
          )}

          {trips?.map((ride) => <RideCard key={ride.id} ride={ride} />)}
        </div>
      </div>
    </div>
  )
}
