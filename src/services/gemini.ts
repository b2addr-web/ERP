import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export const analyzeData = async (data: any, query: string) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    أنت محلل بيانات ذكي (AI ERP Assistant) يعمل ضمن نظام ERP.
    مهمتك هي تحليل البيانات المالية، المبيعات، والمشتريات المقدمة لك.
    قدم رؤى (Insights) واضحة وتوقعات (Forecasts) مبنية على البيانات.
    اجعل إجاباتك مختصرة، احترافية، وباللغة العربية.
    استخدم التنسيق المناسب (Markdown) لإبراز الأرقام والنقاط الهامة.
    تحدث كخبير مالي وإداري.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: `البيانات المتوفرة: ${JSON.stringify(data)}` }] },
        { role: 'user', parts: [{ text: `سؤال المستخدم أو طلب التحليل: ${query}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "عذراً، حدث خطأ أثناء تحليل البيانات. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
