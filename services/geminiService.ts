
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSlideContent(topic: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `أنشئ محتوى إعلاني لبوستر تدريبي أو وظيفي عن موضوع: "${topic}".
    يجب أن يكون باللغة العربية الرسمية والاحترافية.
    أريد مخرجات بتنسيق JSON تحتوي على:
    - title: عنوان الإعلان (مثلاً: إعلان فرص تدريبية في...)
    - description: نص وصفي قصير (فقرة واحدة)
    - specializations: قائمة بـ 6 تخصصات مطلوبة (اسم التخصص فقط)
    - duration: مدة التدريب أو العقد (مثلاً: 6 أشهر)
    - incentives: المزايا المالية أو المهنية (مثلاً: مكافأة مالية شهرية)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          specializations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          duration: { type: Type.STRING },
          incentives: { type: Type.STRING }
        },
        required: ["title", "description", "specializations", "duration", "incentives"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateHeaderImage(prompt: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A professional Saudi workplace scene, high quality, realistic photography, diverse professional Saudi employees (man and woman) in office environment, clean, soft lighting, business attire. Context: ${prompt}` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
