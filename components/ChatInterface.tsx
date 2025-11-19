import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Painting } from '../types';
import { getPaintingDetailsChat } from '../services/geminiService';

interface ChatInterfaceProps {
  painting: Painting;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ painting }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: `Welcome. I am your AI curator. Ask me anything about "${painting.title}" or Aivazovsky's technique.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await getPaintingDetailsChat(history, painting, userMsg.text);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/10 dark:bg-slate-800/20 rounded-2xl border border-white/30 dark:border-white/5 overflow-hidden shadow-inner transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/20 dark:bg-black/10 px-5 py-3 border-b border-white/10 backdrop-blur-md flex justify-between items-center">
        <h4 className="text-slate-700 dark:text-slate-200 font-serif text-sm flex items-center gap-2 font-bold tracking-wide">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Curator Chat
        </h4>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold opacity-70">Gemini 2.5</span>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-200/50 dark:scrollbar-thumb-slate-700/50 scrollbar-track-transparent" ref={scrollRef}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md transition-all duration-300 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600/90 to-blue-500/90 text-white rounded-br-none shadow-blue-500/20' 
                : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-bl-none border border-white/40 dark:border-white/10'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/40 dark:bg-slate-700/40 border border-white/30 dark:border-white/5 text-slate-400 px-5 py-4 rounded-2xl rounded-bl-none text-xs flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/20 dark:border-white/5 bg-white/10 dark:bg-black/5 backdrop-blur-md">
        <div className="flex gap-3 shadow-inner rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-white/5 p-1.5 focus-within:ring-2 focus-within:ring-blue-400/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this masterpiece..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400 placeholder:font-light"
          />
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};