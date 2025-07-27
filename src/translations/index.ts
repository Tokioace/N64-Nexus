// Split translations into separate files for better deployment compatibility
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { it } from './it';
import { es } from './es';
import { el } from './el';
import { tr } from './tr';
import { zh } from './zh';
import { ja } from './ja';
import { ru } from './ru';
import { pt } from './pt';
import { hi } from './hi';
import { ar } from './ar';

export const translations = {
  de,
  en,
  fr,
  it,
  es,
  el,
  tr,
  zh,
  ja,
  ru,
  pt,
  hi,
  ar,
} as const;

export type Language = keyof typeof translations;