import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { loadFamilyData, type FamilyData } from './lib/data'
import { TabBar, type Tab } from './components/TabBar'
import { MissingConfig } from './screens/MissingConfig'
import { Login } from './screens/Login'
import { Home } from './screens/Home'
import { Tasks } from './screens/Tasks'
import { Family } from './screens/Family'
import { Profile } from './screens/Profile'
import { Parent } from './screens/Parent'
import { Celebration } from './components/Celebration'
import { earnedBadges, statsFor, weeklyXp } from './lib/gamification'
import { useCelebrations } from './lib/celebrations'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('home')
  const [data, setData] = useState<FamilyData | null>(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id
  const reload = useCallback(async () => {
    if (!supabase || !userId) return
    try {
      setData(await loadFamilyData(supabase, userId))
      setLoadError('')
    } catch {
      setLoadError('Nepodarilo sa načítať dáta. Skontroluj pripojenie.')
    }
  }, [userId])

  useEffect(() => {
    setData(null)
    reload()
  }, [reload])

  // A home-screen app on iPhone is resumed, not reopened, so refresh when it comes back
  // to the front and every 30 s while open: changes from other phones show up on their own.
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') reload() }
    document.addEventListener('visibilitychange', refresh)
    const timer = setInterval(refresh, 30_000)
    return () => {
      document.removeEventListener('visibilitychange', refresh)
      clearInterval(timer)
    }
  }, [reload])

  const user = data?.profiles.find((p) => p.id === userId)
  const stats = useMemo(() => (user && data ? statsFor(user.id, user.xp, data.completions) : null), [user, data])
  const weekly = useMemo(() => weeklyXp(data?.xpLog ?? []), [data])
  const { current, next } = useCelebrations(user?.id, stats && { xp: stats.xp, badges: earnedBadges(stats) })

  if (!supabase) return <MissingConfig />
  if (loading) return <main className="center-screen"><div className="spinner" /></main>
  if (!session) return <Login supabase={supabase} />

  if (!data || !user || !stats) {
    const message = loadError || (data ? 'Tento účet nemá profil v rodine.' : '')
    return (
      <main className="center-screen">
        {message ? (
          <div className="card empty">
            <p>{message}</p>
            <button className="btn-primary" onClick={reload}>Skúsiť znova</button>
            <button className="link-btn" onClick={() => supabase!.auth.signOut()}>Odhlásiť sa</button>
          </div>
        ) : <div className="spinner" />}
      </main>
    )
  }

  return (
    <div className="app">
      <main className="content" key={tab}>
        {tab === 'home' && <Home user={user} tasks={data.myTasks} streak={stats.streak} onNavigate={setTab} />}
        {tab === 'tasks' && (
          <Tasks tasks={data.myTasks} assigneesByTask={data.assigneesByTask} user={user} profiles={data.profiles} supabase={supabase} onChanged={reload} />
        )}
        {tab === 'parent' && user.role === 'parent' && (
          <Parent user={user} profiles={data.profiles} tasks={data.tasks} approvals={data.approvals}
            assigneesByTask={data.assigneesByTask} supabase={supabase} onChanged={reload} />
        )}
        {tab === 'family' && <Family profiles={data.profiles} currentId={user.id} weekly={weekly} />}
        {tab === 'profile' && (
          <Profile user={user} stats={stats} supabase={supabase} onChanged={reload} onSignOut={() => supabase!.auth.signOut()} />
        )}
      </main>
      <TabBar active={tab} onChange={setTab} isParent={user.role === 'parent'}
        parentBadge={data.approvals.filter((a) => a.userId !== user.id).length} />
      {current && <Celebration event={current} onDone={next} />}
    </div>
  )
}
