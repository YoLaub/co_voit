import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/authApi'
import logo from '../assets/images/logo/logo.webp'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = (): string => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError('Erreur serveur, réessayez')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col mx-auto items-center">
      <h1 className="text-2xl font-bold text-[#1A365D] mb-6 text-center">Co-VOIT</h1>
      <img src={logo} alt="Co-Voit Logo" className="h-30 w-30 scale-300 opacity-80 mt-10" />

      <div className="bg-[#F3F4F6] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1A365D] mb-6 text-center">
            Mot de passe oublié
          </h2>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.
              </p>
              <Link
                to="/login"
                className="text-[#1A365D] font-medium hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Entrez votre email pour recevoir un lien de réinitialisation.
              </p>
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E97A2B] text-white font-semibold py-2 rounded-lg hover:bg-[#d06b22] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-4">
                <Link to="/login" className="text-[#1A365D] font-medium hover:underline">
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
