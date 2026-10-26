// Illustrated icon for each of the 26 tasks, keyed by task code (supabase/tasks.sql).
// Trial run: shown only in builds with VITE_TASK_ICONS=1 (the demo artifact) until Peter approves them.
const files = import.meta.glob<string>('../assets/task-icons/*.webp', { eager: true, query: '?inline', import: 'default' })
const ICONS = new Map(Object.entries(files).map(([path, url]) => [Number(path.match(/(\d+)\.webp$/)![1]), url]))
const enabled = import.meta.env.VITE_TASK_ICONS === '1'

export function TaskIcon({ code, size = 52 }: { code: number | null | undefined; size?: number }) {
  const url = enabled && code != null ? ICONS.get(code) : undefined
  if (!url) return null
  return <img className="task-icon" src={url} width={size} height={size} alt="" />
}
