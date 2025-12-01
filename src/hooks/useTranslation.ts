import { useAccessibility } from '../context/AccessibilityContext';
import { t, tVoice, TranslationKey } from '../utils/translations';

/**
 * Custom hook for translations throughout the app
 * Automatically uses the language from AccessibilityContext
 */
export function useTranslation() {
  const { settings } = useAccessibility();
  
  const translate = (key: TranslationKey): string => {
    return t(key, settings.language);
  };
  
  // For voice synthesis: Returns Roman Urdu if in Urdu mode and no native Urdu voice available
  const translateForVoice = (key: TranslationKey): string => {
    return tVoice(key, settings.language);
  };
  
  return { t: translate, tVoice: translateForVoice, language: settings.language };
}
