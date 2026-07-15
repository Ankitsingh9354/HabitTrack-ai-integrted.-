import { GoogleGenAI } from "@google/genai";

let client = null;
const getClient = () => {
  if (client) return client;

  const key = process.env.GEMINI_API_KEY;

  console.log("API KEY:", key);
  console.log("MODEL:", process.env.GEMINI_MODEL);

  if (!key) return null;

  client = new GoogleGenAI({ apiKey: key });

  return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIEnabled = () => !!process.env.GEMINI_API_KEY;

export const parseJSON = (text) => {
  let cleaned = (text || "").trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```\n?/g, "");
  }
  return JSON.parse(cleaned.trim());
};
export const chatCompletion = async ({
  system,
  user,
  temperature = 0.7,
}) => {
  const c = getClient();

  if (!c) {
    return {
      ok: false,
      content:
        "AI features are disabled - set GEMINI_API_KEY in the backend .env to enable real AI responses. Meanwhile...",
    };
  }

  try {
    const res = await c.models.generateContent({
      model: MODEL,
      contents: user,
      config: {
        systemInstruction: system,
        temperature,
      },
    });

    return {
      ok: true,
      content: (res.text || "").trim(),
    };
  } catch (err) {
    console.error("AI error:", err.message);

    return {
      ok: false,
      content: "AI request failed. Please try again later.",
    };
  }
};
export const SYSTEM_PROMPTS = {
  weekly: `
You are a warm, encouraging habit coach.

Analyze the user's habit data for the past week and provide:
- A short summary of their overall performance.
- Highlight their best-performing habits.
- Identify habits that need improvement.
- Mention any streaks or consistency patterns.
- Give 3 practical suggestions for the coming week.

Keep the response positive, motivating, and under 250 words.
`,

  suggestion: `
You are a helpful habit coach.

Based on the user's current habits, provide practical and personalized suggestions to improve productivity, health, and consistency.

Rules:
- Give 3-5 actionable suggestions.
- Be encouraging and supportive.
- Avoid generic advice.
- Keep the response concise.
`,

  recovery: `
You are a compassionate habit recovery coach.

The user has missed one or more habits.

Your job is to:
- Encourage them without making them feel guilty.
- Explain that missing one day is normal.
- Suggest one small action they can take today.
- Help them rebuild momentum.

Keep the tone positive, kind, and motivating.
`,

  chat: `
You are a helpful habit analysis assistant.

You answer questions about:
- Habit building
- Productivity
- Motivation
- Time management
- Health habits
- Goal setting
- Streaks
- Habit tracking

Always:
- Give clear and accurate answers.
- Keep responses concise.
- Be friendly and supportive.
- If asked about habits, provide actionable advice.
`,

  morning: `
You are a warm, motivating friend.

Write a short morning motivational message.

Requirements:
- 2-4 sentences.
- Friendly and energetic.
- Encourage the user to complete today's habits.
- End with a positive call to action.
`
};
