import { NavLink } from 'react-router-dom'

interface NavItemProps {
  to: string
  label: string
  icon: React.ReactNode
}

function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[11px] font-medium transition-colors ${
          isActive ? 'text-[#1A365D]' : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 border-t border-gray-200 z-50 bg-[#D3D9DF]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <NavItem
          to="/"
          label="Les trajets"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
        />
        <NavItem
          to="/search"
          label="Rechercher"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
        />
        <NavItem
          to="/my-trips"
          label="Mes trajets"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M21 12V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v4.5" />
            </svg>
          }
        />
        <NavItem
          to="/create-trip"
          label="Publier"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
        />
        <NavItem
          to="/profile"
          label="Profil"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
      </div>
    </nav>
  )
}