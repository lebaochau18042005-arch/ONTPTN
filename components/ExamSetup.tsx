
import React, { useState } from 'react';
import { Difficulty, Question } from '../types';
import { TOPICS, SAMPLE_QUESTIONS } from '../constants';
import { geminiService } from '../services/geminiService';

interface ExamSetupProps {
  onStart: (questions: Question[], title: string, totalTime: number) => void;
}

const ExamSetup: React.FC<ExamSetupProps> = ({ onStart }) => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [questionCount, setQuestionCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const topicName = TOPICS.find(t => t.id === selectedTopic)?.name || "Địa Lý";
      const questions = await geminiService.generateExam(topicName, questionCount, difficulty);

      if (questions.length === 0) {
        throw new Error("Không thể tạo câu hỏi. Hãy kiểm tra API Key.");
      }

      const totalTime = Math.ceil(questionCount * 1.25 * 60);
      onStart(questions, `Đề ôn tập: ${topicName}`, totalTime);
    } catch (err: any) {
      let errorMsg = err.message || "Đã xảy ra lỗi không mong muốn.";
      // Safety: if error message looks like raw JSON or is too long, use generic message
      if (errorMsg.length > 200 || errorMsg.startsWith('{') || errorMsg.startsWith('[')) {
        errorMsg = "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
      }
      if (localStorage.getItem('gemini_api_key') === null) {
        errorMsg = "Vui lòng cấu hình API Key trong phần Cài đặt.";
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white p-10 rounded-[40px] border border-green-100 shadow-xl shadow-green-100/50">
        <h2 className="text-3xl font-black text-green-800 mb-3 flex items-center gap-3">
          <i className="fa-solid fa-earth-asia text-green-500 globe-spin"></i>
          Soạn Đề Thú Vị
        </h2>
        <p className="text-slate-400 mb-10 font-medium">AI sẽ đóng vai giáo viên dễ tính để giúp em ôn luyện tốt nhất!</p>

        <div className="space-y-10">
          {/* Topic Select */}
          <div>
            <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-4 ml-2">Khu vực thám hiểm</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-6 py-4 rounded-[24px] border-2 transition-all text-left flex items-center gap-4 ${selectedTopic === topic.id
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-lg shadow-green-100 ring-4 ring-green-100/50'
                      : 'border-slate-50 hover:border-green-200 text-slate-500 bg-slate-50/50'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedTopic === topic.id ? 'bg-green-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                    <i className={`fa-solid ${topic.icon}`}></i>
                  </div>
                  <span className="font-bold text-sm leading-tight">{topic.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-4 ml-2">Độ khó thử thách</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Difficulty).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-3 px-4 rounded-2xl border-2 transition-all font-bold text-sm ${difficulty === d
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-slate-50 text-slate-400 hover:border-green-100'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-4 ml-2">Số lượng bảo vật (câu hỏi)</label>
              <div className="flex gap-3">
                {[10, 20, 40].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-4 rounded-[20px] border-2 transition-all font-black ${questionCount === num
                        ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200'
                        : 'border-slate-50 text-slate-400 bg-slate-50/50 hover:bg-white hover:border-green-100'
                      }`}
                  >
                    {num} <span className="text-[10px] block opacity-80 uppercase">Câu</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-50 border-2 border-dashed border-red-200 text-red-600 rounded-3xl text-sm flex items-center gap-4 animate-bounce">
              <i className="fa-solid fa-face-sad-tear text-2xl"></i>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-5 rounded-[24px] gradient-bg text-white font-black text-lg shadow-xl shadow-green-300 flex items-center justify-center gap-4 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-[1.02] active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-earth-asia fa-spin text-2xl"></i>
                Đang vẽ bản đồ câu hỏi...
              </>
            ) : (
              <>
                <i className="fa-solid fa-flag-checkered text-xl"></i>
                Bắt Đầu Khám Phá Ngay!
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-green-100 flex gap-6 items-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-50 flex-shrink-0 flex items-center justify-center text-green-500 text-3xl shadow-inner">
          <i className="fa-solid fa-leaf"></i>
        </div>
        <div>
          <h4 className="font-black text-green-800 text-lg">Góc nhỏ thông thái</h4>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Hãy mang theo Atlat - bảo bối thần kì không thể thiếu cho các nhà địa lí học tương lai nhé! 🗺️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
