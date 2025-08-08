import { supabase } from '../lib/supabase'

let initialized = false

export const bugMonitorService = {
  init() {
    if (initialized) return
    initialized = true

    window.addEventListener('error', async (event) => {
      await supabase.from('bug_reports').insert({
        message: event.message?.slice(0, 500) ?? 'Error',
        stack: (event.error?.stack ?? '').slice(0, 2000),
        url: window.location.href
      })
    })

    window.addEventListener('unhandledrejection', async (event) => {
      await supabase.from('bug_reports').insert({
        message: (event.reason?.message ?? 'Unhandled rejection').slice(0, 500),
        stack: (event.reason?.stack ?? JSON.stringify(event.reason)).slice(0, 2000),
        url: window.location.href
      })
    })
  },

  async report(message: string, details?: string) {
    await supabase.from('bug_reports').insert({
      message: message.slice(0, 500),
      stack: (details ?? '').slice(0, 2000),
      url: window.location.href
    })
  }
}