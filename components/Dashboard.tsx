
import React from 'react';
import { AppData, ExamSession } from '../types';
import { TOPICS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  data: AppData;
  onStart: () => void;
  onResume?: () => void;
  savedSession?: ExamSession | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onStart, onResume, savedSession }) => {
  const lastFiveSessions = data.sessions.slice(0, 5).reverse().map((s, i) => ({
    name: `Lần ${i + 1}`,
    score: s.score
  }));

  const COLORS = ['#a8e063', '#56ab2f', '#2ecc71', '#10b981', '#3498db'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome & Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[32px] border border-green-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <i className="fa-solid fa-earth-asia text-[120px] text-green-900 rotate-12"></i>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-green-800 mb-3">Chinh phục 9+ Địa Lý! 🌍</h2>
            <p className="text-slate-500 mb-8 max-w-sm">Bạn đã thực hiện {data.progress.totalAttempts} bài thi thử. Hãy cùng AI làm thêm thật nhiều đề nhé!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-2xl gradient-bg text-white font-black shadow-lg shadow-green-200 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus-circle"></i>
              Làm bài mới
            </button>
            {savedSession && onResume && (
              <button
                onClick={onResume}
                className="px-6 py-4 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-rotate-left"></i>
                Tiếp tục ngay
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-green-50 shadow-sm flex flex-col items-center justify-center text-center group hover:bg-green-50 transition-colors">
          <div className="text-green-400 mb-2 font-bold uppercase tracking-widest text-[10px]">Điểm Trung Bình</div>
          <div className="text-5xl font-black text-green-600 group-hover:scale-110 transition-transform">{data.progress.averageScore.toFixed(1)}</div>
          <div className="text-[10px] text-slate-400 mt-3 font-medium">Cố lên em nhé! ✨</div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-green-50 shadow-sm flex flex-col items-center justify-center text-center group hover:bg-orange-50 transition-colors">
          <div className="text-orange-400 mb-2 font-bold uppercase tracking-widest text-[10px]">Chuỗi Ngày Học</div>
          <div className="text-5xl font-black text-orange-500 group-hover:animate-bounce">{data.progress.streakDays}🔥</div>
          <div className="text-[10px] text-slate-400 mt-3 font-medium">Đừng để bị ngắt quãng!</div>
        </div>
      </section>

      {/* Unfinished Session Alert */}
      {savedSession && (
        <div className="bg-white border-2 border-dashed border-green-200 p-6 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              <i className="fa-solid fa-earth-asia globe-spin"></i>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-black text-green-800">Có một chuyến thám hiểm chưa xong!</p>
              <p className="text-sm text-green-500 font-medium">Chủ đề: {savedSession.title}</p>
            </div>
          </div>
          <button
            onClick={() => onResume?.()}
            className="px-10 py-3 rounded-full bg-green-600 text-white font-black hover:bg-green-700 shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Tiếp tục ngay thôi!
          </button>
        </div>
      )}

      {/* Topics Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <i className="fa-solid fa-map-location-dot text-green-500"></i>
            Hành trình khám phá
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TOPICS.map((topic) => (
            <div key={topic.id} className="bg-white p-6 rounded-[28px] border border-green-50 shadow-sm hover:border-green-300 hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-500 group-hover:text-white transition-all shadow-inner">
                <i className={`fa-solid ${topic.icon} text-2xl`}></i>
              </div>
              <h4 className="font-black text-slate-800 mb-2 group-hover:text-green-700 transition-colors">{topic.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">{topic.description}</p>
              <div className="pt-4 border-t border-green-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">{topic.questionsCount} Câu hỏi</span>
                <i className="fa-solid fa-arrow-right text-green-100 group-hover:text-green-500 transition-colors"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Chart */}
      <section className="bg-white p-8 rounded-[32px] border border-green-50 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <i className="fa-solid fa-chart-simple text-green-500"></i>
          Biểu đồ thăng tiến
        </h3>
        <div className="h-72">
          {lastFiveSessions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lastFiveSessions}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f0fff4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a8e063', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8e063', fontSize: 12, fontWeight: 'bold' }} domain={[0, 10]} />
                <Tooltip
                  cursor={{ fill: '#f0fff4' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', padding: '15px' }}
                />
                <Bar dataKey="score" radius={[12, 12, 12, 12]} barSize={35}>
                  {lastFiveSessions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-green-300 gap-4 italic font-medium">
              <i className="fa-solid fa-seedling text-4xl animate-pulse"></i>
              Hãy gieo mầm kiến thức bằng bài thi đầu tiên!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
