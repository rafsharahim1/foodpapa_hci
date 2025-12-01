import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useState } from 'react';
import { CreditCard, ChevronDown, ChevronUp, AlertCircle, MapPin } from 'lucide-react';
import { useAccessibleToast } from './AccessibleToast';
import { useTranslation } from '../hooks/useTranslation';
import { useAccessibility } from '../context/AccessibilityContext';

interface CheckoutScreenProps {
  onPlaceOrder: () => void;
  onBack: () => void;
}

interface ValidationErrors {
  streetAddress?: string;
  city?: string;
  pinCode?: string;
  phoneNumber?: string;
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export function CheckoutScreen({ onPlaceOrder, onBack }: CheckoutScreenProps) {
  const { t } = useTranslation();
  const toast = useAccessibleToast();
  const { isHighContrast } = useAccessibility();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  // Form state
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState('');
  const [selectedSavedAddress, setSelectedSavedAddress] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Saved cards (dummy data)
  const savedCards = [
    { id: '1', last4: '4242', brand: 'Visa', name: 'Ahmed Khan' },
    { id: '2', last4: '5555', brand: 'Mastercard', name: 'Fatima Ali' },
    { id: '3', last4: '3782', brand: 'Amex', name: 'Ali Hassan' },
  ];

  // Saved addresses (dummy data)
  const savedAddresses = [
    { 
      id: '1', 
      label: t('homeAddress'),
      street: 'House 123, Block 5, Gulshan-e-Iqbal',
      apartment: 'Flat 2A',
      city: t('karachi'),
      pinCode: '75300',
      phone: '0321-1234567'
    },
    { 
      id: '2', 
      label: t('officeAddress'),
      street: 'Suite 405, Bahria Tower, Main Clifton Road',
      apartment: '4th Floor',
      city: t('karachi'),
      pinCode: '75600',
      phone: '0321-7654321'
    },
    { 
      id: '3', 
      label: t('parentsHouse'),
      street: 'Villa 78, DHA Phase 6, Khayaban-e-Sehar',
      apartment: '',
      city: t('karachi'),
      pinCode: '75500',
      phone: '0333-9876543'
    },
  ];

  // Saved address handler
  const handleSelectSavedAddress = (addressId: string) => {
    setSelectedSavedAddress(addressId);
    
    if (addressId === '') {
      // Clear form when "Use Current Location / Enter New" is selected
      return;
    }
    
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setStreetAddress(address.street);
      setApartment(address.apartment);
      setCity(address.city);
      setPinCode(address.pinCode);
      setPhoneNumber(address.phone);
      
      // Clear errors
      setErrors(prev => ({
        ...prev,
        streetAddress: undefined,
        city: undefined,
        pinCode: undefined,
        phoneNumber: undefined
      }));
      
      toast.success(`✅ ${address.label} ${t('addressLoadedSuccess')}`, '', { duration: 2000 });
    }
  };

  // GPS Location handler
  const handleUseGPS = () => {
    toast.success(t('gettingLocation'), '', { duration: 2000 });
    
    // Simulate GPS loading
    setTimeout(() => {
      // Auto-fill with dummy GPS data
      setStreetAddress('House 123, Block 5, Gulshan-e-Iqbal');
      setCity('Karachi');
      setPinCode('75300');
      setPhoneNumber('0321-1234567');
      
      // Clear errors
      setErrors(prev => ({
        ...prev,
        streetAddress: undefined,
        city: undefined,
        pinCode: undefined,
        phoneNumber: undefined
      }));
      
      toast.success(t('locationFilledAutomatically'), '', { duration: 3000 });
    }, 1500);
  };

  // Validation functions
  const validateStreetAddress = (value: string): string | undefined => {
    if (!value.trim()) return t('streetAddressRequired');
    if (value.trim().length < 5) return t('addressTooShort');
    return undefined;
  };

  const validateCity = (value: string): string | undefined => {
    if (!value || value === 'Select City' || value === t('selectCity')) return t('selectCityRequired');
    return undefined;
  };

  const validatePinCode = (value: string): string | undefined => {
    if (!value.trim()) return t('pinCodeRequired');
    if (!/^\d{5,6}$/.test(value)) return t('pinCodeInvalid');
    return undefined;
  };

