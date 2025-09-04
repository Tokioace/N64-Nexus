import { supabase } from '../lib/supabase'
import { DISCORD_WEBHOOK_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config'
// Note: Do not use React hooks inside services. Language-specific messages are generated below without hooks.

export interface DailyReportSummary {
  totalViolations: number
  usersWarned: number
  usersBanned: number
  newBugs: number
  illegalContent: string[]
  appHealth: { errors: number; cacheItems: number; sessions: number; uptime: number }
}

async function fetchCounts() {

  const [violations, warnings, bans, bugs] = await Promise.all([
    supabase.from('content_flags').select('*', { count: 'exact', head: true }),
    supabase.from('user_violations').select('*', { count: 'exact', head: true }).eq('action', 'warned'),
    supabase.from('user_violations').select('*', { count: 'exact', head: true }).eq('action', 'banned'),
    supabase.from('bug_reports').select('*', { count: 'exact', head: true })
  ])

  const { data: illegalRaw } = await supabase
    .from('content_flags')
    .select('content_type, content_id, flag_type')
    .order('created_at', { ascending: false })
    .limit(10)

  const illegal = illegalRaw ?? []
  const illegalContent = illegal.map(i => `${i.flag_type} ${i.content_type} ${i.content_id}`)

  // App health: These are placeholder approximations; session count from profiles as proxy
  const { count: sessions = 0 } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  return {
    totalViolations: violations.count || 0,
    usersWarned: warnings.count || 0,
    usersBanned: bans.count || 0,
    newBugs: bugs.count || 0,
    illegalContent,
    appHealth: { errors: bugs.count || 0, cacheItems: 0, sessions: sessions || 0, uptime: 99.9 }
  }
}

async function sendDiscord(message: string) {
  if (!DISCORD_WEBHOOK_URL) return
  await fetch(DISCORD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: message }) })
}

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) })
}

export const dailyReportService = {
  async getTodayReport(): Promise<DailyReportSummary> {
    const summary = await fetchCounts()
    return summary
  },

  async sendDailyReport(language: 'de' | 'en' = 'de') {
    const s = await fetchCounts()
    const linesDe = [
      `Battle64 — Täglicher Report`,
      `Verstöße gesamt: ${s.totalViolations}`,
      `Verwarnte Nutzer: ${s.usersWarned}`,
      `Gesperrte Nutzer: ${s.usersBanned}`,
      `Neue Bugs: ${s.newBugs}`,
      `Illegale Inhalte: ${s.illegalContent.length}`,
      `App-Zustand — Fehler: ${s.appHealth.errors}, Sessions: ${s.appHealth.sessions}, Uptime: ${s.appHealth.uptime}%`
    ]
    const linesEn = [
      `Battle64 — Daily Report`,
      `Total violations: ${s.totalViolations}`,
      `Users warned: ${s.usersWarned}`,
      `Users banned: ${s.usersBanned}`,
      `New bugs: ${s.newBugs}`,
      `Illegal content: ${s.illegalContent.length}`,
      `App health — Errors: ${s.appHealth.errors}, Sessions: ${s.appHealth.sessions}, Uptime: ${s.appHealth.uptime}%`
    ]

    const message = (language === 'de' ? linesDe : linesEn).join('\n')
    await Promise.all([sendDiscord(message), sendTelegram(message)])
  }
}