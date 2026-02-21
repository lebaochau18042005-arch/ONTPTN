
export enum Difficulty {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó',
  VERY_HARD = 'Rất khó'
}

export interface Question {
  id: string;
  topic: string;
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: Difficulty;
}

export interface ExamSession {
  id: string;
  title: string;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  timeSpent: number; // in seconds
  totalTime: number; // in seconds
  date: string;
  currentIdx?: number; // Track progress for resuming
}

export interface SubjectTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionsCount: number;
}

export interface AppData {
  sessions: ExamSession[];
  progress: {
    totalAttempts: number;
    averageScore: number;
    streakDays: number;
    weakTopics: string[]
  };
}

export type ViewState = 'dashboard' | 'exam-setup' | 'exam-session' | 'result' | 'history' | 'ai-tutor';
