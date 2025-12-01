import { MascotIcon } from './MascotIcon';
import { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAccessibleToast } from './AccessibleToast';
import { VoiceGuide, useVoiceAnnouncement } from './VoiceGuide';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { useTutorial } from '../context/TutorialContext';
import { Button } from './ui/button';

interface WelcomeSetupScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomeSetupScreen({ onComplete, onSkip }: WelcomeSetupScreenProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const { settings, updateSettings, completeSetup } = useAccessibility();
  const toast = useAccessibleToast();
  const { announce } = useVoiceAnnouncement();
  const { enableTutorial } = useTutorial();
  const [tutorialEnabled, setTutorialEnabled] = useState(false);

  // Announce changes with voice guide
  const announceChange = (message: string) => {
    if (settings.voiceGuide) {
      // In a real app, this would use Web Speech API
      console.log('Voice:', message);
    }
    toast.success(message);
  };

  // Haptic feedback
  const triggerHaptic = () => {
    if (settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    updateSettings({ textSize: size });
    triggerHaptic();
    const sizeLabels = { small: t('small'), medium: t('medium'), large: t('large') };
    announceChange(`${t('textSizeChangedTo')} ${sizeLabels[size]}`);
  };

  const handleColorModeChange = (mode: 'light' | 'dark' | 'high-contrast') => {
    updateSettings({ colorMode: mode });
    triggerHaptic();
    const modeLabels = { 
      light: t('lightMode'), 
      dark: t('darkMode'), 
      'high-contrast': t('highContrastMode')
    };
    announceChange(`${modeLabels[mode]} ${t('activated')}`);
  };

  const handleToggleSetting = (setting: 'voiceGuide' | 'hapticFeedback' | 'simplifiedNavigation') => {
    const newValue = !settings[setting];
    updateSettings({ [setting]: newValue });
    triggerHaptic();
    const settingLabels = {
      voiceGuide: t('voiceGuide'),
      hapticFeedback: t('hapticFeedback'),
      simplifiedNavigation: t('simplifiedNavigation')
    };
    announceChange(`${settingLabels[setting]} ${newValue ? t('enabled') : t('disabled')}`);
  };

  const handleNext = () => {
    triggerHaptic();
    if (step < 3) {
      setStep(step + 1);
    } else {
      announceChange(t('setupComplete'));
      completeSetup(); // Mark setup as complete
      if (tutorialEnabled) {
        enableTutorial(); // Enable tutorial if user opted in
      }
      onComplete();
    }
  };

  // Announce screen content when component mounts or step changes
  // REMOVED: No automatic announcement on mount/step change
  // Users will click speaker buttons to hear content on demand
  // useEffect(() => {
  //   const announcements = [
  //     t('setupStep1Announcement'),
  //     t('setupStep2Announcement'),
  //     t('setupStep3Announcement')
  //   ];
  //   
  //   setTimeout(() => {
  //     announce(announcements[step - 1]);
  //   }, 500);
  // }, [step, t]);

  return (
    <div className={`min-h-screen flex flex-col px-8 py-12 ${
      settings.colorMode === 'high-contrast'
        ? 'bg-gray-900'
        : 'bg-white'
    }`}>
      {/* Logo and Title */}
      <header className="text-center mb-8" role="banner">
        <div role="img" aria-label="FoodPapa mascot logo">
          <MascotIcon className="w-24 h-24 mx-auto mb-4" aria-hidden="true" />
        </div>
        <h1 className={`text-3xl mb-2 ${
          settings.colorMode === 'high-contrast'
            ? 'text-white'
            : 'text-purple-700'
        }`}>{t('welcomeToFoodPapa')}</h1>
        <p className={`text-xl leading-relaxed ${
          settings.colorMode === 'high-contrast'
            ? 'text-white'
            : 'text-gray-700'
        }`}>
          {t('orderWithComfort')} <span aria-label="food bowl emoji" role="img">🍲</span>
        </p>
      </header>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Setup step ${step} of 3`}>
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`w-3 h-3 rounded-full ${
              dot === step ? 'bg-purple-700' : 'bg-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Step Content */}
      <main className="flex-1" role="main">
        {step === 1 && (
          <div>
            <h2 
              className={`text-2xl mb-6 text-center ${
                settings.colorMode === 'high-contrast'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
              id="text-size-heading"
            >
              {t('chooseTextSize')}
            </h2>
            
            <div className="space-y-4 mb-8" role="radiogroup" aria-labelledby="text-size-heading">
              <VoiceGuide text="Small text size option. Select this if you prefer smaller text for more content on screen.">
                <button
                  onClick={() => handleTextSizeChange('small')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    settings.textSize === 'small'
                      ? 'border-purple-700 bg-purple-50'
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="radio"
                  aria-checked={settings.textSize === 'small'}
                  aria-label="Small text size option"
                >
                  <p className={`text-base ${
                    settings.textSize === 'small'
                      ? 'text-gray-900'
                      : settings.colorMode === 'high-contrast'
                        ? 'text-white'
                        : 'text-gray-900'
                  }`}>{t('smallText')}</p>
                </button>
              </VoiceGuide>

              <VoiceGuide text="Medium text size option. This is the recommended size for comfortable reading.">
                <button
                  onClick={() => handleTextSizeChange('medium')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    settings.textSize === 'medium'
                      ? 'border-purple-700 bg-purple-50'
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="radio"
                  aria-checked={settings.textSize === 'medium'}
                  aria-label="Medium text size option"
                >
                  <p className={`text-lg ${
                    settings.textSize === 'medium'
                      ? 'text-gray-900'
                      : settings.colorMode === 'high-contrast'
                        ? 'text-white'
                        : 'text-gray-900'
                  }`}>{t('mediumText')}</p>
                </button>
              </VoiceGuide>

              <VoiceGuide text="Large text size option. Select this for easier reading with larger text throughout the app.">
                <button
                  onClick={() => handleTextSizeChange('large')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    settings.textSize === 'large'
                      ? 'border-purple-700 bg-purple-50'
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="radio"
                  aria-checked={settings.textSize === 'large'}
                  aria-label="Large text size option"
                >
                  <p className={`text-xl ${
                    settings.textSize === 'large'
                      ? 'text-gray-900'
                      : settings.colorMode === 'high-contrast'
                        ? 'text-white'
                        : 'text-gray-900'
                  }`}>{t('largeText')}</p>
                </button>
              </VoiceGuide>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 
              className={`text-2xl mb-6 text-center ${
                settings.colorMode === 'high-contrast'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
              id="color-mode-heading"
            >
              {t('chooseColorMode')}
            </h2>
            
            <div className="space-y-4 mb-8" role="radiogroup" aria-labelledby="color-mode-heading">
              <VoiceGuide text="Light mode option. This uses a white background with dark text, easy on the eyes for daytime use.">
                <button
                  onClick={() => handleColorModeChange('light')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    settings.colorMode === 'light'
                      ? 'border-purple-700 bg-purple-50 text-gray-900'
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800 text-white'
                        : 'border-gray-200 bg-white text-gray-900'
                  }`}
                  role="radio"
                  aria-checked={settings.colorMode === 'light'}
                  aria-label="Light mode - Easy on the eyes"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg" aria-hidden="true"></div>
                    <span>{t('lightMode')}</span>
                  </div>
                </button>
              </VoiceGuide>

              <VoiceGuide text="High contrast mode option. This uses maximum contrast colors like black and yellow for best visibility. Recommended for visually impaired users.">
                <button
                  onClick={() => handleColorModeChange('high-contrast')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all ${
                    settings.colorMode === 'high-contrast'
                      ? 'border-purple-700 bg-purple-50 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-900'
                  }`}
                  role="radio"
                  aria-checked={settings.colorMode === 'high-contrast'}
                  aria-label="High contrast mode - Maximum clarity"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black border-4 border-white rounded-lg" aria-hidden="true"></div>
                    <span>{t('highContrast')}</span>
                  </div>
                </button>
              </VoiceGuide>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 
              className={`text-2xl mb-6 text-center ${
                settings.colorMode === 'high-contrast'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}
              id="assistance-heading"
            >
              {t('assistancePreferences')}
            </h2>
            
            <div className="space-y-4 mb-8" role="group" aria-labelledby="assistance-heading">
              <VoiceGuide text="Voice guide option. When enabled, every button and interactive element will speak its description out loud. This helps you understand what each button does before pressing it.">
                <button
                  onClick={() => handleToggleSetting('voiceGuide')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    settings.voiceGuide 
                      ? 'border-purple-700 bg-purple-50' 
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="switch"
                  aria-checked={settings.voiceGuide}
                  aria-label="Voice guide - Hear button descriptions"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden="true">🔊</span>
                    <div>
                      <p className={`text-lg ${
                        settings.voiceGuide
                          ? 'text-gray-900'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}>{t('voiceGuide')}</p>
                      <p className={`text-sm ${
                        settings.voiceGuide
                          ? 'text-gray-600'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-gray-300'
                            : 'text-gray-600'
                      }`}>{t('hearButtonDescriptions')}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    settings.voiceGuide ? 'bg-purple-700 border-purple-700' : 'border-gray-300'
                  }`} aria-hidden="true">
                    {settings.voiceGuide && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>
              </button>
              </VoiceGuide>

              <VoiceGuide text="Haptic feedback option. When enabled, your device will vibrate when you press buttons, giving you physical confirmation of your actions.">
                <button
                  onClick={() => handleToggleSetting('hapticFeedback')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    settings.hapticFeedback 
                      ? 'border-purple-700 bg-purple-50' 
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="switch"
                  aria-checked={settings.hapticFeedback}
                  aria-label="Haptic feedback - Feel button presses"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden="true">📳</span>
                    <div>
                      <p className={`text-lg ${
                        settings.hapticFeedback
                          ? 'text-gray-900'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}>{t('hapticFeedback')}</p>
                      <p className={`text-sm ${
                        settings.hapticFeedback
                          ? 'text-gray-600'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-gray-300'
                            : 'text-gray-600'
                      }`}>{t('feelButtonPresses')}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    settings.hapticFeedback ? 'bg-purple-700 border-purple-700' : 'border-gray-300'
                  }`} aria-hidden="true">
                    {settings.hapticFeedback && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>
              </button>
              </VoiceGuide>

              <VoiceGuide text="Simplified navigation option. When enabled, the app will show fewer options and make navigation easier with clearer choices.">
                <button
                  onClick={() => handleToggleSetting('simplifiedNavigation')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    settings.simplifiedNavigation 
                      ? 'border-purple-700 bg-purple-50' 
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="switch"
                  aria-checked={settings.simplifiedNavigation}
                  aria-label="Simplified navigation - Fewer options, clearer choices"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden="true">🎯</span>
                    <div>
                      <p className={`text-lg ${
                        settings.simplifiedNavigation
                          ? 'text-gray-900'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}>{t('simplifiedNavigation')}</p>
                      <p className={`text-sm ${
                        settings.simplifiedNavigation
                          ? 'text-gray-600'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-gray-300'
                            : 'text-gray-600'
                      }`}>{t('fewerOptionsClearerChoices')}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    settings.simplifiedNavigation ? 'bg-purple-700 border-purple-700' : 'border-gray-300'
                  }`} aria-hidden="true">
                    {settings.simplifiedNavigation && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>
              </button>
              </VoiceGuide>

              <VoiceGuide text="Interactive tutorial option. When enabled, you will see helpful arrows and tips guiding you through the app for the first time. Recommended for new users.">
                <button
                  onClick={() => setTutorialEnabled(!tutorialEnabled)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    tutorialEnabled 
                      ? 'border-purple-700 bg-purple-50' 
                      : settings.colorMode === 'high-contrast'
                        ? 'border-gray-600 bg-gray-800'
                        : 'border-gray-200 bg-white'
                  }`}
                  role="switch"
                  aria-checked={tutorialEnabled}
                  aria-label="Interactive tutorial - Get guided tips"
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden="true">🎓</span>
                    <div>
                      <p className={`text-lg ${
                        tutorialEnabled
                          ? 'text-gray-900'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}>{t('interactiveTutorial')}</p>
                      <p className={`text-sm ${
                        tutorialEnabled
                          ? 'text-gray-600'
                          : settings.colorMode === 'high-contrast'
                            ? 'text-gray-300'
                            : 'text-gray-600'
                      }`}>{t('getGuidedTips')}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    tutorialEnabled ? 'bg-purple-700 border-purple-700' : 'border-gray-300'
                  }`} aria-hidden="true">
                    {tutorialEnabled && <span className="text-white text-sm">✓</span>}
                  </div>
                </div>
              </button>
              </VoiceGuide>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Buttons */}
      <nav className="space-y-4" aria-label="Setup navigation">
        <VoiceGuide text={step === 3 ? 'Complete setup button. This will save your preferences and start using FoodPapa.' : `Next button. This will take you to step ${step + 1} of 3.`}>
          <Button
            onClick={handleNext}
            className={`w-full min-h-[66px] text-xl rounded-2xl ${
              settings.colorMode === 'high-contrast'
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-purple-700 text-white hover:bg-purple-800'
            }`}
            aria-label={step === 3 ? 'Complete setup and start using FoodPapa' : `Go to step ${step + 1} of 3`}
          >
            {t('next')}
          </Button>
        </VoiceGuide>

        <VoiceGuide text="Skip setup button. This will continue with default settings without customization.">
          <button
            onClick={() => {
              completeSetup(); // Mark setup as complete
              onSkip();
            }}
            className={`w-full underline min-h-[44px] ${
              settings.colorMode === 'high-contrast'
                ? 'text-white'
                : 'text-purple-700'
            }`}
            aria-label="Skip setup and continue with default settings"
          >
            {t('continueWithDefaults')}
          </button>
        </VoiceGuide>
      </nav>
    </div>
  );
}