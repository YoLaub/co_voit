export interface AddressSuggestion {
  label: string
  city: string
  postcode: string
  street: string
  housenumber: string
  latitude: number
  longitude: number
}

export interface AddressRequest {
  streetNumber?: string
  streetName: string
  postalCode: string
  city: string          // ← cityName → city
  latitude: number
  longitude: number
}

export function toAddressRequest(suggestion: AddressSuggestion): AddressRequest {
  return {
    streetNumber: suggestion.housenumber || undefined,
    streetName: suggestion.street || suggestion.label,
    postalCode: suggestion.postcode,
    city: suggestion.city,    // ← cityName → city
    latitude: suggestion.latitude,
    longitude: suggestion.longitude,
  }
}
