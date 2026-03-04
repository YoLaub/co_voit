import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyProfil, updateProfil } from '../api/profilApi'
import { useAuthStore } from '../store/authStore'

const PHONE_REGEX = /^(\+33|0)[1-9](\d{2}){4}$/

export default function EditProfile() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { data: profil, isLoading } = useQuery({
    queryKey: ['profil', 'me'],
    queryFn: () => getMyProfil(),
    enabled: !!user,
  })

  const [firstname, setFirstname] = useState(() => profil?.firstname ?? '')
  const [lastname, setLastname] = useState(() => profil?.lastname ?? '')
  const [phone, setPhone] = useState(() => profil?.phone ?? '')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      updateProfil(user!.accountId, {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phone,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profil', user?.accountId], updated)
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1500)
    },
    onError: () => {
      setFormError('Erreur lors de la mise à jour, réessayez')
    },
  })

  const validate = (): string => {
    if (!firstname.trim()) return 'Le prénom est requis'
    if (!lastname.trim()) return 'Le nom est requis'
    if (!PHONE_REGEX.test(phone)) return 'Numéro de téléphone invalide (format FR)'
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setFormError(err); return }
    setFormError('')
    mutation.mutate()
  }

  // Initialise les champs une fois le profil chargé
  if (isLoading || !profil) {
    return (
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A365D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className=" bg-[#F3F4F6] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Retour"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-[#1A365D]">Modifier le profil</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
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

            {formError && <p className="text-red-500 text-sm">{formError}</p>}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 text-center font-medium">
                Profil mis à jour !
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                disabled={mutation.isPending}
                className="flex-1 border border-gray-300 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || success}
                className="flex-1 bg-[#E97A2B] text-white font-semibold py-2.5 rounded-xl hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
              >
                {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
