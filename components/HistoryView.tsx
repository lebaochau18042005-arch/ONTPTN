
import React from 'react';
import { ExamSession } from '../types';

interface HistoryViewProps {
  sessions: ExamSession[];
  onViewResult: (session: ExamSession) => void;
  onDelete?: (sessionId: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ sessions, onViewResult, onDelete }) => {
  const handleDelete = (session: ExamSession) => {
    if (window.confirm(`Bạn có chắc muốn xóa đề "${session.title}" không?`)) {
      onDelete?.(session.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lịch sử làm bài</h2>
        <span className="text-slate-400 text-sm">{sessions.length} lượt đã hoàn thành</span>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-slate-200 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
            <i className="fa-solid fa-inbox text-4xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có dữ liệu</h3>
          <p className="text-slate-500">Bắt đầu làm bài để theo dõi tiến độ của bạn tại đây!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile: Card layout */}
          <div className="block md:hidden space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-slate-800 line-clamp-1 flex-1">{session.title}</p>
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ml-2 ${session.score >= 8 ? 'bg-green-100 text-green-700' :
                      session.score >= 5 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {session.score.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span>{session.questions.length} câu hỏi</span>
                  <span>{new Date(session.date).toLocaleDateString('vi-VN')}</span>
                  <span>{Math.floor(session.timeSpent / 60)} phút</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewResult(session)}
                    className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(session)}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Đề bài</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Điểm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ngày làm</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Thời gian</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 line-clamp-1">{session.title}</p>
                      <p className="text-xs text-slate-400">{session.questions.length} câu hỏi</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${session.score >= 8 ? 'bg-green-100 text-green-700' :
                          session.score >= 5 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {session.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(session.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {Math.floor(session.timeSpent / 60)} phút
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onViewResult(session)}
                          className="text-blue-600 font-bold text-sm hover:underline"
                        >
                          Xem chi tiết
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(session)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                            title="Xóa"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
