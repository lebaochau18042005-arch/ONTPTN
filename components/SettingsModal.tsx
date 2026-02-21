
import React, { useState } from 'react';
import { MODELS } from '../constants';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [model, setModel] = useState(localStorage.getItem('gemini_model') || MODELS[0].id);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_model', model);
    window.location.reload(); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-green-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl shadow-green-900/20 overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-white">
        <div className="p-8 border-b border-green-50 flex items-center justify-between bg-green-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white text-xl">
              <i className="fa-solid fa-earth-asia globe-spin"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-green-900">Cài đặt AI</h3>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Cấu hình bảo vật thám hiểm</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div>
            <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-3 ml-2">Mật mã AI (API Key)</label>
            <div className="relative group">
              <input 
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Dán API Key bí mật..."
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100 outline-none text-sm pr-14 transition-all"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-green-500 transition-colors"
              >
                <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 font-medium px-2">
              <i className="fa-solid fa-circle-info text-blue-400"></i>
              Lấy mã tại <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-green-500 font-black underline decoration-green-200">Google AI Studio</a>.
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-3 ml-2">Chọn trợ lý thông thái</label>
            <div className="grid grid-cols-1 gap-3">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`px-5 py-4 rounded-3xl border-2 text-sm text-left transition-all flex items-center justify-between group ${
                    model === m.id 
                      ? 'border-green-500 bg-green-50 text-green-800 font-black ring-4 ring-green-100/50' 
                      : 'border-slate-50 text-slate-400 bg-slate-50/50 hover:bg-white hover:border-green-200'
                  }`}
                >
                  <span>{m.name}</span>
                  <i className={`fa-solid fa-circle-check transition-all ${model === m.id ? 'text-green-500 scale-110' : 'text-slate-100 opacity-0'}`}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-yellow-50 border-2 border-dashed border-yellow-200 rounded-[24px] flex gap-4">
             <i className="fa-solid fa-earth-americas text-yellow-500 text-xl mt-1 rotate-12"></i>
             <p className="text-[11px] text-yellow-700 leading-relaxed font-bold">
               Thông tin của em chỉ được lưu trên chính chiếc máy này thôi, không ai khác biết được mật mã của em đâu! 🤫
             </p>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-green-50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white border-2 border-slate-100 rounded-3xl text-slate-400 font-black hover:bg-slate-50 transition-all active:scale-95"
          >
            Đóng lại
          </button>
          <button 
            onClick={handleSave}
            className="flex-2 py-4 px-10 gradient-bg text-white font-black rounded-3xl shadow-xl shadow-green-200 hover:scale-[1.03] transition-all active:scale-95"
          >
            Lưu Ngay Nè!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
