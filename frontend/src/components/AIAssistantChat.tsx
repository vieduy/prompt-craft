import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import brain from 'brain';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add a placeholder for the assistant's response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = brain.run_prompt_playground({ prompt: input });
      for await (const chunk of stream) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
          }
          return [...prev];
        });
      }
    } catch (error) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = 'Sorry, I encountered an error. Please try again.';
        }
        return [...prev];
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-scroll to the bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[500px] w-full max-w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-2xl border border-gray-200 overflow-x-hidden overflow-y-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md flex-shrink-0">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
          <Sparkles className="w-5 h-5 text-yellow-200" />
        </span>
        <h2 className="text-lg font-bold tracking-tight">AI Assistant</h2>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0 px-2 py-2 overflow-x-hidden w-full max-w-full">
        <ScrollArea className="flex-1 min-h-0 h-full overflow-y-auto overflow-x-hidden pr-2 w-full max-w-full" ref={scrollAreaRef}>
          <div className="space-y-4 flex flex-col justify-end pb-2 w-full max-w-full">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[100px] text-center text-gray-400 select-none animate-fade-in">
                <Sparkles className="w-8 h-8 mb-2 text-purple-300" />
                <div className="text-base font-semibold mb-1">How can I help you today?</div>
                <div className="text-xs">Ask a question about this lesson, or try a prompt!</div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 transition-all duration-200 animate-fade-in w-full max-w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-6 h-6 bg-purple-100 text-purple-600 shadow flex-shrink-0">
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`w-full max-w-full px-3 py-2 rounded-2xl text-sm shadow-md break-all transition-all duration-200
                    ${message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md ml-6'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md mr-6'}
                  `}
                  style={{wordBreak: 'break-all', overflowWrap: 'anywhere'}}
                >
                  <ReactMarkdown 
                    className="prose prose-xs max-w-full prose-p:mb-1 prose-p:mt-0 prose-p:break-all prose-strong:text-purple-600 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-all prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded prose-pre:text-xs prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:break-all prose-ul:break-all prose-ol:break-all prose-li:break-all"
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0 break-all max-w-full" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</p>,
                      code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono break-all max-w-full" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto max-w-full break-all" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</pre>,
                      ul: ({ children }) => <ul className="break-all max-w-full" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</ul>,
                      ol: ({ children }) => <ol className="break-all max-w-full" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</ol>,
                      li: ({ children }) => <li className="break-all max-w-full" style={{overflowWrap: 'anywhere', wordBreak: 'break-all'}}>{children}</li>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-6 h-6 bg-blue-100 text-blue-600 shadow flex-shrink-0">
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-end gap-2 justify-start animate-fade-in">
                <Avatar className="w-6 h-6 bg-purple-100 text-purple-600 shadow flex-shrink-0">
                  <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-3 py-2 bg-white border border-gray-200 text-gray-900 shadow-md flex items-center gap-1 mr-6">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Input area */}
      <div className="p-2 border-t bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or test a prompt..."
            className="text-sm flex-grow rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400/40 resize-none min-h-[32px] max-h-[80px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSendMessage(e);
              }
            }}
            disabled={isLoading}
            autoFocus
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg transition-all duration-200"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// Add fade-in animation
// In your global CSS (e.g., index.css or tailwind.css), add:
// .animate-fade-in { animation: fadeIn 0.4s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
