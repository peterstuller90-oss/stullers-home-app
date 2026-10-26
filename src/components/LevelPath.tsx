import { MILESTONES, levelFor } from '../lib/gamification'

// Duolingo-style winding path of levels: done ones behind, the current one glowing, the rest locked.
export function LevelPath({ xp }: { xp: number }) {
  const { level, to, progress } = levelFor(xp)
  const first = Math.max(1, level - 2)
  const levels = Array.from({ length: 9 }, (_, i) => first + i)
  return (
    <section className="path" aria-label="Cesta levelov">
      {levels.map((n, i) => {
        const state = n < level ? 'done' : n === level ? 'current' : 'locked'
        const reward = MILESTONES[n]
        const offset = Math.round(Math.sin(i * 0.95) * 80) // px left/right, so the path winds
        return (
          <div key={n} className={`path-step ${state}`} style={{ left: `${offset}px`, animationDelay: `${i * 0.06}s` }}>
            {state === 'current' && <span className="path-here">Tu si · {xp}/{to} XP</span>}
            <div className={reward ? 'path-node milestone' : 'path-node'}
              style={state === 'current' ? { ['--p' as string]: `${Math.round(progress * 100)}%` } : undefined}>
              <span aria-hidden="true">{reward ? (state === 'done' ? '🏆' : '🎁') : state === 'done' ? '✓' : state === 'current' ? '★' : '🔒'}</span>
            </div>
            <span className="path-label">Level {n}{reward ? ` · ${reward}` : ''}</span>
          </div>
        )
      })}
    </section>
  )
}
