import { en } from './en';
import { ru } from './ru';
import { Settings } from '../settings';

export type TranslateKey = keyof typeof en;

function getActiveLanguage(): 'en' | 'ru' {
  const savedLang = Settings.get('extension.language');
  
  if (savedLang === 'ru') return 'ru';
  if (savedLang === 'en') return 'en';
  
  // Авто-определение (если "auto" или пусто)
  const userLang = navigator.language || (navigator as any).userLanguage;
  return userLang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

const currentDict = getActiveLanguage() === 'ru' ? ru : en;

export function t(key: TranslateKey, params?: Record<string, string | number>): string {
  let str = currentDict[key] || en[key] || key;
  
  if (params) {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
    });
  }
  
  return str;
}