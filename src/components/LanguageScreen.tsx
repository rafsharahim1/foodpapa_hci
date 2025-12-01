import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

interface LanguageScreenProps {
  onBack: () => void;
}

export function LanguageScreen({ onBack }: LanguageScreenProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: 'en' as const,
      name: 'English',
      nativeName: 'English',
      icon: '🇬🇧',
      description: 'Use English for all text and voice'
    },
    {
      code: 'ur' as const,
      name: 'Urdu',
      nativeName: 'اردو',
      icon: '🇵🇰',
      description: 'تمام متن اور آواز کے لیے اردو استعمال کریں'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('language')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Language Selection */}
        <div className="space-y-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full bg-white rounded-2xl p-6 shadow-sm transition-all flex items-center gap-4 border-2 ${
                language === lang.code
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                {lang.icon}
              </div>

              <div className="flex-1 text-left">
                <p className="text-2xl text-gray-900 mb-1">{lang.nativeName}</p>
                <p className="text-gray-600">{lang.description}</p>
              </div>

              {language === lang.code && (
                <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Language Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6">
          <p className="text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>{t('languageInfo')}</span>
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t('languageInfoDescription')}
          </p>
        </div>

        {/* Voice Language Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎙️</span>
            <div>
              <p className="text-gray-900 text-xl mb-2">{t('voiceLanguage')}</p>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ur' 
                  ? 'آواز کی تلاش اور رہنمائی آپ کی منتخب شدہ زبان میں ہوگی'
                  : 'Voice search and guidance will be in your selected language'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Translation Coverage */}
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-5">
          <p className="text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <span>{t('fullyCovered')}</span>
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-lg">•</span>
              <span>{t('allMenus')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">•</span>
              <span>{t('restaurantNames')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">•</span>
              <span>{t('foodCategories')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">•</span>
              <span>{t('voiceCommands')}</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
