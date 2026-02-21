
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, AppData, ExamSession, Question, Difficulty, SubjectTopic } from './types';
import { TOPICS, SAMPLE_QUESTIONS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExamSetup from './components/ExamSetup';
import ExamSessionComponent from './components/ExamSession';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import AITutor from './components/AITutor';
import SettingsModal from './components/SettingsModal';

// FEAT-4: Calculate streak days from session dates
const calculateStreak = (sessions: ExamSession[]): number => {
  if (sessions.length === 0) return 0;

  // Get unique dates (YYYY-MM-DD) sorted descending
  const uniqueDates = [...new Set(
    sessions.map(s => new Date(s.date).toISOString().split('T')[0])
  )].sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Must have practiced today or yesterday to count streak
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// FEAT-5: Calculate weak topics based on accuracy per topic
const calculateWeakTopics = (sessions: ExamSession[]): string[] => {
  const topicStats: Record<string, { correct: number; total: number }> = {};

  sessions.forEach(session => {
    session.questions.forEach(q => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0 };
      }
      topicStats[q.topic].total++;
      if (session.userAnswers[q.id] === q.correctAnswer) {
        topicStats[q.topic].correct++;
      }
    });
  });

  // Topics with accuracy < 70% are considered weak
  return Object.entries(topicStats)
    .filter(([_, stats]) => stats.total >= 3 && (stats.correct / stats.total) < 0.7)
    .map(([topic]) => topic);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [appData, setAppData] = useState<AppData>({
    sessions: [],
    progress: {
      totalAttempts: 0,
      averageScore: 0,
      streakDays: 0,
      weakTopics: []
    }
  });

  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [savedSession, setSavedSession] = useState<ExamSession | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load data from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('geotest_app_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Recalculate streak and weak topics on load
        const streakDays = calculateStreak(parsed.sessions || []);
        const weakTopics = calculateWeakTopics(parsed.sessions || []);
        setAppData({
          ...parsed,
          progress: {
            ...parsed.progress,
            streakDays,
            weakTopics
          }
        });
      } catch (e) {
        console.error("Error parsing saved data");
      }
    }

    // Check for unfinished active session
    const unfinished = localStorage.getItem('geotest_active_session');
    if (unfinished) {
      try {
        setSavedSession(JSON.parse(unfinished));
      } catch (e) {
        console.error("Error parsing saved active session");
      }
    }

    // Check for API Key on first load
    if (!localStorage.getItem('gemini_api_key')) {
      setShowSettings(true);
    }

    // Close sidebar on mobile by default
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Save data to LocalStorage
  useEffect(() => {
    localStorage.setItem('geotest_app_data', JSON.stringify(appData));
  }, [appData]);

  const handleStartExam = (questions: Question[], title: string, totalTime: number) => {
    const newSession: ExamSession = {
      id: `session-${Date.now()}`,
      title,
      questions,
      userAnswers: {},
      score: 0,
      timeSpent: 0,
      totalTime,
      date: new Date().toISOString(),
      currentIdx: 0
    };
    setActiveSession(newSession);
    setCurrentView('exam-session');
    // Clear any existing saved session when a new one starts
    localStorage.removeItem('geotest_active_session');
    setSavedSession(null);
  };

  const handleResumeExam = () => {
    if (savedSession) {
      setActiveSession(savedSession);
      setCurrentView('exam-session');
    }
  };

  const handleFinishExam = (session: ExamSession) => {
    const correctCount = session.questions.reduce((acc, q) => {
      return session.userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
    }, 0);

    const score = (correctCount / session.questions.length) * 10;
    const finalSession = { ...session, score };

    const newSessions = [finalSession, ...appData.sessions];
    const totalScore = newSessions.reduce((acc, s) => acc + s.score, 0);

    // FEAT-4 & FEAT-5: Update streak and weak topics
    const streakDays = calculateStreak(newSessions);
    const weakTopics = calculateWeakTopics(newSessions);

    setAppData({
      ...appData,
      sessions: newSessions,
      progress: {
        totalAttempts: newSessions.length,
        averageScore: totalScore / newSessions.length,
        streakDays,
        weakTopics
      }
    });

    setActiveSession(finalSession);
    setCurrentView('result');

    // Clear saved active session on finish
    localStorage.removeItem('geotest_active_session');
    setSavedSession(null);
  };

  const handleCancelExam = () => {
    localStorage.removeItem('geotest_active_session');
    setSavedSession(null);
    setActiveSession(null);
    setCurrentView('dashboard');
  };

  // FEAT-2: Delete a history session
  const handleDeleteSession = (sessionId: string) => {
    const newSessions = appData.sessions.filter(s => s.id !== sessionId);
    const totalScore = newSessions.reduce((acc, s) => acc + s.score, 0);
    const streakDays = calculateStreak(newSessions);
    const weakTopics = calculateWeakTopics(newSessions);

    setAppData({
      ...appData,
      sessions: newSessions,
      progress: {
        totalAttempts: newSessions.length,
        averageScore: newSessions.length > 0 ? totalScore / newSessions.length : 0,
        streakDays,
        weakTopics
      }
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          toggleSettings={() => setShowSettings(true)}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'dashboard' && (
            <Dashboard
              data={appData}
              onStart={() => setCurrentView('exam-setup')}
              onResume={savedSession ? handleResumeExam : undefined}
              savedSession={savedSession}
            />
          )}

          {currentView === 'exam-setup' && (
            <ExamSetup onStart={handleStartExam} />
          )}

          {currentView === 'exam-session' && activeSession && (
            <ExamSessionComponent
              session={activeSession}
              onFinish={handleFinishExam}
              onCancel={handleCancelExam}
            />
          )}

          {currentView === 'result' && activeSession && (
            <ResultView
              session={activeSession}
              onBack={() => {
                setActiveSession(null);
                setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'history' && (
            <HistoryView
              sessions={appData.sessions}
              onViewResult={(session) => {
                setActiveSession(session);
                setCurrentView('result');
              }}
              onDelete={handleDeleteSession}
            />
          )}

          {currentView === 'ai-tutor' && <AITutor />}
        </main>
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default App;
