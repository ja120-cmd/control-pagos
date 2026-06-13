import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const [form, setForm]   = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/users/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrarse')
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
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, marginBottom: 4, color: 'var(--accent2)' }}>
          Crear cuenta
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Empieza a controlar tus pagos</p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'username', label: 'Usuario',      type: 'text',     placeholder: 'tu usuario' },
            { key: 'email',    label: 'Correo',        type: 'email',    placeholder: 'tu@correo.com' },
            { key: 'password', label: 'Contraseña',    type: 'password', placeholder: '••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{label}</label>
              <input
                type={type} placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
              />
            </div>
          ))}

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, background: '#e05c5c22', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            background: 'var(--accent)', color: '#fff', marginTop: 6, padding: '13px', fontSize: 15
          }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: 13 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
