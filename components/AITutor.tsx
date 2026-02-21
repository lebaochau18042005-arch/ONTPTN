
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Chào em! Thầy là trợ lý AI chuyên về Địa Lý. Em có thắc mắc gì về bài học hay cần giải thích khái niệm nào không?'
};

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await geminiService.askTutor(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err?.message?.includes('API Key')
          ? "Vui lòng cấu hình API Key trong phần Cài đặt trước nhé!"
          : "Xin lỗi, thầy đang bận một chút. Em kiểm tra lại kết nối hoặc API key nhé!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // BUG-4: Clear chat handler
  const handleClearChat = () => {
    if (messages.length <= 1) return;
    if (window.confirm('Bạn có muốn xóa toàn bộ cuộc trò chuyện không?')) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 px-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <i className="fa-solid fa-robot text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-sm">Gia sư Địa Lý AI</h3>
            <span className="text-[10px] text-green-400 uppercase font-bold tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Đang trực tuyến
            </span>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          title="Xóa cuộc trò chuyện"
          className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-700"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 shadow-sm text-slate-800 rounded-tl-none'
              }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-slate-400 font-medium italic">AI đang suy nghĩ...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hỏi AI bất cứ điều gì về Địa Lý..."
          className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 gradient-bg rounded-xl text-white flex items-center justify-center shadow-lg disabled:opacity-50 transition-transform active:scale-95"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AITutor;
