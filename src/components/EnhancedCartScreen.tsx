import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessibleToast } from './AccessibleToast';

interface EnhancedCartScreenProps {
  onCheckout: () => void;
  onBack: () => void;
  onGoToRestaurants?: () => void;
  cartItems?: Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  onUpdateQuantity?: (id: number, newQuantity: number) => void;
  onRemoveItem?: (id: number) => void;
  onRestoreItem?: (item: { id: number; name: string; image: string; price: number; quantity: number }) => void;
}

export function EnhancedCartScreen({ 
  onCheckout, 
  onBack, 
  onGoToRestaurants,
  cartItems: propCartItems,
  onUpdateQuantity,
  onRemoveItem,
  onRestoreItem
}: EnhancedCartScreenProps) {
  const { t } = useTranslation();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [lastRemoved, setLastRemoved] = useState<any>(null);
  const [undoTimer, setUndoTimer] = useState(5);
  const toast = useAccessibleToast();

  // Use prop cart items or fallback to empty array
  const cartItems = propCartItems || [];

  // Countdown timer for undo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showUndo && undoTimer > 0) {
      interval = setInterval(() => {
        setUndoTimer((prev) => {
          if (prev <= 1) {
            setShowUndo(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showUndo, undoTimer]);
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <AccessibleBackButton onClick={onBack} />
            <h1 className="text-gray-900 text-2xl">{t('cart')}</h1>
          </div>
        </header>
        
        {/* Empty State */}
        <main className="flex-1 flex items-center justify-center px-6 pb-24">
          <div className="text-center max-w-sm">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl text-gray-900 mb-3">{t('cartEmpty')}</h2>
            <p className="text-gray-600 mb-8">{t('cartEmptyDescription')}</p>
            <AccessibleButton
              onClick={onGoToRestaurants || onBack}
              variant="primary"
              size="large"
              className="w-full"
            >
              {t('browseRestaurants')}
            </AccessibleButton>
          </div>
        </main>

        {/* Undo Snackbar - Also show on empty cart screen! */}
        {showUndo && lastRemoved && (
          <div 
            className="fixed bottom-6 left-4 right-4 bg-gray-900 text-white rounded-2xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - Trash Icon + Item Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate text-lg">
                    {lastRemoved.name}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {t('itemRemoved')}
                  </p>
                </div>
              </div>
              
              {/* Right Side - Undo Button */}
              <button
                onClick={handleUndo}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-3 rounded-xl min-h-[56px] min-w-[100px] transition-all shadow-lg flex-shrink-0"
                aria-label={`Undo removal of ${lastRemoved.name}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
                    />
                  </svg>
                  <span className="text-sm">{t('undo')}</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  const updateQuantity = (id: number, delta: number) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem && onUpdateQuantity) {
      const newQuantity = Math.max(1, currentItem.quantity + delta);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleRemove = (item: any) => {
    console.log('🔴 handleRemove called for:', item.name);
    
    // SET STATE FIRST before triggering parent update
    setLastRemoved(item);
    setUndoTimer(5);
    setShowUndo(true);
    setShowRemoveConfirm(null);
    
    console.log('🔴 States set - showUndo should be true, lastRemoved:', item.name);
    
    // THEN remove the item (this triggers parent re-render)
    if (onRemoveItem) {
      console.log('🔴 Calling onRemoveItem');
      onRemoveItem(item.id);
    }
    
    console.log('🔴 handleRemove complete');
  };

  const handleUndo = () => {
    setShowUndo(false);
    
    // Restore the removed item
    if (lastRemoved && onRestoreItem) {
      onRestoreItem(lastRemoved);
    }
    
    setLastRemoved(null);
  };
  
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const delivery = 40;
  const discount = 150;
  const total = subtotal + delivery - discount;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} />
          <h1 className="text-gray-900 text-2xl">{t('cart')}</h1>
        </div>
      </header>
      
      {/* Cart Items */}
      <main className="flex-1 px-6 py-6 overflow-y-auto pb-[450px]">
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex gap-4 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-purple-700 text-2xl">₨{item.price}</p>
                </div>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="min-w-[48px] min-h-[48px] bg-white rounded-lg text-2xl flex items-center justify-center hover:bg-gray-100 shadow-sm"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  
                  <span className="text-2xl min-w-[50px] text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="min-w-[48px] min-h-[48px] bg-white rounded-lg text-2xl flex items-center justify-center hover:bg-gray-100 shadow-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => setShowRemoveConfirm(item.id)}
                  className="text-red-600 underline text-lg min-h-[48px] px-4"
                >
                  {t('remove')}
                </button>
              </div>
              
              {/* Remove Confirmation */}
              {showRemoveConfirm === item.id && (
                <div className="mt-4 p-5 bg-red-50 rounded-xl border-2 border-red-200">
                  <p className="text-gray-900 text-lg mb-4">
                    Remove {item.name} from cart?
                  </p>
                  <div className="flex gap-3">
                    <AccessibleButton
                      variant="primary"
                      fullWidth
                      onClick={() => setShowRemoveConfirm(null)}
                    >
                      No, Keep Item
                    </AccessibleButton>
                    
                    <button
                      onClick={() => handleRemove(item)}
                      className="flex-1 min-h-[56px] px-6 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all"
                    >
                      Yes, Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bill Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4">{t('billSummary')}</h2>
          
          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('subtotal')} ({cartItems.length} {t('items')})</span>
              <span className="text-gray-900 text-xl">₨{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('delivery')}</span>
              <span className="text-gray-900 text-xl">₨{delivery}</span>
            </div>
            
            <div className="flex justify-between text-green-600">
              <span>{t('discountApplied')}</span>
              <span className="text-xl">−₨{discount}</span>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-900 text-2xl">{t('totalToPay')}</span>
                <span className="text-purple-700 text-3xl">₨{total}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Actions */}
      <div className="fixed bottom-24 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4 space-y-3 shadow-lg z-40">
        <AccessibleButton
          variant="success"
          fullWidth
          onClick={onCheckout}
          className="text-xl"
        >
          {t('proceedToCheckout')} - ₨{total}
        </AccessibleButton>
        
        <AccessibleButton
          variant="outlined"
          fullWidth
          onClick={onBack}
        >
          {t('continueShopping')}
        </AccessibleButton>
        
        {onGoToRestaurants && (
          <AccessibleButton
            variant="primary"
            fullWidth
            onClick={onGoToRestaurants}
          >
            {t('goToRestaurants')}
          </AccessibleButton>
        )}
      </div>

      {/* Undo Snackbar - Matches Design */}
      {showUndo && lastRemoved && (
        <div 
          className="fixed bottom-[280px] left-4 right-4 bg-gray-900 text-white rounded-2xl p-4 shadow-2xl z-[9999] border-4 border-yellow-400"
          role="alert"
          aria-live="assertive"
          style={{ position: 'fixed', bottom: '280px' }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Trash Icon + Item Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white truncate text-lg">
                  {lastRemoved.name}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {t('itemRemoved')}
                </p>
              </div>
            </div>
            
            {/* Right Side - Undo Button */}
            <button
              onClick={handleUndo}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-3 rounded-xl min-h-[56px] min-w-[100px] transition-all shadow-lg flex-shrink-0"
              aria-label={`Undo removal of ${lastRemoved.name}`}
            >
              <div className="flex flex-col items-center gap-1">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
                  />
                </svg>
                <span className="text-sm">{t('undo')}</span>
              </div>
            </button>
          </div>
          
          {/* DEBUG INFO */}
          <div className="mt-2 text-xs bg-yellow-400 text-black p-2 rounded">
            showUndo: {String(showUndo)} | hasItem: {String(!!lastRemoved)} | timer: {undoTimer}
          </div>
        </div>
      )}
    </div>
  );
}