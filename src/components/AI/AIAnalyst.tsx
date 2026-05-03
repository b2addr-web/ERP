import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, MessageSquare, Send, BrainCircuit, LineChart, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeData } from '../../services/gemini';
import { db } from '../../lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

export const AIAnalyst: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'أهلاً بك! أنا وكيل الذكاء الاصطناعي الخاص بك. كيف يمكنني مساعدتك في تحليل البيانات اليوم؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchContextData = async () => {
    // Collecting some context data for the AI to have a better understanding
    try {
      const financeQuery = query(collection(db, 'transactions'), limit(10));
      const financeSnap = await getDocs(financeQuery);
      const salesQuery = query(collection(db, 'invoices'), limit(10));
      const salesSnap = await getDocs(salesQuery);

      return {
        recentsTransactions: financeSnap.docs.map(doc => doc.data()),
        recentInvoices: salesSnap.docs.map(doc => doc.data()),
        currentPage: window.location.pathname
      };
    } catch (e) {
      console.warn("Could not fetch full context for AI:", e);
      return { currentPage: window.location.pathname };
    }
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim()) return;

    if (!customQuery) {
      setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
      setInput('');
    }
    
    setIsLoading(true);
    const context = await fetchContextData();
    const response = await analyzeData(context, textToSend);
    
    setMessages(prev => [...prev, { role: 'ai', content: response || 'عذرًا، لم أتمكن من معالجة طلبك.' }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        id="ai-analyst-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 z-50 group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <div className="absolute -top-1 -left-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-white animate-bounce" />
      </button>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-[60] flex flex-col border-l border-slate-200"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">وكيل الذكاء الاصطناعي</h3>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">مدعوم بـ Gemini 3</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                  }`}>
                    {m.role === 'ai' ? (
                      <div className="markdown-body prose prose-sm max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                    <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">جاري التفكير...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={() => handleSend("قم بتحليل السيولة والتدفق النقدي الحالي")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  <LineChart className="w-3 h-3" />
                  تحليل السيولة
                </button>
                <button 
                  onClick={() => handleSend("هل توجد مخاطر مالية في الفواتير المتأخرة؟")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold border border-rose-100 hover:bg-rose-100 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  توقعات المخاطر
                </button>
                <button 
                  onClick={() => handleSend("توقع أداء المبيعات للشهر القادم")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  توقع المبيعات
                </button>
              </div>

              {/* Input Area */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اسأل المحلل الذكي عن أي شيء..."
                  className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
