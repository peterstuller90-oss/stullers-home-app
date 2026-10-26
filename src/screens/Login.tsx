import { Logo } from '../components/Logo'
import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Avatar } from '../components/Avatar'
import { FAMILY, type Member } from '../lib/family'

const PIN_LENGTH = 6
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export function Login({ supabase }: { supabase: SupabaseClient }) {
  const [member, setMember] = useState<Member | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function press(key: string) {
    if (busy || !member) return
    if (key === '⌫') return setPin(pin.slice(0, -1))
    if (!key || pin.length >= PIN_LENGTH) return
    const next = pin + key
    setPin(next)
    setError('')
    if (next.length < PIN_LENGTH) return
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email: member.email, password: next })
    setBusy(false)
    if (error) {
      setError(error.status === 429 ? 'Veľa pokusov. Skús to o chvíľu.' : 'Nesprávny PIN.')
      setPin('')
    }
  }

  if (!member) {
    return (
      <main className="center-screen">
        <div className="login-wrap">
          <Logo />
          <p className="muted">Kto si?</p>
          <div className="profile-grid">
            {FAMILY.map((m) => (
              <button key={m.name} className="card profile-card" onClick={() => setMember(m)}>
                <Avatar name={m.name} size={84} />
                <strong>{m.name}</strong>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="center-screen">
      <div className="login-wrap">
        <Avatar name={member.name} size={96} />
        <h2 className="pin-title">Ahoj, {member.name}!</h2>
        <p className="muted">Zadaj svoj PIN</p>
        <div className={error ? 'pin-dots shake' : 'pin-dots'}>
          {Array.from({ length: PIN_LENGTH }, (_, i) => <span key={i} className={i < pin.length ? 'dot on' : 'dot'} />)}
        </div>
        <p className="error">{busy ? <span className="muted">Overujem…</span> : error || ' '}</p>
        <div className="keypad">
          {KEYS.map((k, i) => k
            ? <button key={i} className="key" onClick={() => press(k)} aria-label={k === '⌫' ? 'Zmazať' : k}>{k}</button>
            : <span key={i} />)}
        </div>
        <button className="link-btn" onClick={() => { setMember(null); setPin(''); setError('') }}>← Iný profil</button>
      </div>
    </main>
  )
}