  const validatePhoneNumber = (value: string): string | undefined => {
    if (!value.trim()) return t('phoneNumberRequired');
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 11) return t('phoneNumberInvalid');
    if (!cleaned.startsWith('03')) return t('phoneNumberMustStartWith03');
    return undefined;
  };

  const validateCardNumber = (value: string): string | undefined => {
    const cleaned = value.replace(/\s/g, '');
    if (!cleaned) return t('cardNumberRequired');
    if (!/^\d{16}$/.test(cleaned)) return t('cardNumberInvalid');
    return undefined;
  };

  const validateCardholderName = (value: string): string | undefined => {
    if (!value.trim()) return t('cardholderNameRequired');
    if (!/^[a-zA-Z\s]+$/.test(value)) return t('cardholderNameInvalid');
    if (value.trim().length < 3) return t('cardholderNameTooShort');
    return undefined;
  };

  const validateExpiryDate = (value: string): string | undefined => {
    if (!value.trim()) return t('expiryDateRequired');
    if (!/^\d{2}\/\d{2}$/.test(value)) return t('expiryDateInvalidFormat');
    
    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) return t('invalidMonth');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return t('cardExpired');
    }
    
    return undefined;
  };

  const validateCvv = (value: string): string | undefined => {
    if (!value.trim()) return t('cvvRequired');
    if (!/^\d{3,4}$/.test(value)) return t('cvvInvalid');
    return undefined;
  };

  // Format handlers
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) return cleaned;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 11)}`;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  // Input handlers with validation
  const handleStreetAddressChange = (value: string) => {
    setStreetAddress(value);
    if (touched.streetAddress) {
      setErrors(prev => ({ ...prev, streetAddress: validateStreetAddress(value) }));
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (touched.city) {
      setErrors(prev => ({ ...prev, city: validateCity(value) }));
    }
  };

  const handlePinCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 6);
    setPinCode(cleaned);
    if (touched.pinCode) {
      setErrors(prev => ({ ...prev, pinCode: validatePinCode(cleaned) }));
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    if (touched.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: validatePhoneNumber(formatted) }));
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    if (touched.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
    }
  };

  const handleCardholderNameChange = (value: string) => {
    // Only allow letters and spaces
    const cleaned = value.replace(/[^a-zA-Z\s]/g, '');
    setCardholderName(cleaned);
    if (touched.cardholderName) {
      setErrors(prev => ({ ...prev, cardholderName: validateCardholderName(cleaned) }));
    }
  };

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    setExpiryDate(formatted);
    if (touched.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: validateExpiryDate(formatted) }));
    }
  };

  const handleCvvChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 4);
    setCvv(cleaned);
    if (touched.cvv) {
      setErrors(prev => ({ ...prev, cvv: validateCvv(cleaned) }));
    }
  };

  // Handle blur events to show errors
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validations: Record<string, () => string | undefined> = {
      streetAddress: () => validateStreetAddress(streetAddress),
      city: () => validateCity(city),
      pinCode: () => validatePinCode(pinCode),
      phoneNumber: () => validatePhoneNumber(phoneNumber),
      cardNumber: () => validateCardNumber(cardNumber),
      cardholderName: () => validateCardholderName(cardholderName),
      expiryDate: () => validateExpiryDate(expiryDate),
      cvv: () => validateCvv(cvv),
    };
    
    const error = validations[field]?.();
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      streetAddress: validateStreetAddress(streetAddress),
      city: validateCity(city),
      pinCode: validatePinCode(pinCode),
      phoneNumber: validatePhoneNumber(phoneNumber),
    };

    if (paymentMethod === 'card') {
      newErrors.cardNumber = validateCardNumber(cardNumber);
      newErrors.cardholderName = validateCardholderName(cardholderName);
      newErrors.expiryDate = validateExpiryDate(expiryDate);
      newErrors.cvv = validateCvv(cvv);
    }

    setErrors(newErrors);
    
    // Mark all fields as touched
    const touchedFields: Record<string, boolean> = {
      streetAddress: true,
      city: true,
      pinCode: true,
      phoneNumber: true,
    };
    
    if (paymentMethod === 'card') {
      touchedFields.cardNumber = true;
      touchedFields.cardholderName = true;
      touchedFields.expiryDate = true;
      touchedFields.cvv = true;
    }
    
    setTouched(touchedFields);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== undefined);
    
    if (hasErrors) {
      toast.error(
        t('fixAllErrors'),
        t('reviewFormBeforePlacing'),
        { playSound: true }
      );
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      onPlaceOrder();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} />
          <h1 className="text-gray-900 text-2xl">{t('checkout')}</h1>
        </div>
      </header>
      
      <main className="px-6 py-6 pb-[200px]">
        {/* Delivery Address */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4">{t('deliveryAddress')}</h2>
          
          <div className="space-y-4">
            {/* Saved Addresses Dropdown */}
            <div>
              <label className="block text-gray-700 mb-2">{t('selectSavedAddress')}</label>
              <select
                className="w-full px-4 py-4 text-lg border-2 border-purple-300 rounded-xl outline-none focus:border-purple-700 bg-purple-50"
                value={selectedSavedAddress}
                onChange={(e) => handleSelectSavedAddress(e.target.value)}
              >
                <option value="">{t('useCurrentLocationOrNew')}</option>
                {savedAddresses.map(address => (
                  <option key={address.id} value={address.id}>
                    {address.label} - {address.street}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-4">
              <p className="text-gray-600 mb-4">
                {selectedSavedAddress ? t('editSelectedAddress') : t('enterDeliveryOrGPS')}
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">{t('streetAddressLabel')}</label>
              <input
                type="text"
                placeholder={t('enterStreetAddress')}
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                  errors.streetAddress ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                value={streetAddress}
                onChange={(e) => handleStreetAddressChange(e.target.value)}
                onBlur={() => handleBlur('streetAddress')}
              />
              {errors.streetAddress && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.streetAddress}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">{t('apartmentOptional')}</label>
              <input
                type="text"
                placeholder={t('apartmentPlaceholder')}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">{t('cityLabel')}</label>
                <select
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 bg-white ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  onBlur={() => handleBlur('city')}
                >
                  <option>{t('selectCity')}</option>
                  <option>{t('karachi')}</option>
                  <option>{t('lahore')}</option>
                  <option>{t('islamabad')}</option>
                  <option>{t('rawalpindi')}</option>
                  <option>{t('faisalabad')}</option>
                  <option>{t('multan')}</option>
                  <option>{t('hyderabad')}</option>
                  <option>{t('sukkur')}</option>
                  <option>{t('peshawar')}</option>
                  <option>{t('quetta')}</option>
                </select>
                {errors.city && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.city}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">{t('pinCodeLabel')}</label>
                <input
                  type="text"
                  placeholder="000000"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                    errors.pinCode ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  value={pinCode}
                  onChange={(e) => handlePinCodeChange(e.target.value)}
                  onBlur={() => handleBlur('pinCode')}
                />
                {errors.pinCode && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.pinCode}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">{t('phoneNumberLabel')}</label>
              <input
                type="text"
                placeholder="03XX-XXXXXXX"
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
              />
              {errors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errors.phoneNumber}
                </div>
              )}
            </div>
            
            {/* GPS Button - BIG and PROMINENT */}
            <button
              onClick={handleUseGPS}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5 flex items-center justify-center gap-3 transition-all min-h-[64px] shadow-md hover:shadow-lg"
              aria-label={t('useMyCurrentLocationGPS')}
            >
              <MapPin className="w-7 h-7" aria-hidden="true" />
              <span className="text-xl">{t('useMyCurrentLocationGPS')}</span>
            </button>
          </div>
        </section>
        
        {/* Payment Method */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-xl mb-4">{t('paymentMethod')}</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all min-h-[64px] ${
                paymentMethod === 'cash'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash' ? 'border-purple-700' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cash' && (
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <span className="text-lg text-gray-900">💵 {t('cashOnDelivery')}</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setPaymentMethod('card');
                setShowCardDetails(true);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all min-h-[64px] ${
                paymentMethod === 'card'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-purple-700' : 'border-gray-300'
              }`}>
                {paymentMethod === 'card' && (
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <span className="text-lg text-gray-900">💳 {t('creditDebitCard')}</span>
              </div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all min-h-[64px] ${
                paymentMethod === 'upi'
                  ? 'border-purple-700 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'upi' ? 'border-purple-700' : 'border-gray-300'
              }`}>
                {paymentMethod === 'upi' && (
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <span className="text-lg text-gray-900">📱 {t('upi')}</span>
              </div>
            </button>
          </div>
          
          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="mt-4">
              <button
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all min-h-[64px] bg-gray-50"
                onClick={() => setShowCardDetails(!showCardDetails)}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-gray-900" aria-hidden="true" />
                  <span className="text-lg text-gray-900">{t('enterCardDetails')}</span>
                </div>
                
                {showCardDetails ? (
                  <ChevronUp className="w-6 h-6 text-gray-900" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-900" aria-hidden="true" />
                )}
              </button>
              
              {showCardDetails && (
                <div className="space-y-4 mt-4">
                  {/* Saved Cards Dropdown - FIRST */}
                  <div>
                    <label className="block text-gray-700 mb-2">{t('selectSavedCard')}</label>
                    <select
                      className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700 bg-white"
                      value={selectedSavedCard}
                      onChange={(e) => setSelectedSavedCard(e.target.value)}
                    >
                      <option value="">{t('addNewCard')}</option>
                      {savedCards.map(card => (
                        <option key={card.id} value={card.id}>
                          {card.brand} •••• {card.last4} - {card.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Only show card input fields if "Add New Card" is selected */}
                  {selectedSavedCard === '' && (
                    <>
                      <div className="border-t-2 border-gray-200 pt-4">
                        <p className="text-gray-600 mb-4">{t('enterNewCardDetails')}</p>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">{t('cardNumberLabel')}</label>
                        <input
                          type="text"
                          placeholder={t('cardNumberPlaceholder')}
                          className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                            errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          onBlur={() => handleBlur('cardNumber')}
                        />
                        {errors.cardNumber && (
                          <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                            <AlertCircle className="w-4 h-4" aria-hidden="true" />
                            {errors.cardNumber}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">{t('expiryDateLabel')}</label>
                          <input
                            type="text"
                            placeholder={t('expiryDatePlaceholder')}
                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                              errors.expiryDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                            value={expiryDate}
                            onChange={(e) => handleExpiryDateChange(e.target.value)}
                            onBlur={() => handleBlur('expiryDate')}
                          />
                          {errors.expiryDate && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                              <AlertCircle className="w-4 h-4" aria-hidden="true" />
                              {errors.expiryDate}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">{t('cvvLabel')}</label>
                          <input
                            type="text"
                            placeholder={t('cvvPlaceholder')}
                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                              errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                            value={cvv}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            onBlur={() => handleBlur('cvv')}
                          />
                          {errors.cvv && (
                            <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.cvv}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">{t('cardholderNameLabel')}</label>
                        <input
                          type="text"
                          placeholder={t('cardholderNamePlaceholder')}
                          className={`w-full px-4 py-4 text-lg border-2 rounded-xl outline-none focus:border-purple-700 ${
                            errors.cardholderName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                          value={cardholderName}
                          onChange={(e) => handleCardholderNameChange(e.target.value)}
                          onBlur={() => handleBlur('cardholderName')}
                        />
                        {errors.cardholderName && (
                          <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cardholderName}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                        <input
                          type="checkbox"
                          id="saveCard"
                          className="w-5 h-5"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <label htmlFor="saveCard" className="text-gray-900">
                          {t('saveCardForFuture')}
                        </label>
                      </div>
                    </>
                  )}
                  
                  {/* CVV for saved cards */}
                  {selectedSavedCard !== '' && (
                    <div>
                      <label className="block text-gray-700 mb-2">{t('enterCVV')}</label>
                      <input
                        type="text"
                        placeholder={t('cvvPlaceholder')}
                        className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
                        maxLength={4}
                      />
                      <p className="text-sm text-gray-600 mt-1">{t('enterCVVForSecurity')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 text-xl mb-4">{t('orderSummaryHeading')}</h2>
          
          <div className="space-y-3 text-lg mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">2 {t('itemsCount')}</span>
              <span className="text-gray-900">₨848</span>
            </div>
            
            <div className="h-px bg-gray-200 my-3"></div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('deliveryLabel')}</span>
              <span className="text-gray-900">₨40</span>
            </div>
            
            <div className="h-px bg-gray-200 my-3"></div>
            
            <div className="flex justify-between text-green-600">
              <span>{t('discountLabel')}</span>
              <span>−₨150</span>
            </div>
            
            <div className="h-px bg-gray-300 my-4"></div>
            
            <div className="bg-purple-50 -mx-4 -mb-4 p-4 rounded-b-2xl">
              <div className="flex justify-between text-2xl">
                <span className="text-gray-900">{t('totalLabel')}</span>
                <span className="text-purple-700">₨738</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-40">
        <AccessibleButton
          variant="success"
          fullWidth
          onClick={handlePlaceOrder}
        >
          {t('placeOrder')} - ₨738
        </AccessibleButton>
      </div>
    </div>
  );
}