import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import api from '../api'

const COLORS = ['#7c6af7', '#4caf82', '#e05c5c', '#f0a500', '#00bcd4', '#e91e63']

function fmt(value) {
  return `₡${Number(value).toLocaleString('es-CR', { minimumFractionDigits: 0 })}`
}

export default function Charts() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/payments/stats/summary')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>Cargando...</p>
  if (!stats || stats.count === 0) return (
    <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--muted)' }}>
      <p style={{ fontSize: 32, marginBottom: 8 }}>📊</p>
      <p>Agrega pagos para ver las gráficas</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Pie por categoría */}
      <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 18 }}>
        <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: 16, fontSize: 15 }}>Por categoría</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={stats.by_category} dataKey="amount" nameKey="category"
              cx="50%" cy="50%" outerRadius={80} label={({ category }) => category}>
              {stats.by_category.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => fmt(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar por mes */}
      {stats.by_month.length > 0 && (
        <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 18 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: 16, fontSize: 15 }}>Por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.by_month} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={v => `₡${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--bg3)', border: 'none' }} />
              <Bar dataKey="amount" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pagado vs Pendiente */}
      <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 18 }}>
        <h3 style={{ fontFamily: 'Space Grotesk', marginBottom: 16, fontSize: 15 }}>Estado general</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={[
                { name: 'Pagado',    value: stats.total_pagado },
                { name: 'Pendiente', value: stats.total_pendiente }
              ]}
              dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={70} label={({ name }) => name}
            >
              <Cell fill="var(--success)" />
              <Cell fill="var(--danger)" />
            </Pie>
            <Tooltip formatter={(v) => fmt(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
