import { AccessibleButton } from './AccessibleButton';
import { AccessibleBackButton } from './AccessibleBackButton';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Send } from 'lucide-react';

interface HelpSupportScreenProps {
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const { t } = useTranslation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('chatBotWelcome'),
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { id: 1, text: t('quickTrackMyOrder'), icon: '📦' },
    { id: 2, text: t('quickFindRestaurants'), icon: '🍕' },
    { id: 3, text: t('quickPaymentHelp'), icon: '💳' },
    { id: 4, text: t('quickMyRewards'), icon: '🎁' },
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Also check for Urdu keywords
    if (lowerMessage.includes('track') || lowerMessage.includes('order') || 
        lowerMessage.includes('ٹریک') || lowerMessage.includes('آرڈر')) {
      return t('botResponseTrackOrder');
    }
    
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('find') ||
        lowerMessage.includes('ریستوران') || lowerMessage.includes('تلاش')) {
      return t('botResponseFindRestaurants');
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') ||
        lowerMessage.includes('ادائیگی')) {
      return t('botResponsePayment');
    }
    
    if (lowerMessage.includes('reward') || lowerMessage.includes('point') ||
        lowerMessage.includes('انعام') || lowerMessage.includes('پوائنٹ')) {
      return t('botResponseRewards');
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how') ||
        lowerMessage.includes('مدد') || lowerMessage.includes('کیسے')) {
      return t('botResponseHelp');
    }
    
    if (lowerMessage.includes('discount') || lowerMessage.includes('offer') ||
        lowerMessage.includes('چھوٹ') || lowerMessage.includes('پیشکش')) {
      return t('botResponseOffers');
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('منسوخ')) {
      return t('botResponseCancel');
    }
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('time') ||
        lowerMessage.includes('ڈلیوری') || lowerMessage.includes('وقت')) {
      return t('botResponseDeliveryTime');
    }
    
    return t('botResponseDefault');
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const userMsg = inputText;
    setInputText('');

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(userMsg),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (replyText: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: replyText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(replyText),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const faqs = [
    {
      id: 1,
      question: t('faqHowToPlaceOrder'),
      answer: t('faqAnswerHowToPlaceOrder')
    },
    {
      id: 2,
      question: t('faqHowToTrackOrder'),
      answer: t('faqAnswerHowToTrackOrder')
    },
    {
      id: 3,
      question: t('faqHowToCancelOrder'),
      answer: t('faqAnswerHowToCancelOrder')
    },
    {
      id: 4,
      question: t('faqWhatAreRewards'),
      answer: t('faqAnswerWhatAreRewards')
    },
    {
      id: 5,
      question: t('faqHowToChangeLocation'),
      answer: t('faqAnswerHowToChangeLocation')
    },
    {
      id: 6,
      question: t('faqHowToUseVoiceSearch'),
      answer: t('faqAnswerHowToUseVoiceSearch')
    },
    {
      id: 7,
      question: t('faqWhatPaymentMethods'),
      answer: t('faqAnswerWhatPaymentMethods')
    },
    {
      id: 8,
      question: t('faqDeliveryCharges'),
      answer: t('faqAnswerDeliveryCharges')
    }
  ];

  const tutorialSteps = [
    {
      id: 1,
      title: t('search'),
      description: t('restaurants'),
      icon: '🔍'
    },
    {
      id: 2,
      title: t('addToCart'),
      description: t('menu'),
      icon: '🛒'
    },
    {
      id: 3,
      title: t('orderSummary'),
      description: t('checkout'),
      icon: '💵'
    },
    {
      id: 4,
      title: t('trackOrder'),
      description: t('orderTracking'),
      icon: '📍'
    },
    {
      id: 5,
      title: t('yourRewards'),
      description: t('points'),
      icon: '🎁'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <AccessibleBackButton onClick={onBack} label={t('profile')} />
          <h1 className="text-gray-900 text-2xl">{t('help')}</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <AccessibleButton
            variant="primary"
            fullWidth
            icon={<span className="text-3xl">📞</span>}
          >
            {t('contactUs')}
          </AccessibleButton>

          <AccessibleButton
            variant="secondary"
            fullWidth
            icon={<span className="text-3xl">💬</span>}
            onClick={() => setIsChatOpen(true)}
          >
            {t('liveChat')}
          </AccessibleButton>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-3">
            <span className="text-3xl">❓</span>
            {t('faq')}
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <span className="text-lg text-gray-900 pr-4">{faq.question}</span>
                  <span className="text-2xl flex-shrink-0">
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-lg whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4 flex items-center gap-3">
            <span className="text-3xl">📚</span>
            {t('howCanWeHelp')}
          </h2>

          <div className="space-y-4">
            {tutorialSteps.map((step) => (
              <div key={step.id} className="flex gap-4 p-4 bg-purple-50 rounded-xl">
                <span className="text-4xl flex-shrink-0">{step.icon}</span>
                <div>
                  <h3 className="text-gray-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-gray-900 text-2xl mb-4">{t('contactUs')}</h2>

          <div className="space-y-4">
            <button className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <span className="text-4xl">📧</span>
              <div className="text-left flex-1">
                <p className="text-gray-900 text-lg mb-1">Email</p>
                <p className="text-gray-600">support@foodpapa.com</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <span className="text-4xl">📞</span>
              <div className="text-left flex-1">
                <p className="text-gray-900 text-lg mb-1">{t('phoneNumber')}</p>
                <p className="text-gray-600">+92 300 1234567</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <span className="text-4xl">🕒</span>
              <div className="text-left flex-1">
                <p className="text-gray-900 text-lg mb-1">{t('time')}</p>
                <p className="text-gray-600">24/7</p>
              </div>
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 text-2xl mb-4">{t('help')}</h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {['😊', '😐', '😞'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedFeedback(emoji)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedFeedback === emoji
                    ? 'border-purple-700 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="text-5xl">{emoji}</span>
              </button>
            ))}
          </div>

          {selectedFeedback && (
            <div className="mt-4">
              <textarea
                placeholder={t('typeMessage')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg min-h-[120px] focus:border-purple-700 outline-none"
              />
              <AccessibleButton variant="primary" fullWidth className="mt-3">
                {t('send')}
              </AccessibleButton>
            </div>
          )}
        </div>
      </main>

      {/* Live Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Chat Header */}
          <header className="bg-purple-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl">{t('liveChat')}</h2>
                <p className="text-purple-200">{t('online')}</p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="min-w-[44px] min-h-[44px] text-3xl"
              >
                ×
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.sender === 'user'
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-lg mb-1">{msg.text}</p>
                  <p className={`text-sm ${msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            {/* Quick Replies */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">{t('quickRepliesLabel')}</p>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply.id}
                    className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl px-3 py-2 text-left transition-all min-h-[48px] flex items-center gap-2"
                    onClick={() => handleQuickReply(reply.text)}
                  >
                    <span className="text-xl">{reply.icon}</span>
                    <span className="text-sm text-gray-900">{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder={t('typeMessage')}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
              />
              <button
                onClick={handleSendMessage}
                className="w-14 h-14 bg-purple-700 hover:bg-purple-800 rounded-xl flex items-center justify-center transition-all active:scale-95"
              >
                <Send className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}