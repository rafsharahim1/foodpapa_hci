import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t } = useTranslation();
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('settings')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Language Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            {t('language')}
          </h2>
          
          <div className="flex justify-center py-2">
            <LanguageToggle variant="pill" />
          </div>
        </div>

        {/* Text Size */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">🔤</span>
            {t('textSize')}
          </h2>
          
          <div className="space-y-3">
            {[
              { value: 'small', label: t('small'), example: 'text-base' },
              { value: 'medium', label: t('medium'), example: 'text-lg' },
              { value: 'large', label: t('large'), example: 'text-xl' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateSettings({ textSize: option.value as any })}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                  settings.textSize === option.value
                    ? 'border-purple-700 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-gray-900 mb-1 ${option.example}`}>{option.label}</p>
                    <p className={`text-gray-600 ${option.example}`}>Preview: Easy to read</p>
                  </div>
                  {settings.textSize === option.value && (
                    <span className="text-2xl text-purple-700">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Mode */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            {t('colorMode')}
          </h2>
          
          <div className="space-y-3">
            {[
              { value: 'light', label: 'Light Mode', icon: '☀️', description: 'For bright rooms' },
              { value: 'dark', label: 'Dark Mode', icon: '🌙', description: 'For low light' },
              { value: 'high-contrast', label: 'High Contrast', icon: '⚡', description: 'WCAG AA+' }
            ].map((option) => {
              const isSelected = settings.colorMode === option.value;
              const isDarkMode = settings.colorMode === 'dark';
              
              return (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ colorMode: option.value as any })}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-purple-700 bg-purple-50'
                      : isDarkMode
                        ? 'border-gray-300 bg-gray-800'
                        : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <span className={`text-lg block ${
                          isSelected 
                            ? 'text-gray-900' 
                            : isDarkMode
                              ? 'text-white'
                              : 'text-gray-900'
                        }`}>{option.label}</span>
                        <span className={`text-sm ${
                          isSelected 
                            ? 'text-gray-600' 
                            : isDarkMode
                              ? 'text-gray-300'
                              : 'text-gray-600'
                        }`}>{option.description}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-2xl text-purple-700">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Assistance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">🔊</span>
            Voice Assistance
          </h2>
          
          <button
            onClick={() => updateSettings({ voiceGuide: !settings.voiceGuide })}
            className={`w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all ${
              settings.voiceGuide
                ? 'border-purple-700 bg-purple-50'
                : settings.colorMode === 'dark'
                  ? 'border-gray-300 bg-gray-800'
                  : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-left">
              <p className={`text-lg mb-1 ${
                settings.voiceGuide 
                  ? 'text-gray-900' 
                  : settings.colorMode === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
              }`}>Enable Voice Guide</p>
              <p className={`${
                settings.voiceGuide 
                  ? 'text-gray-600' 
                  : settings.colorMode === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-600'
              }`}>Hear button descriptions aloud</p>
            </div>
            
            <div className={`w-14 h-7 rounded-full transition-all ${
              settings.voiceGuide ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full transition-all mt-0.5 ${
                settings.voiceGuide ? 'ml-7' : 'ml-0.5'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Haptic Feedback */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">📳</span>
            {t('hapticFeedback')}
          </h2>
          
          <button
            onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
            className={`w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all ${
              settings.hapticFeedback
                ? 'border-purple-700 bg-purple-50'
                : settings.colorMode === 'dark'
                  ? 'border-gray-300 bg-gray-800'
                  : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-left">
              <p className={`text-lg mb-1 ${
                settings.hapticFeedback 
                  ? 'text-gray-900' 
                  : settings.colorMode === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
              }`}>Vibration Feedback</p>
              <p className={`${
                settings.hapticFeedback 
                  ? 'text-gray-600' 
                  : settings.colorMode === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-600'
              }`}>Feel vibrations on button press</p>
            </div>
            
            <div className={`w-14 h-7 rounded-full transition-all ${
              settings.hapticFeedback ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full transition-all mt-0.5 ${
                settings.hapticFeedback ? 'ml-7' : 'ml-0.5'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Simplified Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Simplified Layout
          </h2>
          
          <button
            onClick={() => updateSettings({ simplifiedNavigation: !settings.simplifiedNavigation })}
            className={`w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all ${
              settings.simplifiedNavigation
                ? 'border-purple-700 bg-purple-50'
                : settings.colorMode === 'dark'
                  ? 'border-gray-300 bg-gray-800'
                  : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-left">
              <p className={`text-lg mb-1 ${
                settings.simplifiedNavigation 
                  ? 'text-gray-900' 
                  : settings.colorMode === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
              }`}>Simplified Navigation</p>
              <p className={`${
                settings.simplifiedNavigation 
                  ? 'text-gray-600' 
                  : settings.colorMode === 'dark'
                    ? 'text-gray-300'
                    : 'text-gray-600'
              }`}>Show fewer options at once</p>
            </div>
            
            <div className={`w-14 h-7 rounded-full transition-all ${
              settings.simplifiedNavigation ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full transition-all mt-0.5 ${
                settings.simplifiedNavigation ? 'ml-7' : 'ml-0.5'
              }`}></div>
            </div>
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
          <h3 className="text-purple-900 text-lg mb-4">Current Settings Preview</h3>
          <div className="space-y-2 text-purple-800">
            <p>✓ Text Size: {settings.textSize}</p>
            <p>✓ Color Mode: {settings.colorMode}</p>
            <p>✓ Voice Guide: {settings.voiceGuide ? 'On' : 'Off'}</p>
            <p>✓ Haptic: {settings.hapticFeedback ? 'On' : 'Off'}</p>
            <p>✓ Simplified: {settings.simplifiedNavigation ? 'On' : 'Off'}</p>
          </div>
        </div>

        {/* Reset Button */}
        <AccessibleButton
          variant="outlined"
          fullWidth
          onClick={resetSettings}
        >
          Reset to Default Settings
        </AccessibleButton>

        {/* Confirmation */}
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <p className="text-green-800 text-lg">
            ✓ Settings saved automatically
          </p>
        </div>
      </main>
    </div>
  );
}