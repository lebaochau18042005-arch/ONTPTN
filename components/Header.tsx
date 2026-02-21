
import React from 'react';

interface HeaderProps {
  toggleSettings: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSettings, toggleSidebar }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-green-50 px-6 md:px-10 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors">
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-green-400 uppercase tracking-widest">Sĩ tử hôm nay</span>
            <i className="fa-solid fa-sparkles text-yellow-400 text-[10px] animate-pulse"></i>
          </div>
          <p className="text-lg font-black text-green-900">Chúc em học tập thật tốt! ✨</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={toggleSettings}
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all text-slate-600 hover:text-green-700 text-sm font-black group shadow-sm"
        >
          <i className="fa-solid fa-gear group-hover:rotate-90 transition-transform"></i>
          <span className="hidden sm:inline">Cấu hình AI</span>
        </button>
        
        <div className="h-12 w-12 rounded-2xl bg-green-100 border-2 border-white shadow-md flex items-center justify-center text-green-600 text-xl overflow-hidden group cursor-pointer hover:scale-110 transition-transform">
          <i className="fa-solid fa-earth-asia group-hover:globe-spin"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
