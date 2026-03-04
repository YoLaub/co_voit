import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProfil } from '../api/profilApi'
import { useAuthStore } from '../store/authStore'

const PHONE_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/

export default function CompleteProfil() {
  const navigate = useNavigate()
  const updateUser = useAuthStore((s) => s.updateUser)

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = (): string => {
    if (!firstname.trim()) return 'Le prénom est requis'
    if (!lastname.trim()) return 'Le nom est requis'
    if (!PHONE_REGEX.test(phone)) return 'Numéro de téléphone invalide (format FR)'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      await createProfil(firstname.trim(), lastname.trim(), phone)
      updateUser({ hasCompletedProfile: true })
      navigate('/')
    } catch {
      setError('Une erreur est survenue, réessayez')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1A365D] mb-2 text-center">
          Compléter votre profil
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Ces informations sont nécessaires pour utiliser l'application.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              placeholder="Jean"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              placeholder="Dupont"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              placeholder="0612345678"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E97A2B] text-white font-semibold py-2 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Enregistrement...' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
