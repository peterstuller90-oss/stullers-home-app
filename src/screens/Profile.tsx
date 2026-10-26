import { useRef, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { LevelBar } from '../components/LevelBar'
import { StreakChip } from '../components/StreakChip'
import { Badges } from '../components/Badges'
import { PushToggle } from '../components/PushToggle'
import { FaceIdToggle } from '../components/FaceIdToggle'
import { SoundToggle } from '../components/SoundToggle'
import type { PlayerStats } from '../lib/gamification'
import { uploadAvatar } from '../lib/data'
import type { CurrentUser } from '../lib/user'

interface Props {
  user: CurrentUser
  stats: PlayerStats
  supabase: SupabaseClient
  onChanged: () => void
  onSignOut: () => void
}

export function Profile({ user, stats, supabase, onChanged, onSignOut }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pick(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      await uploadAvatar(supabase, user.id, file)
      onChanged()
    } catch {
      setError('Fotku sa nepodarilo nahrať.')
    }
    setBusy(false)
  }

  return (
    <>
      <h1 className="page-title">Profil</h1>
      <section className="card hero">
        <button className="avatar-edit" onClick={() => fileInput.current?.click()} disabled={busy} aria-label="Zmeniť fotku">
          <Avatar name={user.name} url={user.avatarUrl} size={96} />
          <span className="avatar-badge">{busy ? '…' : '📷'}</span>
        </button>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        {error && <p className="error">{error}</p>}
        <h2>{user.name}</h2>
        <span className={`role role-${user.role}`}>{user.role === 'parent' ? 'Rodič' : 'Dieťa'}</span>
        <p className="xp-big">{user.xp} XP</p>
        <StreakChip days={stats.streak} />
        <LevelBar xp={user.xp} />
      </section>

      <FaceIdToggle supabase={supabase} />

      <PushToggle supabase={supabase} />

      <SoundToggle />

      <Badges stats={stats} />

      <button className="btn-secondary" onClick={onSignOut}>
        <Icon name="logout" size={20} /> Odhlásiť sa
      </button>
    </>
  )
}
