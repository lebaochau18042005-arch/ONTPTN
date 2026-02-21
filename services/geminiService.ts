
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Question, Difficulty } from "../types";

// Parse API errors into friendly Vietnamese messages
function parseApiError(err: any): string {
  const msg = err?.message || err?.toString() || '';

  // Quota exceeded / Rate limit
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('rate-limit')) {
    return 'Đã vượt quá giới hạn sử dụng API. Vui lòng đợi vài phút rồi thử lại, hoặc kiểm tra gói sử dụng tại Google AI Studio.';
  }
  // Invalid API Key
  if (msg.includes('401') || msg.includes('403') || msg.includes('PERMISSION_DENIED') || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
    return 'API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại trong phần Cài đặt.';
  }
  // Model not found
  if (msg.includes('404') || msg.includes('NOT_FOUND') || msg.includes('not found')) {
    return 'Model AI không tồn tại. Vui lòng chọn model khác trong phần Cài đặt.';
  }
  // Network error
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('ECONNREFUSED') || msg.includes('Failed to fetch')) {
    return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
  }
  // Server error
  if (msg.includes('500') || msg.includes('503') || msg.includes('INTERNAL')) {
    return 'Máy chủ AI đang gặp sự cố. Vui lòng thử lại sau vài phút.';
  }
  // Generic fallback — keep it short
  if (msg.length > 150) {
    return 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.';
  }
  return msg || 'Đã xảy ra lỗi không mong muốn.';
}

export class GeminiService {
  private getClient(): GoogleGenAI {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) throw new Error("Vui lòng cấu hình API Key trong phần Cài đặt.");
    return new GoogleGenAI({ apiKey });
  }

  private getModel(): string {
    return localStorage.getItem('gemini_model') || 'gemini-3-flash-preview';
  }

  async generateExam(topic: string, count: number, difficulty: Difficulty): Promise<Question[]> {
    const genAI = this.getClient();
    const model = this.getModel();

    const prompt = `Hãy tạo một danh sách gồm ${count} câu hỏi trắc nghiệm Địa lý THPT Việt Nam.
    Chủ đề: ${topic}
    Mức độ: ${difficulty}
    Cấu trúc mỗi câu hỏi phải bao gồm: nội dung câu hỏi, 4 phương án (A, B, C, D), đáp án đúng và lời giải thích chi tiết.
    Phải trả về dữ liệu dưới định dạng JSON mảng các object.`;

    let response: GenerateContentResponse;
    try {
      response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                options: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING },
                    B: { type: Type.STRING },
                    C: { type: Type.STRING },
                    D: { type: Type.STRING }
                  },
                  required: ["A", "B", "C", "D"]
                },
                correctAnswer: { type: Type.STRING, description: "A, B, C or D" },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["content", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError);
      throw new Error(parseApiError(apiError));
    }

    try {
      const rawText = typeof response.text === 'function' ? (response as any).text() : response.text;
      const data = JSON.parse(rawText || "[]");
      return data.map((q: any, index: number) => ({
        ...q,
        id: `ai-${Date.now()}-${index}`,
        topic,
        difficulty
      }));
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  }

  async askTutor(question: string): Promise<string> {
    const genAI = this.getClient();
    const model = this.getModel();

    let response: GenerateContentResponse;
    try {
      response = await genAI.models.generateContent({
        model,
        contents: `Bạn là một giáo viên Địa lý THPT giàu kinh nghiệm. Hãy trả lời câu hỏi sau của học sinh một cách dễ hiểu, chi tiết và có ví dụ minh họa nếu cần: ${question}`,
      });
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError);
      throw new Error(parseApiError(apiError));
    }

    const rawText = typeof response.text === 'function' ? (response as any).text() : response.text;
    return rawText || "Không có phản hồi từ AI.";
  }
}

export const geminiService = new GeminiService();
