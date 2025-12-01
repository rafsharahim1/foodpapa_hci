import { MascotIcon } from './MascotIcon';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { useVoiceAnnouncement } from './VoiceGuide';
import { useEffect } from 'react';

interface InitialWelcomeScreenProps {
  onContinue: () => void;
}

export function InitialWelcomeScreen({ onContinue }: InitialWelcomeScreenProps) {
  const { settings } = useAccessibility();
  const { t } = useTranslation();
  const { announce } = useVoiceAnnouncement();

  // Announce welcome message when component mounts
  useEffect(() => {
    setTimeout(() => {
      announce(`${t('welcomeToFoodPapa')}. ${t('orderWithComfort')}`);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col px-8 py-8">
      {/* Language Toggle - Top Right */}
      <div className="flex justify-end mb-8">
        <LanguageToggle variant="pill" />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div role="img" aria-label={t('homeTitle')}>
          <MascotIcon className="w-28 h-28 mx-auto mb-6" aria-hidden="true" />
        </div>
        <h1 className="text-purple-700 text-3xl mb-3 text-center">
          {t('welcomeToFoodPapa')}
        </h1>
        <p className="text-gray-700 text-xl leading-relaxed text-center">
          {t('orderWithComfort')}
        </p>
      </div>

      {/* Continue Button */}
      <nav className="space-y-4" aria-label={t('continue')}>
        <button
          onClick={onContinue}
          className="w-full px-6 py-4 rounded-xl bg-purple-700 text-white border-2 border-purple-700 min-h-[44px] transition-all hover:bg-purple-800 focus-visible:outline-4 focus-visible:outline-purple-700 shadow-lg"
          aria-label={t('continue')}
        >
          {t('continue')}
        </button>
      </nav>
    </div>
  );
}