
import React, { useState } from 'react';
import { ExamSession } from '../types';

interface ResultViewProps {
  session: ExamSession;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ session, onBack }) => {
  const [showExplanations, setShowExplanations] = useState(false);
  
  const correctCount = session.questions.reduce((acc, q) => {
    return session.userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  
  const percentage = (correctCount / session.questions.length) * 100;
  
  const getBadge = () => {
    if (session.score >= 9) return { text: 'Xuất sắc!', color: 'text-yellow-500', icon: 'fa-trophy' };
    if (session.score >= 8) return { text: 'Giỏi!', color: 'text-green-500', icon: 'fa-medal' };
    if (session.score >= 6.5) return { text: 'Khá!', color: 'text-blue-500', icon: 'fa-award' };
    return { text: 'Cần cố gắng!', color: 'text-orange-500', icon: 'fa-book' };
  };

  const badge = getBadge();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      {/* Score Card */}
      <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 gradient-bg"></div>
        
        <div className={`text-6xl mb-4 ${badge.color}`}>
          <i className={`fa-solid ${badge.icon}`}></i>
        </div>
        
        <h2 className="text-3xl font-bold mb-1">{badge.text}</h2>
        <p className="text-slate-500 mb-8">{session.title}</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-slate-50 px-8 py-4 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Điểm số</p>
            <p className="text-4xl font-black text-blue-600">{session.score.toFixed(1)}</p>
          </div>
          <div className="bg-slate-50 px-8 py-4 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Câu đúng</p>
            <p className="text-4xl font-black text-slate-800">{correctCount}/{session.questions.length}</p>
          </div>
          <div className="bg-slate-50 px-8 py-4 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Thời gian</p>
            <p className="text-4xl font-black text-slate-800">{Math.floor(session.timeSpent / 60)}m</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setShowExplanations(!showExplanations)}
            className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
          >
            {showExplanations ? 'Ẩn lời giải' : 'Xem đáp án & lời giải'}
          </button>
          <button 
            onClick={onBack}
            className="px-8 py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity"
          >
            Về trang chủ
          </button>
        </div>
      </div>

      {/* Questions Review */}
      {showExplanations && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2">Chi tiết từng câu</h3>
          {session.questions.map((q, idx) => {
            const userAnswer = session.userAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={q.id} className={`bg-white p-6 rounded-2xl border ${isCorrect ? 'border-green-100' : 'border-red-100'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {idx + 1}
                  </span>
                  <span className={`text-xs font-bold uppercase ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? 'Chính xác' : 'Chưa đúng'}
                  </span>
                </div>
                
                <p className="font-medium text-slate-800 mb-4">{q.content}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                  {Object.entries(q.options).map(([key, val]) => (
                    <div 
                      key={key} 
                      className={`p-3 rounded-lg border flex items-center gap-3 ${
                        key === q.correctAnswer 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : key === userAnswer 
                            ? 'bg-red-50 border-red-200 text-red-700' 
                            : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >
                      <span className="font-bold">{key}.</span>
                      <span>{val}</span>
                      {key === q.correctAnswer && <i className="fa-solid fa-check ml-auto"></i>}
                      {key === userAnswer && key !== q.correctAnswer && <i className="fa-solid fa-xmark ml-auto"></i>}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl text-sm text-blue-800">
                  <p className="font-bold mb-1">💡 Lời giải chi tiết:</p>
                  <p className="leading-relaxed opacity-90">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultView;
