import OpenAI from "openai";
import { ENV } from "../config/env.js";
import { CustomError } from "../utils/CustomError.js";

const MODEL = "llama-3.1-8b-instant";
let clientInstance = null;

function getClient() {
  if (!clientInstance) {
    if (!ENV.GROQ_API_KEY) {
      throw new CustomError("GROQ_API_KEY is not configured", 500);
    }
    clientInstance = new OpenAI({ 
      apiKey: ENV.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }
  return clientInstance;
}

export async function generateQuestions(role, techStack, experience) {
  const client = getClient();
    const prompt = `You are a senior technical interviewer.
Generate exactly 5 interview questions for a ${role} candidate with ${experience} year(s) of experience in ${techStack}.

Requirements:
- Mix of conceptual, practical, and problem-solving questions
- Difficulty should match the experience level
- Questions should be specific to the tech stack provided
- Each question should be concise (1-3 sentences)

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  { "order": 1, "text": "question text here" },
  { "order": 2, "text": "question text here" },
  { "order": 3, "text": "question text here" },
  { "order": 4, "text": "question text here" },
  { "order": 5, "text": "question text here" }
]`;

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);

      // Handle both { questions: [...] } and direct array wrapped in any key
      const arr =
        Array.isArray(parsed) ? parsed : Object.values(parsed).find(Array.isArray) || [];

      if (!arr.length) {
        throw new CustomError("AI returned no questions", 500);
      }

      return arr.slice(0, 5).map((q, i) => ({
        text: q.text,
        order: q.order ?? i + 1,
      }));
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("AIService.generateQuestions error:", error);
      throw new CustomError("Failed to generate interview questions", 500);
    }
  }

export async function generateFeedback(question, userAnswer) {
  const client = getClient();
    const prompt = `You are a strict but fair technical interviewer evaluating a candidate's answer.

Question: ${question}

Candidate's Answer: ${userAnswer || "(No answer provided)"}

Evaluate the answer and return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "correctAnswer": "A comprehensive model answer to the question",
  "rating": <integer from 1 to 10>,
  "feedback": "2-3 sentences of specific, constructive feedback explaining the rating"
}

Rating scale: 1-3 = poor, 4-5 = basic, 6-7 = good, 8-9 = excellent, 10 = perfect`;

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);

      return {
        correctAnswer: parsed.correctAnswer || "",
        rating: Math.min(10, Math.max(1, Number(parsed.rating) || 5)),
        feedback: parsed.feedback || "",
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      console.error("AIService.generateFeedback error:", error);
      throw new CustomError("Failed to generate feedback", 500);
    }
  }
