import { http, HttpResponse } from 'msw'

export const mockDriver = {
  profilId: 1,
  firstname: 'Jean',
  lastname: 'Dupont',
  phone: '0612345678',
  email: 'driver@test.com',
}

export const mockPassengers = [
  {
    profilId: 2,
    firstname: 'Marie',
    lastname: 'Martin',
    phone: '0698765432',
    email: 'passenger@test.com',
  },
  {
    profilId: 3,
    firstname: 'Pierre',
    lastname: 'Durand',
    phone: '0611223344',
    email: 'pierre@test.com',
  },
]

export const mockTrip = {
  id: 1,
  departure: {
    id: 1,
    streetName: 'Rue de Paris',
    postalCode: '75001',
    cityName: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  arrival: {
    id: 2,
    streetName: 'Rue de Lyon',
    postalCode: '69001',
    cityName: 'Lyon',
    latitude: 45.764,
    longitude: 4.8357,
  },
  date: '2026-04-01',
  hour: '08:00',
  kms: 460,
  availableSeats: 3,
  driverName: 'Jean Dupont',
  iconLabel: 'car',
  driver: mockDriver,
  vehicle: {
    id: 1,
    brand: 'Renault',
    model: 'Clio',
    seats: 5,
    carregistration: 'AB-123-CD',
  },
}

export const handlers = [
  http.get('*/api/trips/:id', ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(mockTrip)
  }),

  http.get('*/api/trips/:id/person', () => {
    return HttpResponse.json(mockPassengers)
  }),

  http.post('*/api/trips/:id/contact', () => {
    return HttpResponse.json(null, { status: 200 })
  }),

  http.post('*/api/trips/:id/person', () => {
    return HttpResponse.json({
      routeId: 1,
      status: 'confirmed',
      createdAt: '2026-03-17',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      tripDate: '2026-04-01',
      driverName: 'Jean Dupont',
    })
  }),

  http.get('*/api/persons/me/trips-driver', () => {
    return HttpResponse.json([
      {
        id: 1,
        departure: mockTrip.departure,
        arrival: mockTrip.arrival,
        date: '2026-04-01',
        hour: '08:00',
        kms: 460,
        availableSeats: 3,
        driverName: 'Jean Dupont',
        iconLabel: 'car',
      },
    ])
  }),
]
