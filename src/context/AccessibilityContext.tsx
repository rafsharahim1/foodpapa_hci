import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large';
  colorMode: 'light' | 'dark' | 'high-contrast';
  voiceGuide: boolean;
  hapticFeedback: boolean;
  simplifiedNavigation: boolean;
  language: 'english' | 'urdu';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  isInitialSetup: boolean;
  completeSetup: () => void;
  isGuestMode: boolean;
  setIsGuestMode: (isGuest: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  textSize: 'medium',
  colorMode: 'light',
  voiceGuide: false,
  hapticFeedback: true,
  simplifiedNavigation: false,
  language: 'english'
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const completeSetup = () => {
    setIsInitialSetup(false);
  };

  // Apply dark mode class to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all mode classes first
    root.classList.remove('dark', 'high-contrast');
    
    // Apply the selected mode
    if (settings.colorMode === 'dark') {
      root.classList.add('dark');
    } else if (settings.colorMode === 'high-contrast') {
      root.classList.add('high-contrast');
    }
  }, [settings.colorMode]);

  // Apply enhanced accessibility features when high-contrast, voice guide, or simplified navigation is enabled
  // OR when in initial setup (before user makes choices)
  useEffect(() => {
    const root = document.documentElement;
    const isAccessibilityEnhanced = 
      isInitialSetup ||
      settings.colorMode === 'high-contrast' || 
      settings.voiceGuide || 
      settings.simplifiedNavigation;
    
    if (isAccessibilityEnhanced) {
      root.classList.add('accessibility-enhanced');
    } else {
      root.classList.remove('accessibility-enhanced');
    }
  }, [isInitialSetup, settings.colorMode, settings.voiceGuide, settings.simplifiedNavigation]);

  // Apply text size to root
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size', fontSizes[settings.textSize]);
  }, [settings.textSize]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings, isInitialSetup, completeSetup, isGuestMode, setIsGuestMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}