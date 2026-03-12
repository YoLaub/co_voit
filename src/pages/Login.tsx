import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { login as loginApi } from '../api/authApi'
import { getMyProfil } from '../api/profilApi'
import { useAuthStore } from '../store/authStore'
import logo from "../assets/images/logo/logo.webp";

export default function Login() {
  
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const resetSuccess = (location.state as { resetSuccess?: boolean })?.resetSuccess

  useEffect(() => {
    if (resetSuccess) {
      window.history.replaceState({}, '')
    }
  }, [resetSuccess])

  const validate = (): string => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide'
    if (!password || password.length < 8) return 'Mot de passe : 8 caractères minimum'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      const data = await loginApi(email, password)
      login(data.token, {
        accountId: data.accountId,
        email: data.email,
        role: data.role,
        hasCompletedProfile: false,
      })

      let profileComplete = false
      try {
        await getMyProfil()
        profileComplete = true
      } catch {
        profileComplete = false
      }

      if (profileComplete) {
        login(data.token, {
          accountId: data.accountId,
          email: data.email,
          role: data.role,
          hasCompletedProfile: true,
        })
      }

      navigate(profileComplete ? '/' : '/complete-profil')
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 400 || status === 401) {
        setError('Email ou mot de passe incorrect')
      } else {
        setError('Erreur serveur, réessayez')
      }
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
        {resetSuccess && (
          <p className="bg-green-100 text-green-700 text-sm rounded-lg px-3 py-2 mb-4 text-center">
            Mot de passe réinitialisé avec succès
          </p>
        )}
        <h2 className="text-3xl font-bold text-[#1A365D] mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border text-gray-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-[#1A365D] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E97A2B] text-white font-semibold py-2 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-[#1A365D] font-medium hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>

    </div>
  )
}
