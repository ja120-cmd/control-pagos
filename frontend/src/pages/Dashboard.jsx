import { useEffect, useState } from 'react'
import api from '../api'

function StatCard({ label, amount, color }) {
  return (
    <div style={{
      background: 'var(--bg2)', borderRadius: 'var(--radius)',
      padding: '16px 18px', border: `1.5px solid ${color}33`
    }}>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color }}>
        ₡{Number(amount).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem('username') || 'Jeison'

  useEffect(() => {
    api.get('/payments/stats/summary')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  function exportFile(type) {
    const token = localStorage.getItem('token')
    const url = `/api/payments/export/${type}`
    const a = document.createElement('a')
    a.href = url
    // incluir token en la URL no es ideal pero funciona para descarga directa
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `pagos.${type === 'excel' ? 'xlsx' : 'pdf'}`
        link.click()
      })
  }

  if (loading) return <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Cargando...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Bienvenido,</p>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, color: 'var(--accent2)' }}>{username} 👋</h2>
      </div>

      {stats && (
        <>
          <StatCard label="Total gastado"   amount={stats.total}           color="var(--accent2)" />
          <StatCard label="Pagado"          amount={stats.total_pagado}    color="var(--success)" />
          <StatCard label="Pendiente"       amount={stats.total_pendiente} color="var(--danger)" />

          <div style={{
            background: 'var(--bg2)', borderRadius: 'var(--radius)',
            padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              {stats.count} pago{stats.count !== 1 ? 's' : ''} registrado{stats.count !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}

      {/* Exportar */}
      <div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Exportar reporte</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => exportFile('excel')} style={{
            flex: 1, background: '#1d6f42', color: '#fff', padding: '12px'
          }}>
            📥 Excel
          </button>
          <button onClick={() => exportFile('pdf')} style={{
            flex: 1, background: '#c0392b', color: '#fff', padding: '12px'
          }}>
            📄 PDF
          </button>
        </div>
      </div>

    </div>
  )
}
