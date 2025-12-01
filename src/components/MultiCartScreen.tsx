import { ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import { AccessibleBackButton } from './AccessibleBackButton';

interface RestaurantCart {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  itemCount: number;
  totalPrice: string;
}

interface MultiCartScreenProps {
  carts: RestaurantCart[];
  onBack: () => void;
  onViewCart: (restaurantId: string) => void;
  onRemoveCart: (restaurantId: string) => void;
}

export function MultiCartScreen({ carts, onBack, onViewCart, onRemoveCart }: MultiCartScreenProps) {
  const totalAmount = carts.reduce((sum, cart) => {
    const price = parseInt(cart.totalPrice.replace(/[^0-9]/g, ''));
    return sum + price;
  }, 0);

  const totalItems = carts.reduce((sum, cart) => sum + cart.itemCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b-4 border-purple-700 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <AccessibleBackButton onClick={onBack} />
          <div className="flex-1">
            <h1 className="text-gray-900 text-2xl">My Carts</h1>
            <p className="text-gray-600 text-lg">
              {carts.length} {carts.length === 1 ? 'Restaurant' : 'Restaurants'}
            </p>
          </div>
          <ShoppingCart className="w-10 h-10 text-purple-700" strokeWidth={2.5} />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {carts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" strokeWidth={1.5} />
            <h2 className="text-gray-900 text-2xl mb-3">No Active Carts</h2>
            <p className="text-gray-600 text-lg">
              Start ordering from your favorite restaurants!
            </p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-lg mb-1">Total Items</p>
                  <p className="text-4xl">{totalItems}</p>
                </div>
                <div className="bg-purple-800 rounded-2xl px-6 py-5">
                  <p className="text-purple-100 text-lg mb-1">Total Amount</p>
                  <p className="text-4xl">₨{totalAmount}</p>
                </div>
              </div>
              <p className="text-purple-100 text-lg">
                From {carts.length} {carts.length === 1 ? 'restaurant' : 'restaurants'}
              </p>
            </div>

            {/* Cart List */}
            <div className="space-y-4">
              <h2 className="text-gray-900 text-xl mb-4">Active Carts</h2>
              
              {carts.map((cart) => (
                <div
                  key={cart.restaurantId}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-200"
                >
                  {/* Restaurant Header */}
                  <div className="flex items-center gap-4 p-5 border-b-2 border-gray-100">
                    <img
                      src={cart.restaurantImage}
                      alt={cart.restaurantName}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl text-gray-900 mb-1">
                        {cart.restaurantName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-700 text-white px-3 py-1 rounded-lg font-semibold">
                          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 text-lg">Cart Total:</span>
                      <span className="text-2xl text-purple-700 font-semibold">
                        {cart.totalPrice}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {/* View Cart Button */}
                      <button
                        onClick={() => onViewCart(cart.restaurantId)}
                        className="flex-1 min-h-[56px] bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-xl flex items-center justify-center gap-3 transition-colors"
                      >
                        <span className="text-lg">View & Checkout</span>
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveCart(cart.restaurantId)}
                        className="min-w-[56px] min-h-[56px] bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 rounded-xl flex items-center justify-center transition-colors"
                        aria-label={`Remove ${cart.restaurantName} cart`}
                      >
                        <Trash2 className="w-7 h-7" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}