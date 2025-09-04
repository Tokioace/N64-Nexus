import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import { MODERATION_API_URL } from '../config'
import { useLanguage } from '../contexts/LanguageContext'

export type ViolationType = 'insult' | 'hate' | 'spam' | 'phishing' | 'nsfw' | 'violence' | 'copyright'

export interface ModerationResult {
  violations: Array<{ type: ViolationType; confidence: number; detail?: string }>
  shouldHide: boolean
}

export type ModerationAction = 'none' | 'warned' | 'banned'

const INSULT_WORDS = ['idiot','stupid','dumb','fool','noob','loser']
const HATE_WORDS = ['hate','nazi','racist','sexist']
const SPAM_PATTERNS = [/https?:\/\//i, /free\s+(coins|gems|money)/i, /click\s+here/i]
const NINTENDO_TERMS = ['nintendo', 'mario', 'zelda', 'pokemon', 'donkey kong', 'kirby', 'metroid']

export const moderationService = {
  async analyzeText(text: string): Promise<ModerationResult> {
    const violations: ModerationResult['violations'] = []

    const lower = text.toLowerCase()
    if (INSULT_WORDS.some(w => lower.includes(w))) violations.push({ type: 'insult', confidence: 0.7 })
    if (HATE_WORDS.some(w => lower.includes(w))) violations.push({ type: 'hate', confidence: 0.7 })
    if (SPAM_PATTERNS.some(re => re.test(text))) violations.push({ type: 'spam', confidence: 0.8 })
    if (/https?:\/\//i.test(text) && /(bit\.ly|t\.co|tinyurl)/i.test(text)) violations.push({ type: 'phishing', confidence: 0.6 })

    try {
      if (MODERATION_API_URL) {
        const resp = await fetch(MODERATION_API_URL + '/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
        if (resp.ok) {
          const extra = await resp.json()
          if (Array.isArray(extra?.violations)) {
            extra.violations.forEach((v: any) => violations.push(v))
          }
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) logger.warn('External moderation API failed', err)
    }

    return { violations, shouldHide: violations.length > 0 }
  },

  async analyzeImageMetadata(filename: string, title?: string, description?: string): Promise<ModerationResult> {
    const text = [filename, title, description].filter(Boolean).join(' ').toLowerCase()
    const violations: ModerationResult['violations'] = []

    // Copyright heuristics should NOT auto-hide by themselves
    if (NINTENDO_TERMS.some(t => text.includes(t))) {
      violations.push({ type: 'copyright', confidence: 0.6, detail: 'Nintendo-related terms detected in metadata' })
    }

    try {
      if (MODERATION_API_URL) {
        const resp = await fetch(MODERATION_API_URL + '/image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, title, description }) })
        if (resp.ok) {
          const extra = await resp.json()
          if (Array.isArray(extra?.violations)) {
            extra.violations.forEach((v: any) => violations.push(v))
          }
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) logger.warn('External moderation API failed', err)
    }

    // Only auto-hide for severe categories with sufficient confidence
    const shouldAutoHide = violations.some(v => (
      (v.type === 'nsfw' || v.type === 'violence' || v.type === 'phishing') && (v.confidence ?? 0) >= 0.8
    ))

    if (import.meta.env.DEV) {
      logger.info('Image moderation analysis', { filename, title, description, violations, shouldAutoHide })
    }

    return { violations, shouldHide: shouldAutoHide }
  },

  async flagContent(contentType: string, contentId: string, flagType: string, confidence?: number, autoHidden?: boolean) {
    try {
      const { error } = await supabase.from('content_flags').insert({
        content_type: contentType,
        content_id: contentId,
        flag_type: flagType,
        confidence_score: confidence ?? null,
        auto_hidden: autoHidden ?? false,
        manual_review_required: true
      })
      if (error) throw error
    } catch (e) {
      logger.error('Flag content failed', e)
    }
  },

  async recordViolation(userId: string, violationType: 'text' | 'media' | 'link', details: string): Promise<ModerationAction> {
    try {
      const { count } = await supabase
        .from('user_violations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

      const action: ModerationAction = (count && count >= 1) ? 'banned' : 'warned'

      const { error } = await supabase.from('user_violations').insert({
        user_id: userId,
        violation_type: violationType,
        details,
        severity: action === 'banned' ? 2 : 1,
        action
      })
      if (error) throw error

      return action
    } catch (e) {
      logger.error('Failed to record violation', e)
      return 'none'
    }
  }
}