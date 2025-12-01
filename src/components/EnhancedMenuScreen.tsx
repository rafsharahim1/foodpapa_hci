import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { FloatingCartButton } from './FloatingCartButton';
import { useState } from 'react';
import { useAccessibleToast } from './AccessibleToast';
import { useTranslation } from '../hooks/useTranslation';
import { useVoiceAnnouncement } from './VoiceGuide';
import { useAccessibility } from '../context/AccessibilityContext';

interface EnhancedMenuScreenProps {
  onAddToCart: (item: { id: number; name: string; image: string; price: number }) => void;
  onBack: () => void;
  restaurantId?: string;
  onViewCart?: () => void;
}

export function EnhancedMenuScreen({ onAddToCart, onBack, restaurantId = 'restaurant-1', onViewCart }: EnhancedMenuScreenProps) {
  const { t, tVoice } = useTranslation();
  const { settings, isGuestMode } = useAccessibility();
  const toast = useAccessibleToast();
  const { speakDirectly } = useVoiceAnnouncement();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [showCartFeedback, setShowCartFeedback] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [showReviews, setShowReviews] = useState(false);
  const [currentReadingItem, setCurrentReadingItem] = useState<number | null>(null);
  const [isReadingSingleItem, setIsReadingSingleItem] = useState(false);
  const [isReadingFullMenu, setIsReadingFullMenu] = useState(false);
  const [fullMenuAbortController, setFullMenuAbortController] = useState<AbortController | null>(null);
  
  // Restaurant data with translation keys
  const restaurantData: Record<string, {
    nameKey: string;
    image: string;
    cuisine: string;
    distance: string;
    time: string;
    rating: string;
  }> = {
    'restaurant-1': {
      nameKey: 'kolachiRestaurant',
      image: 'https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('pakistani')}, ${t('bbq')}`,
      distance: '2.1 ' + t('km'),
      time: '25-35 ' + t('min'),
      rating: '4.5'
    },
    'restaurant-2': {
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('bbq')}, ${t('karahi')}, ${t('desi')}`,
      distance: '3.5 ' + t('km'),
      time: '30-40 ' + t('min'),
      rating: '4.7'
    },
    'restaurant-3': {
      nameKey: 'studentBiryani',
      image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('biryani')}, ${t('fastFood')}`,
      distance: '1.2 ' + t('km'),
      time: '15-25 ' + t('min'),
      rating: '4.3'
    },
    'restaurant-4': {
      nameKey: 'bbqTonight',
      image: 'https://images.unsplash.com/photo-1750190624513-020c9df74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWhhcmklMjBiZWVmfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('nihari')}, ${t('pakistani')}`,
      distance: '2.8 ' + t('km'),
      time: '25-35 ' + t('min'),
      rating: '4.6'
    },
    'restaurant-5': {
      nameKey: 'burgerKing',
      image: 'https://images.unsplash.com/photo-1660262849063-63c52a1fa2e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFwbGklMjBrYWJhYnxlbnwxfHx8fDE3NjI1OTIzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('fastFood')}, ${t('burgers')}`,
      distance: '1.5 ' + t('km'),
      time: '15-20 ' + t('min'),
      rating: '4.2'
    },
    'restaurant-12': {
      nameKey: 'pizzaHeaven',
      image: 'https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      cuisine: `${t('italian')}, ${t('pizza')}`,
      distance: '2.9 ' + t('km'),
      time: '25-35 ' + t('min'),
      rating: '4.4'
    }
  };

  const currentRestaurant = restaurantData[restaurantId] || restaurantData['restaurant-1'];

  // Different menus for different restaurants
  const menusByRestaurant: Record<string, any[]> = {
    'restaurant-1': [ // Kolachi Restaurant
      {
        id: 'starters',
        nameKey: 'bbqStarters',
        items: [
          {
            id: 1,
            nameKey: 'chickenTikka',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2F8ZW58MXx8fHwxNzYyNTE1MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨450',
            descriptionKey: 'marinatedGrilledChicken'
          },
          {
            id: 2,
            nameKey: 'chickenBoti',
            image: 'https://images.unsplash.com/photo-1705359573325-f2006d5e459f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwa2ViYWIlMjBza2V3ZXJ8ZW58MXx8fHwxNzYyNjI2NTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨480',
            descriptionKey: 'bonelessChickenTikka'
          },
          {
            id: 3,
            nameKey: 'seekhKabab',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFifGVufDF8fHx8MTc2MjU5MjU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨380',
            descriptionKey: 'mincedMeatGrilled'
          }
        ]
      },
      {
        id: 'mains',
        nameKey: 'mainCourse',
        items: [
          {
            id: 4,
            nameKey: 'chickenKarahi',
            image: 'https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwa2FyYWhpfGVufDF8fHx8MTc2MjU5MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨1200',
            descriptionKey: 'traditionalWokChicken'
          },
          {
            id: 5,
            nameKey: 'fishFry',
            image: 'https://images.unsplash.com/photo-1587869776335-bdef48f8114e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZnJ5JTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyNzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨950',
            descriptionKey: 'crispyFriedFish'
          },
          {
            id: 6,
            nameKey: 'naan',
            image: 'https://images.unsplash.com/photo-1697155406014-04dc649b0953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWFuJTIwYnJlYWR8ZW58MXx8fHwxNzYyNTY4NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: '₨60',
            descriptionKey: 'freshOvenBakedBread'
          }
        ]
      }
    ],
    'restaurant-2': [ // Bar.B.Q Tonight
      {
        id: 'starters',
        nameKey: 'bbqSpecials',
        items: [
          {
            id: 1,
            nameKey: 'seekhKabab',
            image: 'https://images.unsplash.com/photo-1592412544617-7c962b8b7271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVraCUyMGthYmFiJTIwZ3JpbGx8ZW58MXx8fHwxNjYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 420',
            descriptionKey: 'famousBBQKabab'
          },
          {
            id: 2,
            nameKey: 'chickenTikka',
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2F8ZW58MXx8fHwxNzYyNTE1MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 480',
            descriptionKey: 'signatureGrilledTikka'
          }
        ]
      },
      {
        id: 'karahi',
        nameKey: 'karahiSpecial',
        items: [
          {
            id: 3,
            nameKey: 'whiteKarahi',
            image: 'https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwa2FyYWhpfGVufDF8fHx8MTc2MjU5MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 1400',
            descriptionKey: 'creamyYogurtKarahi'
          },
          {
            id: 4,
            nameKey: 'redKarahi',
            image: 'https://images.unsplash.com/photo-1694579740719-0e601c5d2437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBrYXJhaGklMjBjaGlja2VufGVufDF8fHx8MTc2MjU5MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 1350',
            descriptionKey: 'spicyTomatoKarahi'
          }
        ]
      }
    ],
    'restaurant-3': [ // Student Biryani
      {
        id: 'biryani',
        nameKey: 'biryaniSelection',
        items: [
          {
            id: 1,
            nameKey: 'chickenBiryani',
            image: 'https://images.unsplash.com/photo-1625485617425-4eb8ed7d82d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcGxhdGV8ZW58MXx8fHwxNzYyNTkyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 280',
            descriptionKey: 'famousStudentBiryani'
          },
          {
            id: 2,
            nameKey: 'muttonBiryani',
            image: 'https://images.unsplash.com/photo-1701579231349-d7459c40919d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXR0b24lMjBiaXJ5YW5pfGVufDF8fHx8MTc2MjU5MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 380',
            descriptionKey: 'tenderMuttonRice'
          }
        ]
      },
      {
        id: 'sides',
        nameKey: 'sides',
        items: [
          {
            id: 3,
            nameKey: 'raita',
            image: 'https://images.unsplash.com/photo-1709620061649-b352f63ea4cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWl0YSUyMHlvZ3VydHxlbnwxfHx8fDE3NjI1OTI1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 80',
            descriptionKey: 'coolYogurtCucumber'
          }
        ]
      }
    ],
    'restaurant-4': [ // Bundu Khan
      {
        id: 'nihari',
        nameKey: 'nihariSpecials',
        items: [
          {
            id: 1,
            nameKey: 'beefNihari',
            image: 'https://images.unsplash.com/photo-1679060689538-602a9fd156fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwbmloYXJpfGVufDF8fHx8MTc2MjU5MjcwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 650',
            descriptionKey: 'slowCookedBeef'
          },
          {
            id: 2,
            nameKey: 'haleem',
            image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWxlZW0lMjBmb29kfGVufDF8fHx8MTc2MjU5MjM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 550',
            descriptionKey: 'traditionalWheatMeatStew'
          }
        ]
      },
      {
        id: 'breads',
        nameKey: 'freshBreads',
        items: [
          {
            id: 3,
            nameKey: 'naan',
            image: 'https://images.unsplash.com/photo-1697155406014-04dc649b0953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWFuJTIwYnJlYWR8ZW58MXx8fHwxNzYyNTY4NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 40',
            descriptionKey: 'tandoorBakedNaan'
          }
        ]
      }
    ],
    'restaurant-5': [ // Kababjees
      {
        id: 'burgers',
        nameKey: 'burgers',
        items: [
          {
            id: 1,
            nameKey: 'chickenBurger',
            image: 'https://images.unsplash.com/photo-1637710847214-f91d99669e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnVyZ2VyfGVufDF8fHx8MTc2MjQ3ODg5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 350',
            descriptionKey: 'juicyGrilledChickenBurger'
          },
          {
            id: 2,
            nameKey: 'zingerBurger',
            image: 'https://images.unsplash.com/photo-1637710847214-f91d99669e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnVyZ2VyfGVufDF8fHx8MTc2MjQ3ODg5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 380',
            descriptionKey: 'crispyFriedChickenBurger'
          }
        ]
      },
      {
        id: 'sides',
        nameKey: 'sidesFries',
        items: [
          {
            id: 3,
            nameKey: 'frenchFries',
            image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ec35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllc3xlbnwxfHx8fDE3NjI1MTUwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 150',
            descriptionKey: 'crispyGoldenFries'
          }
        ]
      }
    ],
    'restaurant-12': [ // Pompei Pizza
      {
        id: 'pizzas',
        nameKey: 'pizzas',
        items: [
          {
            id: 1,
            nameKey: 'margheritaPizza',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYyNDk5NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 850',
            descriptionKey: 'classicTomatoMozzarella'
          },
          {
            id: 2,
            nameKey: 'pepperoniPizza',
            image: 'https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 950',
            descriptionKey: 'loadedWithPepperoni'
          }
        ]
      },
      {
        id: 'sides',
        nameKey: 'sides',
        items: [
          {
            id: 3,
            nameKey: 'garlicBread',
            image: 'https://images.unsplash.com/photo-1697155406014-04dc649b0953?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWFuJTIwYnJlYWR8ZW58MXx8fHwxNzYyNTY4NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
            price: 'Rs. 250',
            descriptionKey: 'butteryGarlicBread'
          }
        ]
      }
    ]
  };

  const menuSections = menusByRestaurant[restaurantId] || menusByRestaurant['restaurant-1'];

  // Reviews data
  const reviews = [
    {
      id: 1,
      name: 'Rafsha',
      rating: 5,
      date: '2 days ago',
      comment: 'Amazing food! The chicken tikka was perfectly cooked and very flavorful. Will order again!',
      image: '👩'
    },
    {
      id: 2,
      name: 'Zehra',
      rating: 4,
      date: '1 week ago',
      comment: 'Good quality and fast delivery. The biryani was delicious. Recommended!',
      image: '👩‍🦰'
    },
    {
      id: 3,
      name: 'Farah',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Best karahi in Karachi! Fresh ingredients and generous portions. Highly recommended!',
      image: '👱♀️'
    }
  ];

  const toggleFavorite = (itemId: number) => {
    // If in guest mode, show sign-in prompt
    if (isGuestMode) {
      toast.error(
        t('signInRequired'),
        t('signInToAddFavorites')
      );
      return;
    }
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const handleAddToCart = (item: any) => {
    setAddedItems(new Set(addedItems).add(item.id));
    setCartCount(prev => prev + 1);
    setShowCartFeedback(true);
    setTimeout(() => setShowCartFeedback(false), 2000);
    
    // Extract numeric price from "Rs. XXX" format
    const priceNum = parseInt(item.price.replace(/\D/g, ''));
    
    // Get the translated name
    const itemName = t(item.nameKey as any);
    
    // Show accessible toast notification
    toast.success(
      `${itemName} ${t('addedToCart')}`,
      `${itemName} ${t('itemAddedToCartDescription')}`
    );
    
    // Pass full item data to parent
    onAddToCart({
      id: item.id,
      name: itemName,
      image: item.image,
      price: priceNum
    });
  };

  const getPickupTime = (deliveryTime: string) => {
    // Remove " min" suffix first, then split
    const timeString = deliveryTime.replace(' min', '');
    const [min, max] = timeString.split('-').map(str => parseInt(str.trim()));
    const pickupTime = Math.floor((min + max) / 2);
    return `${pickupTime} min`;
  };

  // Handle reading individual item
  const handleReadItem = async (itemId: number) => {
    setIsReadingSingleItem(true);
    setCurrentReadingItem(itemId);
    
    // Find the item to announce
    for (const section of menuSections) {
      const item = section.items.find((i: any) => i.id === itemId);
      if (item) {
        // Use tVoice for Roman Urdu fallback
        const itemName = tVoice(item.nameKey as any);
        const itemDescription = tVoice(item.descriptionKey as any);
        const itemPrice = item.price;
        const priceLabel = tVoice('price'); // "Price" or "Qeemat" (Roman Urdu)
        
        // CRITICAL FIX: Format price properly for Urdu TTS
        let priceText = '';
        if (settings.language === 'urdu') {
          // Extract just the number from price (e.g., "₨450" -> "450")
          const priceNumber = itemPrice.replace(/[^\d]/g, '');
          // In Urdu: say "Qeemat" (Roman) then the number then "rupaye"
          priceText = `${priceLabel} ${priceNumber} rupaye`;
        } else {
          // In English: "Price Rs. 450"
          priceText = `${priceLabel} ${itemPrice}`;
        }
        
        const textToRead = `${itemName}. ${itemDescription}. ${priceText}`;
        
        console.log('🔊 READING SINGLE ITEM:');
        console.log('   Text:', textToRead);
        
        // Use direct speech (bypasses settings, always works)
        await speakDirectly(textToRead);
        break;
      }
    }
    
    // Reset after speech completes
    setIsReadingSingleItem(false);
    setCurrentReadingItem(null);
  };

  // Handle reading full menu sequentially
  const handleReadFullMenu = async () => {
    if (isReadingFullMenu) {
      // Stop the visual progress
      if (fullMenuAbortController) {
        fullMenuAbortController.abort();
      }
      setIsReadingFullMenu(false);
      setCurrentReadingItem(null);
      return;
    }

    // Start visual progress simulation
    const abortController = new AbortController();
    setFullMenuAbortController(abortController);
    setIsReadingFullMenu(true);

    // Count total items
    const allItems: any[] = [];
    menuSections.forEach(section => {
      section.items.forEach((item: any) => {
        allItems.push(item);
      });
    });

    try {
      // Cycle through items with visual highlighting
      for (let i = 0; i < allItems.length; i++) {
        if (abortController.signal.aborted) break;

        const item = allItems[i];
        
        // Highlight current item
        setCurrentReadingItem(item.id);

        // Wait 1.5 seconds before moving to next item
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Finished
      if (!abortController.signal.aborted) {
        // Keep final state for a moment
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error simulating menu read:', error);
    } finally {
      setIsReadingFullMenu(false);
      setCurrentReadingItem(null);
      setFullMenuAbortController(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <AccessibleBackButton onClick={onBack} />
          
          {/* Delivery/Pickup Toggle - Shows Current Mode */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">{t('orderType')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`flex-1 min-h-[56px] rounded-xl transition-all border-2 ${
                  deliveryMode === 'delivery'
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span className="text-lg">{t('delivery')}</span>
                </span>
              </button>
              
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`flex-1 min-h-[56px] rounded-xl transition-all border-2 ${
                  deliveryMode === 'pickup'
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🏪</span>
                  <span className="text-lg">{t('pickup')}</span>
                </span>
              </button>
            </div>
          </div>

          <img
            src={currentRestaurant.image}
            alt={t(currentRestaurant.nameKey as any)}
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
          
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-gray-900 text-2xl mb-2">{t(currentRestaurant.nameKey as any)}</h1>
              <p className="text-gray-600 mb-2">{currentRestaurant.cuisine}</p>
              
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <span className="flex items-center gap-2">📍 {currentRestaurant.distance}</span>
                <span className="flex items-center gap-2">
                  {deliveryMode === 'delivery' ? '🚚' : '🏪'} 
                  {deliveryMode === 'delivery' ? currentRestaurant.time : getPickupTime(currentRestaurant.time)}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-lg min-h-[44px] hover:bg-green-200 active:bg-green-300 flex items-center justify-center gap-2"
                >
                  <span>⭐ {currentRestaurant.rating} - {t('reviews')}</span>
                </button>
                
                {/* Read Full Menu Button */}
                <button
                  onClick={() => handleReadFullMenu()}
                  className={`w-full min-h-[56px] rounded-xl flex items-center justify-center gap-3 transition-all ${
                    isReadingFullMenu
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  aria-label={`Read full menu aloud for ${t(currentRestaurant.nameKey as any)}`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {isReadingFullMenu ? '⏸️' : '🔊'}
                  </span>
                  <span className="text-xl">
                    {isReadingFullMenu
                      ? t('stopReading')
                      : t('readMenu')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Full Menu - All Categories Shown */}
      <main className="px-6 py-6">
        {menuSections.map((section) => (
          <div key={section.id} className="mb-8">
            {/* Section Header */}
            <div className="bg-purple-700 text-white rounded-2xl px-6 py-4 mb-4">
              <h2 className="text-2xl">{t(section.nameKey as any)}</h2>
            </div>

            {/* All Items Shown - No Accordion */}
            <div className="space-y-4">
              {section.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all ${
                    currentReadingItem === item.id && (isReadingSingleItem || isReadingFullMenu)
                      ? 'border-4 border-purple-500 scale-105'
                      : 'border-2 border-gray-100'
                  }`}
                >
                  <div className="relative p-4">
                    {/* Speaking Badge - Shows when this item is being read */}
                    {currentReadingItem === item.id && isReadingFullMenu && (
                      <div className="absolute top-2 left-2 bg-purple-700 text-white px-4 py-2 rounded-xl shadow-lg z-20 flex items-center gap-2 animate-pulse">
                        <span className="text-xl">🔊</span>
                        <span className="text-base">{t('speaking')}</span>
                      </div>
                    )}
                    
                    {/* Favorite Button - Absolutely Positioned Top Right */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white active:bg-gray-100 shadow-md z-10"
                      aria-label={favorites.has(item.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <span className="text-2xl">
                        {favorites.has(item.id) ? '❤️' : '🩶'}
                      </span>
                    </button>

                    <div className="flex gap-3">
                      {/* Image - Responsive sizing */}
                      <img
                        src={item.image}
                        alt={t(item.nameKey as any)}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl flex-shrink-0"
                      />
                      
                      {/* Content - More flexible */}
                      <div className="flex-1 min-w-0 pr-12">
                        {/* Speaker button and title */}
                        <div className="flex items-start gap-2 mb-2">
                          {/* Clickable Speaker Icon with ANIMATION */}
                          <button
                            onClick={() => handleReadItem(item.id)}
                            className={`min-w-[44px] min-h-[44px] flex items-center justify-center bg-purple-100 rounded-xl hover:bg-purple-200 active:bg-purple-300 transition-all flex-shrink-0 ${
                              currentReadingItem === item.id && isReadingSingleItem
                                ? 'animate-bounce bg-purple-300'
                                : ''
                            }`}
                            aria-label="Read this item aloud"
                          >
                            <span className={`text-xl transition-transform ${
                              currentReadingItem === item.id && isReadingSingleItem
                                ? 'scale-125'
                                : ''
                            }`}>
                              {currentReadingItem === item.id && isReadingSingleItem ? '🔊' : '🔈'}
                            </span>
                          </button>
                          
                          {/* Title - Allows wrapping to 2 lines */}
                          <h3 className="text-xl text-gray-900 line-clamp-2 leading-snug flex-1 min-w-0">
                            {t(item.nameKey as any)}
                          </h3>
                        </div>
                        
                        {/* Description - Responsive */}
                        <p className="text-gray-600 mb-2 text-base line-clamp-2">{t(item.descriptionKey as any)}</p>
                        
                        {/* Price */}
                        <p className="text-purple-700 text-2xl">{item.price}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button - Full Width */}
                  <div className="px-4 pb-4">
                    {addedItems.has(item.id) ? (
                      <div className="bg-green-50 text-green-700 rounded-xl px-4 py-4 text-center min-h-[56px] flex items-center justify-center gap-2">
                        <span className="text-2xl">✓</span>
                        <span className="text-lg">{t('added')}</span>
                      </div>
                    ) : (
                      <AccessibleButton
                        variant="success"
                        fullWidth
                        onClick={() => handleAddToCart(item)}
                      >
                        {t('addToCart')} - {item.price}
                      </AccessibleButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={cartCount}
        onClick={() => onViewCart && onViewCart()}
      />

      {/* Cart Feedback Toast */}
      {showCartFeedback && (
        <div className="fixed bottom-28 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span className="text-lg">{t('added')}!</span>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
          onClick={() => setShowReviews(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-purple-700 text-white px-6 py-6">
              <div>
                <h2 className="text-2xl mb-1">Customer Reviews</h2>
                <p className="text-purple-100">⭐ {currentRestaurant.rating} Average Rating</p>
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                        {review.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900">{review.name}</h3>
                        <p className="text-gray-500">{review.date}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className="text-2xl">
                          {index < review.rating ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button at Bottom */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <AccessibleButton
                variant="secondary"
                fullWidth
                onClick={() => setShowReviews(false)}
              >
                Close Reviews
              </AccessibleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
