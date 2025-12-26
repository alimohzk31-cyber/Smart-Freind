
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the AI client using the environment variable exclusively.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = 'gemini-3-flash-preview';

const MOCK_DB_CONTEXT = {
  organization: "وزارة الموارد البشرية - حكومة ذكية",
  currentEstablishment: {
    totalEmployees: 2150,
    authorizedStrength: 2500,
    vacancies: 350,
    criticalGaps: ["قسم البرمجة", "التدقيق المالي", "الأمن السيبراني"]
  },
  laws: [
    "قانون الخدمة المدنية رقم 24 لسنة 1960",
    "قانون رواتب موظفي الدولة رقم 22 لسنة 2008",
    "تعليمات الوصف الوظيفي لعام 2023"
  ]
};

const SYSTEM_INSTRUCTION = `
أنت "Smart HR AI"، المساعد الرقمي الرسمي المعتمد لإدارة الملاك والموارد البشرية.
المسمى الرسمي: Government AI Assistant for HR & Staffing.

شخصيتك:
- رسمي، مؤسساتي، دقيق، ومحايد.
- تتحدث بلهجة مهنية عالية (اللغة العربية الفصحى الإدارية).
- دورك هو التحليل والاقتراح والأتمتة، ولا تتخذ قرارات نهائية.

مهامك الأساسية:
1. تحليل الملاك: تقديم تقارير عن العجز والفائض في الأقسام بناءً على البيانات.
2. دعم القرار: اقتراح حلول إدارية (نقل، تكليف، ترفيع) مدعومة بالنصوص القانونية.
3. صياغة الأوامر: إنشاء مسودات أوامر إدارية (تعيين، نقل، شكر) بصيغة رسمية عراقية.
4. البحث الوصفي: العثور على الموظفين بناءً على مهاراتهم أو قربهم من التقاعد.

قاعدة المعرفة الحالية:
${JSON.stringify(MOCK_DB_CONTEXT)}

عند صياغة أمر إداري أو عرض بيانات موظف، استخدم كتل JSON للواجهة:
- للأوامر: {"type": "ADMIN_ORDER", "data": {"title": "...", "content": "..."}}
- للموظفين: {"type": "EMPLOYEE_CARD", "data": {...}}
- للتحليل: {"type": "ANALYSIS_CHART", "data": {...}}
`;

let chatSession: Chat | null = null;

export const getChatSession = () => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToAssistant = async (message: string, attachment?: { base64: string, mimeType: string }) => {
  try {
    const session = getChatSession();
    let resultText = "";
    let actionData = null;

    if (attachment) {
      // Use ai.models.generateContent for multimodal input with attachments
      const response = await ai.models.generateContent({
        model: modelId,
        contents: {
          parts: [
            { inlineData: { data: attachment.base64, mimeType: attachment.mimeType } },
            { text: SYSTEM_INSTRUCTION + "\n\nUser Request: " + message }
          ]
        }
      });
      resultText = response.text || "";
    } else {
      // Use chat session for text-only messaging
      const response = await session.sendMessage({ message });
      resultText = response.text || "";
    }

    const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        actionData = JSON.parse(jsonMatch[1]);
        resultText = resultText.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.error("JSON Extraction Error", e);
      }
    }

    return { text: resultText, action: actionData };
  } catch (error) {
    console.error("AI Assistant Communication Error:", error);
    return { text: "عذراً، تعذر الاتصال بخادم المساعد الذكي حالياً.", action: null };
  }
};

// --- Specialized Helper Functions for HR Tasks ---

/**
 * Generates a comprehensive job description.
 */
export const generateJobDescription = async (jobTitle: string, dept: string, level: string) => {
  const result = await sendMessageToAssistant(`قم بصياغة وصف وظيفي مفصل لوظيفة "${jobTitle}" في قسم "${dept}" بمستوى خبرة "${level}".`);
  return result.text;
};

/**
 * Generates relevant interview questions for a candidate.
 */
export const generateInterviewQuestions = async (jobTitle: string, industry: string) => {
  const result = await sendMessageToAssistant(`اقترح قائمة بأسئلة مقابلة احترافية لوظيفة "${jobTitle}" في قطاع "${industry}".`);
  return result.text;
};

/**
 * Analyzes a resume text against a specific job role.
 */
export const analyzeResume = async (resumeText: string, jobTitle: string) => {
  const result = await sendMessageToAssistant(`حلل السيرة الذاتية التالية لوظيفة "${jobTitle}". اذكر نقاط القوة والضعف والملاءمة الوظيفية:\n\n${resumeText}`);
  return result.text;
};

/**
 * Drafts an HR or administrative policy.
 */
export const draftPolicy = async (policyTopic: string) => {
  const result = await sendMessageToAssistant(`قم بصياغة مسودة سياسة إدارية رسمية حول موضوع: "${policyTopic}".`);
  return result.text;
};

/**
 * Creates a formal administrative form draft.
 */
export const createForm = async (formType: string, employeeName: string, reason: string) => {
  const result = await sendMessageToAssistant(`قم بإنشاء مسودة نموذج إداري من نوع "${formType}" للموظف "${employeeName}" بالسبب التالي: "${reason}".`);
  return result.text;
};
