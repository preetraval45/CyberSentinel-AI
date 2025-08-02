import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  relatedDocs?: Array<{title: string; slug: string}>;
}

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m here to help you with CyberSentinel AI. What can I assist you with?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/docs/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId.current
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        relatedDocs: data.related_docs
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12"
        onClick={() => setIsOpen(true)}
      >
        💬
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 flex flex-col">
      <CardHeader className="flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">Help Assistant</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.content}</p>
                {message.relatedDocs && message.relatedDocs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium mb-1">Related articles:</p>
                    {message.relatedDocs.map((doc, i) => (
                      <a key={i} href={`/docs/${doc.slug}`} className="block text-xs text-blue-600 hover:underline">
                        {doc.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}