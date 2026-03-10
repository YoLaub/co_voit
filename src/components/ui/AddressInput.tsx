import { useRef, useEffect } from 'react'
import { useAddressSearch } from '../../hooks/useAddressSearch'
import type { AddressSuggestion } from '../../utils/formatAddress'

interface AddressInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
}

export default function AddressInput({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
}: AddressInputProps) {
  const { suggestions, loading, searchAddress, clear } = useAddressSearch()
  const containerRef = useRef<HTMLDivElement>(null)

  // Fermer la liste si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        clear()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clear])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    searchAddress(e.target.value)
  }

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.label)
    onSelect(suggestion)
    clear()
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full border bg-white border-gray-200 rounded-lg shadow-md overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
