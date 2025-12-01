import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function FloatingCartButton({ itemCount, onClick }: FloatingCartButtonProps) {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 right-6 min-w-[80px] min-h-[80px] bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 z-50 transition-all transform hover:scale-105"
      aria-label={`View cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative">
        <ShoppingCart className="w-9 h-9" strokeWidth={2.5} aria-hidden="true" />
        {itemCount > 0 && (
          <div 
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full min-w-[28px] min-h-[28px] flex items-center justify-center text-sm font-bold border-2 border-white"
            aria-hidden="true"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        )}
      </div>
      <span className="text-xs font-semibold" aria-hidden="true">Cart</span>
    </button>
  );
}
