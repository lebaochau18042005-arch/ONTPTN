
import { SubjectTopic, Difficulty, Question } from './types';

export const TOPICS: SubjectTopic[] = [
  { id: 'tu-nhien', name: 'Địa lý Tự nhiên Việt Nam', icon: 'fa-mountain-sun', description: 'Địa hình, khí hậu, sông ngòi, đất đai...', questionsCount: 120 },
  { id: 'dan-cu', name: 'Địa lý Dân cư', icon: 'fa-users', description: 'Dân số, phân bố dân cư, đô thị hóa...', questionsCount: 85 },
  { id: 'nganh-kt', name: 'Địa lý các ngành Kinh tế', icon: 'fa-chart-line', description: 'Nông nghiệp, Công nghiệp, Dịch vụ...', questionsCount: 150 },
  { id: 'vung-kt', name: 'Địa lý các Vùng Kinh tế', icon: 'fa-map-location-dot', description: '7 vùng kinh tế trọng điểm của VN...', questionsCount: 200 },
  { id: 'atlat', name: 'Kỹ năng Atlat', icon: 'fa-book-open', description: 'Kỹ năng đọc bản đồ và phân tích Atlat...', questionsCount: 300 },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    topic: 'tu-nhien',
    content: 'Căn cứ vào Atlat Địa lí Việt Nam trang 9, cho biết trạm khí tượng nào sau đây có lượng mưa trung bình năm cao nhất?',
    options: {
      A: 'Hà Nội',
      B: 'Huế',
      C: 'TP. Hồ Chí Minh',
      D: 'Đà Lạt'
    },
    correctAnswer: 'B',
    explanation: 'Dựa vào biểu đồ lượng mưa tại Atlat trang 9, Huế nằm trong vùng có lượng mưa cực đại do tác động của bức chắn địa hình và các khối khí ẩm.',
    difficulty: Difficulty.EASY
  },
  {
    id: '2',
    topic: 'nganh-kt',
    content: 'Nguyên nhân chính làm cho ngành chăn nuôi nước ta hiện nay phát triển mạnh theo hướng sản xuất hàng hóa là?',
    options: {
      A: 'Thị trường tiêu thụ rộng lớn, dịch vụ thú y đảm bảo.',
      B: 'Nguồn thức ăn phong phú, cơ sở hạ tầng phát triển.',
      C: 'Thị trường mở rộng, nhu cầu tiêu dùng ngày càng cao.',
      D: 'Các giống gia súc gia cầm có năng suất cao hơn trước.'
    },
    correctAnswer: 'C',
    explanation: 'Sản xuất hàng hóa luôn gắn liền với thị trường. Nhu cầu thị trường tăng là động lực chính thúc đẩy quy mô sản xuất.',
    difficulty: Difficulty.MEDIUM
  }
];

export const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Nhanh)' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Thông minh)' },
  { id: 'gemini-2.5-flash-lite-latest', name: 'Gemini 2.5 Flash Lite' }
];
