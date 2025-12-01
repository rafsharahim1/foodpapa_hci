import { useState, useCallback } from 'react';
import { useTranslation } from './useTranslation';
import { useVoiceAnnouncement } from '../components/VoiceGuide';
import { getRestaurantMenu, getRestaurantData } from '../utils/menuData';
import { useAccessibleToast } from '../components/AccessibleToast';

export function useMenuReader() {
  const { t, tVoice } = useTranslation();
  const { speakDirectly } = useVoiceAnnouncement();
  const toast = useAccessibleToast();
  const [isReading, setIsReading] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  const stopReading = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
    setCurrentRestaurantId(null);
    toast.showToast({ title: t('menuReadingStopped'), type: 'success' });
  }, [t, toast]);

  const readMenu = useCallback(async (restaurantId: string) => {
    // Stop any current reading
    if (isReading) {
      stopReading();
      return;
    }

    setIsReading(true);
    setCurrentRestaurantId(restaurantId);

    const restaurantData = getRestaurantData(restaurantId);
    const menu = getRestaurantMenu(restaurantId);

    // Start announcement
    const restaurantName = t(restaurantData.nameKey);
    const startMessage = `${tVoice('menuReadingStarted')} ${restaurantName}`;
    
    toast.showToast({ title: `${t('readMenu')} - ${restaurantName}`, type: 'info' });
    await speakDirectly(startMessage);

    // Read each category and its items
    for (const category of menu) {
      if (!isReading) break;

      const categoryName = t(category.nameKey);
      await speakDirectly(`${categoryName}`);

      for (const item of category.items) {
        if (!isReading) break;

        const itemName = t(item.nameKey);
        const itemDescription = item.descriptionKey ? t(item.descriptionKey) : '';
        const itemPrice = item.price;

        // Construct the announcement
        let announcement = `${itemName}. `;
        if (itemDescription) {
          announcement += `${itemDescription}. `;
        }
        announcement += `${tVoice('priceRupees')} ${itemPrice}.`;

        await speakDirectly(announcement);
        
        // Small pause between items
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Pause between categories
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Finish announcement
    setIsReading(false);
    setCurrentRestaurantId(null);
    toast.showToast({ title: t('menuReadingComplete'), type: 'success' });
  }, [isReading, stopReading, t, tVoice, toast, speakDirectly]);

  return {
    readMenu,
    stopReading,
    isReading,
    currentRestaurantId
  };
}