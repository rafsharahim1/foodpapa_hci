import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialStep {
  id: string;
  screen: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  voiceText: string;
}

interface TutorialContextType {
  isTutorialEnabled: boolean;
  currentStep: number;
  currentScreen: string;
  enableTutorial: () => void;
  disableTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  setCurrentScreen: (screen: string) => void;
  getCurrentStepForScreen: () => TutorialStep | null;
  getTotalStepsForScreen: () => number;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isTutorialEnabled, setIsTutorialEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

  // Load tutorial preferences from localStorage
  useEffect(() => {
    const tutorialEnabled = localStorage.getItem('foodpapa_tutorial_enabled');
    const tutorialCompleted = localStorage.getItem('foodpapa_tutorial_completed');
    
    if (tutorialEnabled === 'true' && tutorialCompleted !== 'true') {
      setIsTutorialEnabled(true);
    }
    
    if (tutorialCompleted === 'true') {
      setHasCompletedOnce(true);
    }
  }, []);

  const tutorialSteps: TutorialStep[] = [
    // Home Screen Steps
    {
      id: 'home-1',
      screen: 'home',
      target: 'language-toggle',
      title: 'changeLanguage',
      description: 'changeLanguageDesc',
      position: 'bottom',
      voiceText: 'changeLanguageVoice'
    },
    {
      id: 'home-2',
      screen: 'home',
      target: 'voice-guide',
      title: 'voiceGuide',
      description: 'voiceGuideDesc',
      position: 'bottom',
      voiceText: 'voiceGuideVoice'
    },
    {
      id: 'home-3',
      screen: 'home',
      target: 'search-button',
      title: 'searchFood',
      description: 'searchFoodDesc',
      position: 'bottom',
      voiceText: 'searchFoodVoice'
    },
    {
      id: 'home-4',
      screen: 'home',
      target: 'categories',
      title: 'browseCategories',
      description: 'browseCategoriesDesc',
      position: 'top',
      voiceText: 'browseCategoriesVoice'
    },
    {
      id: 'home-5',
      screen: 'home',
      target: 'restaurants',
      title: 'selectRestaurant',
      description: 'selectRestaurantDesc',
      position: 'top',
      voiceText: 'selectRestaurantVoice'
    },
    
    // Restaurant List Screen Steps
    {
      id: 'restaurants-1',
      screen: 'restaurants',
      target: 'filters',
      title: 'useFilters',
      description: 'useFiltersDesc',
      position: 'bottom',
      voiceText: 'useFiltersVoice'
    },
    {
      id: 'restaurants-2',
      screen: 'restaurants',
      target: 'restaurant-card',
      title: 'tapRestaurant',
      description: 'tapRestaurantDesc',
      position: 'top',
      voiceText: 'tapRestaurantVoice'
    },
    
    // Menu Screen Steps
    {
      id: 'menu-1',
      screen: 'menu',
      target: 'category-tabs',
      title: 'menuCategories',
      description: 'menuCategoriesDesc',
      position: 'bottom',
      voiceText: 'menuCategoriesVoice'
    },
    {
      id: 'menu-2',
      screen: 'menu',
      target: 'add-to-cart',
      title: 'addToCart',
      description: 'addToCartDesc',
      position: 'left',
      voiceText: 'addToCartVoice'
    },
    {
      id: 'menu-3',
      screen: 'menu',
      target: 'cart-button',
      title: 'viewCart',
      description: 'viewCartDesc',
      position: 'top',
      voiceText: 'viewCartVoice'
    },
    
    // Cart Screen Steps
    {
      id: 'cart-1',
      screen: 'cart',
      target: 'quantity-controls',
      title: 'changeQuantity',
      description: 'changeQuantityDesc',
      position: 'left',
      voiceText: 'changeQuantityVoice'
    },
    {
      id: 'cart-2',
      screen: 'cart',
      target: 'checkout-button',
      title: 'proceedCheckout',
      description: 'proceedCheckoutDesc',
      position: 'top',
      voiceText: 'proceedCheckoutVoice'
    }
  ];

  const enableTutorial = () => {
    console.log('📚 Tutorial enabled!');
    setIsTutorialEnabled(true);
    setCurrentStep(0);
    localStorage.setItem('foodpapa_tutorial_enabled', 'true');
    localStorage.removeItem('foodpapa_tutorial_completed');
  };

  const disableTutorial = () => {
    setIsTutorialEnabled(false);
    localStorage.setItem('foodpapa_tutorial_enabled', 'false');
  };

  const nextStep = () => {
    const stepsForCurrentScreen = tutorialSteps.filter(step => step.screen === currentScreen);
    const currentStepIndex = tutorialSteps.findIndex(step => step.id === stepsForCurrentScreen[currentStep]?.id);
    
    if (currentStepIndex < tutorialSteps.length - 1) {
      const nextScreenStep = tutorialSteps[currentStepIndex + 1];
      
      // If moving to a different screen, reset step counter
      if (nextScreenStep.screen !== currentScreen) {
        setCurrentStep(0);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Tutorial completed
      setIsTutorialEnabled(false);
      localStorage.setItem('foodpapa_tutorial_completed', 'true');
      setHasCompletedOnce(true);
    }
  };

  const skipTutorial = () => {
    setIsTutorialEnabled(false);
    localStorage.setItem('foodpapa_tutorial_completed', 'true');
    setHasCompletedOnce(true);
  };

  const getCurrentStepForScreen = (): TutorialStep | null => {
    const stepsForScreen = tutorialSteps.filter(step => step.screen === currentScreen);
    return stepsForScreen[currentStep] || null;
  };

  const getTotalStepsForScreen = (): number => {
    return tutorialSteps.filter(step => step.screen === currentScreen).length;
  };

  return (
    <TutorialContext.Provider
      value={{
        isTutorialEnabled,
        currentStep,
        currentScreen,
        enableTutorial,
        disableTutorial,
        nextStep,
        skipTutorial,
        setCurrentScreen,
        getCurrentStepForScreen,
        getTotalStepsForScreen
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}