import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import logo from "../assets/images/logo/logo.webp";

export default function Register() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = (): string => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide'
    if (!password || password.length < 8) return 'Mot de passe : 8 caractères minimum'
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      const data = await register(email, password, confirmPassword)
      login(data.token, {
        accountId: data.accountId,
        email: data.email,
        role: data.role,
        hasCompletedProfile: false,
      })
      navigate('/complete-profil')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message ?? 'Une erreur est survenue, réessayez')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className='flex flex-col mx-auto items-center'>

      <h1 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">Co-VOIT</h1>

      <img src={logo} alt="Co-Voit Logo" className="h-30 w-30 scale-300 opacity-80 mt-10" />
      <div className=" bg-[#F3F4F6] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-6 text-center">Inscription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E97A2B] text-white font-semibold py-2 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#1A365D] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
