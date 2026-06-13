import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [form, setForm]   = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = new URLSearchParams()
      body.append('username', form.username)
      body.append('password', form.password)
      const { data } = await api.post('/users/login', body)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('username', form.username)
      navigate('/')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--bg)'
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 28, marginBottom: 4, color: 'var(--accent2)' }}>
          💰 Control de Pagos
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Usuario</label>
            <input
              type="text" placeholder="tu usuario" autoComplete="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Contraseña</label>
            <input
              type="password" placeholder="••••••" autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, background: '#e05c5c22', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            background: 'var(--accent)', color: '#fff', marginTop: 6,
            padding: '13px', fontSize: 15
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: 13 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
