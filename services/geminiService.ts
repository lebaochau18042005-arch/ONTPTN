
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Question, Difficulty } from "../types";

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

    const response: GenerateContentResponse = await genAI.models.generateContent({
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

    const response = await genAI.models.generateContent({
      model,
      contents: `Bạn là một giáo viên Địa lý THPT giàu kinh nghiệm. Hãy trả lời câu hỏi sau của học sinh một cách dễ hiểu, chi tiết và có ví dụ minh họa nếu cần: ${question}`,
    });

    const rawText = typeof response.text === 'function' ? (response as any).text() : response.text;
    return rawText || "Không có phản hồi từ AI.";
  }
}

export const geminiService = new GeminiService();
