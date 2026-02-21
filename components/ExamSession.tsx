
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExamSession, Question } from '../types';

interface ExamSessionProps {
  session: ExamSession;
  onFinish: (session: ExamSession) => void;
  onCancel: () => void;
}

const ExamSessionComponent: React.FC<ExamSessionProps> = ({ session, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(session.currentIdx || 0);
  const [timeLeft, setTimeLeft] = useState(session.totalTime - (session.timeSpent || 0));
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(session.userAnswers || {});

  // Use refs to avoid stale closures in timer
  const userAnswersRef = useRef(userAnswers);
  const timeLeftRef = useRef(timeLeft);
  const currentIdxRef = useRef(currentIdx);

  useEffect(() => { userAnswersRef.current = userAnswers; }, [userAnswers]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);

  const handleFinishStable = useCallback(() => {
    onFinish({
      ...session,
      userAnswers: userAnswersRef.current,
      timeSpent: session.totalTime - timeLeftRef.current,
      currentIdx: currentIdxRef.current
    });
  }, [session, onFinish]);

  // Timer logic — uses stable ref-based finish
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishStable();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinishStable]);

  // Auto-save logic
  useEffect(() => {
    const sessionToSave: ExamSession = {
      ...session,
      userAnswers,
      timeSpent: session.totalTime - timeLeft,
      currentIdx
    };
    localStorage.setItem('geotest_active_session', JSON.stringify(sessionToSave));
  }, [userAnswers, timeLeft, currentIdx, session]);

  // FEAT-6: Keyboard shortcuts for exam navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentQuestion = session.questions[currentIdxRef.current];

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIdx(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIdx(prev => Math.min(session.questions.length - 1, prev + 1));
          break;
        case '1':
          handleAnswer(currentQuestion.id, 'A');
          break;
        case '2':
          handleAnswer(currentQuestion.id, 'B');
          break;
        case '3':
          handleAnswer(currentQuestion.id, 'C');
          break;
        case '4':
          handleAnswer(currentQuestion.id, 'D');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.questions]);

  const handleFinish = useCallback(() => {
    onFinish({
      ...session,
      userAnswers: userAnswersRef.current,
      timeSpent: session.totalTime - timeLeftRef.current,
      currentIdx: currentIdxRef.current
    });
  }, [session, onFinish]);

  // FEAT-1: Confirm before submitting
  const handleFinishWithConfirm = () => {
    const unanswered = session.questions.length - Object.keys(userAnswers).length;
    const message = unanswered > 0
      ? `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc muốn nộp bài không?`
      : 'Bạn có chắc muốn nộp bài không?';

    if (window.confirm(message)) {
      handleFinish();
    }
  };

  // FEAT-1: Confirm before canceling
  const handleCancelWithConfirm = () => {
    if (window.confirm('Bạn có chắc muốn hủy bỏ bài thi này? Dữ liệu sẽ không được lưu.')) {
      onCancel();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const currentQuestion = session.questions[currentIdx];
  const isLastQuestion = currentIdx === session.questions.length - 1;

  // Timer warning color
  const timerColor = timeLeft <= 60 ? 'text-red-400' : timeLeft <= 300 ? 'text-yellow-400' : 'text-white';

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 h-full">
      {/* Left: Question Content */}
      <div className="flex-1 space-y-6 overflow-y-auto pb-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
              Câu {currentIdx + 1} / {session.questions.length}
            </span>
            <span className="text-slate-400 text-xs font-medium">{currentQuestion.topic}</span>
          </div>

          <h3 className="text-xl font-medium leading-relaxed mb-8">
            {currentQuestion.content}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(currentQuestion.options).map(([key, value], optIdx) => (
              <button
                key={key}
                onClick={() => handleAnswer(currentQuestion.id, key as any)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${userAnswers[currentQuestion.id] === key
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-slate-100 hover:border-slate-200'
                  }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold border ${userAnswers[currentQuestion.id] === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-500 border-slate-200'
                  }`}>
                  {key}
                </span>
                <span className="pt-0.5 flex-1">{value}</span>
                <span className="text-[10px] text-slate-300 pt-1 font-mono">({optIdx + 1})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-6 py-3 rounded-xl border border-slate-200 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
            Câu trước
          </button>

          <button
            onClick={isLastQuestion ? handleFinishWithConfirm : () => setCurrentIdx(prev => prev + 1)}
            className={`px-8 py-3 rounded-xl text-white font-bold transition-all shadow-md flex items-center gap-2 ${isLastQuestion ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLastQuestion ? 'Nộp bài' : 'Câu kế tiếp'}
            {!isLastQuestion && <i className="fa-solid fa-chevron-right text-xs"></i>}
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-center text-[10px] text-slate-300 font-medium">
          <i className="fa-solid fa-keyboard mr-1"></i>
          Phím tắt: ← → chuyển câu • 1-4 chọn đáp án
        </div>
      </div>

      {/* Right: Sidebar / Controls */}
      <div className="w-full md:w-80 space-y-6">
        {/* Timer Card */}
        <div className="bg-slate-800 p-6 rounded-3xl text-white flex items-center justify-between shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase mb-1">Thời gian còn lại</p>
            <p className={`text-3xl font-mono font-bold tracking-widest transition-colors ${timerColor}`}>{formatTime(timeLeft)}</p>
          </div>
          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${timeLeft <= 60 ? 'border-red-500 animate-pulse' : 'border-slate-700'}`}>
            <i className="fa-solid fa-hourglass-half text-slate-400"></i>
          </div>
        </div>

        {/* Question Map */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold mb-4 flex items-center justify-between">
            Bản đồ câu hỏi
            <span className="text-xs text-slate-400 font-normal">{Object.keys(userAnswers).length} / {session.questions.length} đã chọn</span>
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {session.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${currentIdx === idx
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                  } ${userAnswers[q.id]
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleFinishWithConfirm}
              className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 hover:bg-green-100 transition-colors"
            >
              Hoàn thành & Nộp bài
            </button>
            <button
              onClick={handleCancelWithConfirm}
              className="w-full py-3 rounded-xl text-slate-400 text-sm font-medium hover:text-red-500 transition-colors"
            >
              Hủy bỏ lượt làm này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSessionComponent;
