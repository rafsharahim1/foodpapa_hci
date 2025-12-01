import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useTranslation } from '../hooks/useTranslation';

interface OrderHistoryScreenProps {
  onBack: () => void;
  onReorder: () => void;
}

export function OrderHistoryScreen({ onBack, onReorder }: OrderHistoryScreenProps) {
  const { t } = useTranslation();
  
  const orders = [
    {
      id: '12345',
      restaurantKey: 'pizzaHeaven',
      itemsKey: 'margheritaPizza',
      total: 738,
      date: 'Today, 2:30 PM',
      status: 'delivered',
      image: 'https://images.unsplash.com/photo-1724232865752-4af928d13989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MjM1OTU4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '12344',
      restaurantKey: 'spiceParadise',
      itemsKey: 'chickenBiryani',
      total: 650,
      date: 'Yesterday, 7:45 PM',
      status: 'delivered',
      image: 'https://images.unsplash.com/photo-1758939560393-4b7cba143cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGJpcnlhbml8ZW58MXx8fHwxNzYyNDE5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '12343',
      restaurantKey: 'goldenDragon',
      itemsKey: 'friedRice',
      total: 890,
      date: '2 days ago',
      status: 'delivered',
      image: 'https://images.unsplash.com/photo-1755003858507-408a1a683790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYyNDE5NTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === 'delivered') return 'bg-green-100 text-green-800';
    if (status === 'preparing') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'delivered') return `✓ ${t('delivered')}`;
    if (status === 'preparing') return `🕒 ${t('preparing')}`;
    return status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('orderHistory')}</h1>
        </div>
        <p className="text-gray-600 text-lg ml-14">
          {t('pastOrders')}
        </p>
      </header>

      <main className="px-6 py-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order Image */}
              <img
                src={order.image}
                alt={t(order.restaurantKey as any)}
                className="w-full h-40 object-cover"
              />

              {/* Order Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-900 mb-1">{t(order.restaurantKey as any)}</h3>
                    <p className="text-gray-600 mb-2">{t(order.itemsKey as any)}</p>
                    <p className="text-gray-500">{order.date}</p>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ml-3 ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-lg">{t('orderId')} #{order.id}</span>
                  <span className="text-purple-700 text-2xl">Rs. {order.total}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <AccessibleButton
                    variant="primary"
                    fullWidth
                    onClick={onReorder}
                    icon={<span className="text-xl">🔄</span>}
                  >
                    {t('reorder')}
                  </AccessibleButton>

                  <button className="flex-1 min-h-[56px] px-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
                    {t('orderDetails')}
                  </button>
                </div>

                {/* Receipt Button */}
                <button className="w-full mt-3 text-purple-700 underline text-lg min-h-[44px]">
                  {t('orderSummary')}
                </button>
              </div>

              {/* Voice Summary */}
              <div className="bg-purple-50 border-t-2 border-purple-100 px-5 py-4">
                <button className="w-full flex items-center justify-center gap-3 text-purple-900">
                  <span className="text-2xl">🔊</span>
                  <span className="text-lg">{t(order.restaurantKey as any)} - {t('delivered')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no orders) */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-gray-900 text-xl mb-2">{t('emptyCart')}</h3>
            <p className="text-gray-600 mb-6">{t('startShopping')}</p>
            <AccessibleButton variant="primary" onClick={onBack}>
              {t('restaurants')}
            </AccessibleButton>
          </div>
        )}
      </main>
    </div>
  );
}
