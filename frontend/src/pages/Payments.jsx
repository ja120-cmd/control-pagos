import { useEffect, useState } from 'react'
import api from '../api'

const CATEGORIES = ['Alimentación', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Otros']
const STATUSES   = ['Pendiente', 'Pagado']
const EMPTY_FORM = { description: '', amount: '', category: '', status: 'Pendiente', date: new Date().toISOString().split('T')[0], remind: false }

function Badge({ status }) {
  const color = status === 'Pagado' ? 'var(--success)' : 'var(--danger)'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 8px',
      borderRadius: 20, background: color + '22', color
    }}>{status}</span>
  )
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filterCat, setFilterCat]       = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => { loadPayments() }, [filterCat, filterStatus])

  async function loadPayments() {
    setLoading(true)
    try {
      const params = {}
      if (filterCat)    params.category = filterCat
      if (filterStatus) params.status   = filterStatus
      const { data } = await api.get('/payments/', { params })
      setPayments(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editId) {
        await api.put(`/payments/${editId}`, payload)
      } else {
        await api.post('/payments/', payload)
      }
      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      loadPayments()
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Error al guardar')
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este pago?')) return
    await api.delete(`/payments/${id}`)
    loadPayments()
  }

  function handleEdit(p) {
    setForm({
      description: p.description,
      amount: p.amount,
      category: p.category,
      status: p.status,
      date: p.date,
      remind: p.remind
    })
    setEditId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputStyle = { marginBottom: 12 }
  const labelStyle = { fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Botón abrir formulario */}
      {!showForm && (
        <button onClick={() => { setShowForm(true); setForm(EMPTY_FORM); setEditId(null) }}
          style={{ background: 'var(--accent)', color: '#fff', width: '100%', padding: '13px' }}>
          + Agregar pago
        </button>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 18, border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: 16, color: 'var(--accent2)' }}>
            {editId ? '✏️ Editar pago' : '+ Nuevo pago'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={inputStyle}>
              <label style={labelStyle}>Descripción</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Ej: Supermercado" />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Monto (₡)</label>
              <input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required placeholder="15000" />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Categoría</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Estado</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input type="checkbox" id="remind" checked={form.remind} onChange={e => setForm({ ...form, remind: e.target.checked })} style={{ width: 'auto' }} />
              <label htmlFor="remind" style={{ fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
                🔔 Recordarme este pago
              </label>
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ flex: 1, background: 'var(--accent)', color: '#fff', padding: '12px' }}>
                {editId ? 'Guardar cambios' : 'Agregar'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                style={{ flex: 1, background: 'var(--bg3)', color: 'var(--muted)', padding: '12px' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ flex: 1, fontSize: 13 }}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: 1, fontSize: 13 }}>
          <option value="">Todos los estados</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 20 }}>Cargando...</p>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 30, color: 'var(--muted)' }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
          <p>No hay pagos registrados</p>
        </div>
      ) : (
        payments.map(p => (
          <div key={p.id} style={{
            background: 'var(--bg2)', borderRadius: 'var(--radius)',
            padding: '14px 16px', border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>{p.description}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{p.category} · {p.date}</p>
              </div>
              <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--accent2)', fontSize: 16 }}>
                ₡{Number(p.amount).toLocaleString('es-CR')}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge status={p.status} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(p)} style={{ background: 'var(--bg3)', color: 'var(--text)', padding: '6px 12px', fontSize: 12 }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#e05c5c22', color: 'var(--danger)', padding: '6px 12px', fontSize: 12 }}>
                  🗑️
                </button>
              </div>
            </div>
            {p.remind && <p style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6 }}>🔔 Recordatorio activo</p>}
          </div>
        ))
      )}
    </div>
  )
}
