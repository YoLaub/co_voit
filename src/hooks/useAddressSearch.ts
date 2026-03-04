import { useState, useRef } from 'react'
import type { AddressSuggestion } from '../utils/formatAddress'

export function useAddressSearch() {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchAddress = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 3) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
        )
        const json = await res.json() as {
          features: {
            properties: {
              label: string
              city: string
              postcode: string
              street: string
              housenumber: string
            }
            geometry: { coordinates: [number, number] }
          }[]
        }
        const results: AddressSuggestion[] = json.features.map((f) => ({
          label: f.properties.label,
          city: f.properties.city,
          postcode: f.properties.postcode,
          street: f.properties.street,
          housenumber: f.properties.housenumber,
          longitude: f.geometry.coordinates[0],
          latitude: f.geometry.coordinates[1],
        }))
        setSuggestions(results)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const clear = () => {
    setSuggestions([])
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  return { suggestions, loading, searchAddress, clear }
}
