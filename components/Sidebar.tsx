
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: 'fa-house' },
    { id: 'exam-setup', label: 'Tạo đề thi mới', icon: 'fa-earth-asia' },
    { id: 'history', label: 'Lịch sử làm bài', icon: 'fa-clock-rotate-left' },
    { id: 'ai-tutor', label: 'Gia sư AI', icon: 'fa-robot' },
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId as ViewState);
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
        h-full bg-white border-r border-green-100 transition-all duration-300 flex flex-col cute-shadow z-40
        fixed md:relative
        sidebar-slide-in md:animate-none
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl shadow-lg shadow-green-200">
            <i className="fa-solid fa-earth-americas globe-spin"></i>
          </div>
          {isOpen && (
            <div>
              <h1 className="font-bold text-xl tracking-tight text-green-800">GeoTest AI</h1>
              <p className="text-[10px] uppercase font-bold text-green-400 tracking-widest">Học tập dễ thương</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${currentView === item.id
                      ? 'bg-green-50 text-green-700 font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-green-50/50 hover:text-green-600'
                    }`}
                >
                  <i className={`fa-solid ${item.icon} text-lg w-6 text-center`}></i>
                  {isOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-green-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center py-2 text-green-200 hover:text-green-500 transition-colors"
          >
            <i className={`fa-solid ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
