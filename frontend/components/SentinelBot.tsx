import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SentinelBotProps {
  onFeedback?: (correct: boolean, topic: string) => void;
  topic?: string;
}

export default function SentinelBot({ onFeedback, topic = 'general' }: SentinelBotProps) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  const fetchWelcomeMessage = async () => {
    try {
      const response = await fetch('/api/sentinelbot/welcome');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('👋 Hi! I\'m SentinelBot, ready to help with your training!');
    }
  };

  const provideFeedback = async (correct: boolean) => {
    try {
      const response = await fetch('/api/sentinelbot/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct, topic })
      });
      const data = await response.json();
      setMessage(correct ? `${data.message} ${data.tip}` : `${data.message} ${data.hint} ${data.encouragement}`);
      onFeedback?.(correct, topic);
    } catch (error) {
      setMessage(correct ? '🎉 Great job!' : '🤔 Try again - you\'ve got this!');
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-blue-800">🤖 SentinelBot</h3>
          <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <p className="text-sm text-gray-700 mb-3">{message}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => provideFeedback(true)}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
          >
            ✓ Correct
          </button>
          <button 
            onClick={() => provideFeedback(false)}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          >
            ✗ Need Help
          </button>
        </div>
      </CardContent>
    </Card>
  );
}