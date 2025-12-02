'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, Dumbbell, Target, Zap, Mic } from 'lucide-react';
import { ChatMessage } from '@/types';
import { generateChatResponse } from '@/lib/geminiService';

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '🤖 AI プロテインアドバイザーです！\n\n筋トレ・ダイエット・体づくりの悩み、なんでも聞いてください💪\n\n✨ 最適なプロテインも提案できます！',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // クイック返信オプション
  const quickReplies = [
    { icon: Dumbbell, text: '筋肉をつけたい', color: 'from-blue-500 to-blue-600' },
    { icon: Target, text: 'ダイエット中', color: 'from-blue-600 to-blue-700' },
    { icon: Zap, text: 'おすすめプロテイン', color: 'from-blue-500 to-blue-700' },
    { icon: Sparkles, text: '初心者です', color: 'from-blue-400 to-blue-600' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowQuickReplies(false); // クイック返信を非表示

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await generateChatResponse(messageText, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleQuickReply = (text: string) => sendMessage(text);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] backdrop-blur-xl bg-white/90 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/30">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-4 border-b border-white/10 flex justify-between items-center shadow-lg z-10 relative overflow-hidden">
            {/* 背景パターン */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-600/20"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI プロテインアドバイザー
                </h3>
                <span className="text-[10px] text-white/90 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse shadow-sm"></span>
                  ONLINE • 24/7 サポート
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-white hover:bg-white/20 p-1 rounded-full transition-all relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white/80 backdrop-blur-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none font-medium border border-white/20'
                      : 'bg-white/90 text-gray-800 rounded-tl-none font-medium border border-slate-200/50'
                  }`}
                  style={{ 
                    whiteSpace: 'pre-wrap' 
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* クイック返信ボタン */}
            {showQuickReplies && messages.length === 1 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-xs text-gray-500 text-center">よくある質問:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => {
                    const Icon = reply.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply.text)}
                        className={`bg-gradient-to-r ${reply.color} hover:scale-105 text-white text-xs font-medium p-3 rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5 backdrop-blur-sm border border-white/20`}
                      >
                        <Icon className="w-3 h-3" />
                        {reply.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500">AI が回答中...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-white/20">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="何でも聞いてください..."
                  className="w-full bg-white/90 text-gray-800 text-sm rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-slate-200/50 placeholder-gray-400 shadow-sm backdrop-blur-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-2xl transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen 
            ? 'bg-gradient-to-r from-gray-600 to-gray-700 rotate-180 scale-90' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-110 hover:rotate-12'
        }`}
      >
        {/* 背景エフェクト */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-blue-500/30 to-blue-600/30 blur-sm"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 bg-white/10 rounded-full blur-md"></div>
        
        {/* アイコン */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-300" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-sm"></div>
            </div>
          )}
        </div>
        
        {/* ホバー時のリング */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
      </button>
    </div>
  );
};