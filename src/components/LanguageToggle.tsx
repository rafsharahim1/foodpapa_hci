import { useAccessibility } from '../context/AccessibilityContext';

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'pill';
}

export function LanguageToggle({ variant = 'default' }: LanguageToggleProps) {
  const { settings, updateSettings } = useAccessibility();
  const language = settings.language === 'urdu' ? 'ur' : 'en';
  
  const setLanguage = (lang: 'en' | 'ur') => {
    updateSettings({ language: lang === 'ur' ? 'urdu' : 'english' });
  };

  // PILL VARIANT - Beautiful pill-shaped toggle like Hotels/Apartments example
  if (variant === 'pill') {
    return (
      <div className="relative inline-flex bg-purple-700 rounded-full p-1 shadow-lg">
        {/* Sliding Background */}
        <div
          className={`absolute top-1 h-[calc(100%-8px)] bg-white rounded-full transition-all duration-300 ease-out shadow-md ${
            language === 'en' 
              ? 'left-1 w-[calc(50%-4px)]' 
              : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
          }`}
        />
        
        {/* English Button */}
        <button
          onClick={() => setLanguage('en')}
          className={`relative z-10 px-6 py-3 rounded-full transition-all duration-300 min-w-[120px] ${
            language === 'en'
              ? 'text-purple-700'
              : 'text-white'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🇬🇧</span>
            <span className="text-lg">English</span>
          </span>
        </button>
        
        {/* Urdu Button */}
        <button
          onClick={() => setLanguage('ur')}
          className={`relative z-10 px-6 py-3 rounded-full transition-all duration-300 min-w-[120px] ${
            language === 'ur'
              ? 'text-purple-700'
              : 'text-white'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🇵🇰</span>
            <span className="text-lg">اردو</span>
          </span>
        </button>
      </div>
    );
  }

  // COMPACT VARIANT - For header
  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2 shadow-md border-2 border-gray-200 hover:border-purple-500 transition-all min-h-[56px]"
        aria-label={language === 'ur' ? 'Switch to English' : 'Switch to Urdu'}
      >
        <span className="text-lg text-gray-700 font-medium">
          {language === 'ur' ? 'اردو' : 'English'}
        </span>
        <div className={`relative w-14 h-7 rounded-full transition-colors ${
          language === 'ur' ? 'bg-purple-600' : 'bg-gray-300'
        }`}>
          <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            language === 'ur' ? 'translate-x-7' : 'translate-x-0'
          }`} />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
      className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all min-h-[72px] w-full"
      aria-label={language === 'ur' ? 'زبان کو انگریزی میں تبدیل کریں' : 'Switch language to Urdu'}
    >
      {/* English Side */}
      <div className={`flex items-center gap-2 transition-all ${
        language === 'en' ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
      }`}>
        <span className="text-3xl">🇬🇧</span>
        <span className={`text-xl transition-all ${
          language === 'en' ? 'text-white font-bold' : 'text-white/70'
        }`}>
          English
        </span>
      </div>

      {/* Toggle Switch */}
      <div className="relative w-20 h-10 bg-white bg-opacity-20 rounded-full p-1">
        <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-all duration-300 ${
          language === 'ur' ? 'left-11' : 'left-1'
        }`}>
          <span className="flex items-center justify-center h-full text-xl">
            {language === 'ur' ? '🇵🇰' : '🇬🇧'}
          </span>
        </div>
      </div>

      {/* Urdu Side */}
      <div className={`flex items-center gap-2 transition-all ${
        language === 'ur' ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
      }`}>
        <span className={`text-xl transition-all ${
          language === 'ur' ? 'text-white font-bold' : 'text-white/70'
        }`}>
          اردو
        </span>
        <span className="text-3xl">🇵🇰</span>
      </div>
    </button>
  );
}
