import { AccessibleBackButton } from './AccessibleBackButton';
import { AccessibleButton } from './AccessibleButton';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LiveChatScreenProps {
  onBack: () => void;
}

export function LiveChatScreen({ onBack }: LiveChatScreenProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: t('chatWelcomeMessage'),
      time: '2:30 PM'
    }
  ]);

  // Smart response mapping
  const getSmartResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Track order
    if (lowerMessage.includes('track') || lowerMessage.includes('ٹریک') || lowerMessage.includes('order') || lowerMessage.includes('آرڈر')) {
      return t('chatAnswerTrackOrder');
    }
    
    // Payment issues
    if (lowerMessage.includes('payment') || lowerMessage.includes('ادائیگی') || lowerMessage.includes('pay') || lowerMessage.includes('refund')) {
      return t('chatAnswerPaymentIssue');
    }
    
    // Cancel order
    if (lowerMessage.includes('cancel') || lowerMessage.includes('منسوخ')) {
      return t('chatAnswerCancelOrder');
    }
    
    // Delivery time
    if (lowerMessage.includes('delivery') || lowerMessage.includes('ڈلیوری') || lowerMessage.includes('time') || lowerMessage.includes('وقت') || lowerMessage.includes('long')) {
      return t('chatAnswerDeliveryTime');
    }
    
    // Rewards
    if (lowerMessage.includes('reward') || lowerMessage.includes('انعام') || lowerMessage.includes('point') || lowerMessage.includes('پوائنٹ')) {
      return t('chatAnswerRewards');
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('شکریہ') || lowerMessage.includes('thanks')) {
      return t('chatAnswerThankYou');
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('مدد')) {
      return t('chatAnswerHelp');
    }
    
    // Default response
    return t('chatAnswerHelp');
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      
      const userMsg = message;
      setMessage('');

      // Simulate agent typing
      setTimeout(() => {
        const typingMessage = {
          id: messages.length + 2,
          sender: 'agent',
          text: t('typingIndicator'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, typingMessage]);
        
        // Replace typing with actual response
        setTimeout(() => {
          const agentResponse = {
            id: messages.length + 3,
            sender: 'agent',
            text: getSmartResponse(userMsg),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => prev.slice(0, -1).concat(agentResponse));
        }, 1500);
      }, 800);
    }
  };

  const handleQuickAction = (quickMessage: string) => {
    setMessage(quickMessage);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-purple-700 px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <AccessibleBackButton 
            onClick={onBack}
            className="!text-white !border-white hover:!bg-purple-600"
          />
          <div className="flex-1">
            <h1 className="text-white text-xl">{t('liveChat')}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-purple-100 text-sm">{t('online')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.sender === 'user'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-lg mb-1">{msg.text}</p>
              <p
                className={`text-sm ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </main>

      {/* Message Input - Fixed at bottom */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 fixed bottom-0 left-0 right-0">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
            className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl outline-none focus:border-purple-700"
          />
          <AccessibleButton
            variant="primary"
            onClick={handleSend}
            disabled={!message.trim()}
            className="min-w-[80px]"
          >
            {t('send')}
          </AccessibleButton>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleQuickAction(t('chatQuestionTrackOrder'))}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 min-h-[44px]"
          >
            {t('chatQuickTrackOrder')}
          </button>
          <button
            onClick={() => handleQuickAction(t('chatQuestionPaymentIssue'))}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 min-h-[44px]"
          >
            {t('chatQuickPaymentHelp')}
          </button>
          <button
            onClick={() => handleQuickAction(t('chatQuestionRewards'))}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 min-h-[44px]"
          >
            {t('chatQuickRewards')}
          </button>
        </div>
      </div>
    </div>
  );
}
