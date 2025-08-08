export const OWNER_UID = import.meta.env.VITE_OWNER_UID as string
export const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL as string | undefined
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined
export const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined
export const MODERATION_API_URL = import.meta.env.VITE_MODERATION_API_URL as string | undefined

if (!OWNER_UID) {
  // Fail fast in dev to ensure owner is configured
  // eslint-disable-next-line no-console
  console.warn('VITE_OWNER_UID is not set. Admin routes will be inaccessible.')
}