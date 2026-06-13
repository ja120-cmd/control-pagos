import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/',         icon: '🏠', label: 'Inicio' },
  { to: '/payments', icon: '💳', label: 'Pagos' },
  { to: '/charts',   icon: '📊', label: 'Gráficas' },
]

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* Header */}
      <header style={{
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: 'var(--accent2)' }}>
          💰 Control de Pagos
        </span>
        <button onClick={logout} style={{ background: 'transparent', color: 'var(--muted)', fontSize: 13, padding: '6px 12px' }}>
          Salir
        </button>
      </header>

      {/* Contenido */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <Outlet />
      </main>

      {/* Nav inferior */}
      <nav style={{
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px'
      }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            textDecoration: 'none', fontSize: 11, fontWeight: 600,
            color: isActive ? 'var(--accent2)' : 'var(--muted)',
            transition: 'color 0.2s'
          })}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
