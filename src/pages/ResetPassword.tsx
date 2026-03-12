import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/authApi'
import logo from '../assets/images/logo/logo.webp'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password', { replace: true })
    }
  }, [token, navigate])

  const validate = (): string => {
    if (!newPassword || newPassword.length < 8) return 'Mot de passe : 8 caractères minimum'
    if (newPassword !== confirmPassword) return 'Les mots de passe ne correspondent pas'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      await resetPassword(token, newPassword)
      navigate('/login', { state: { resetSuccess: true }, replace: true })
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 400 || status === 401) {
        setError('Ce lien est invalide ou expiré.')
      } else {
        setError('Erreur serveur, réessayez')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className="flex flex-col mx-auto items-center">
      <h1 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">Co-VOIT</h1>
      <img src={logo} alt="Co-Voit Logo" className="h-30 w-30 scale-300 opacity-80 mt-10" />

      <div className="bg-[#F3F4F6] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-6 text-center">
            Nouveau mot de passe
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                <p>{error}</p>
                {error.includes('invalide ou expiré') && (
                  <Link
                    to="/forgot-password"
                    className="text-[#1A365D] font-medium hover:underline mt-1 inline-block"
                  >
                    Demander un nouveau lien
                  </Link>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E97A2B] text-white font-semibold py-2 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
