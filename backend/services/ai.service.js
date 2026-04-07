import Groq from "groq-sdk";

// Initialize client lazily to avoid errors during import in test environments
let groq;

const getGroqClient = () => {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey && process.env.NODE_ENV === 'production') {
      throw new Error("GROQ_API_KEY is missing");
    }
    groq = new Groq({
      apiKey: apiKey || "dummy-key-for-testing",
    });
  }
  return groq;
};

const extractJson = (text) => {
  if (!text) return null;
  
  // Try to find JSON in code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {
      // Fall through if parsing failed
    }
  }

  // Try to find the first { and last } and parse everything in between
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const jsonStr = text.substring(start, end + 1);
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      // Fall through
    }
  }

  // Last resort: try to parse the whole string
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

export const generateTopicContent = async (topicName, level) => {
  if (!topicName || !level) {
    console.error("AI Generation Error: Missing topicName or level", { topicName, level });
    throw new Error("topicName and level required");
  }

  console.log(`AI Service: Generating content for topic: "${topicName}", level: "${level}"`);

  // Try different models in order of preference
  const models = ["llama-3.3-70b-versatile", "llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`AI Service: Attempting generation with model: ${model}`);
      const client = getGroqClient();
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert programming instructor. You provide high-quality educational content and assessments in JSON format. You MUST return ONLY a valid JSON object."
          },
          {
            role: "user",
            content: `
Generate a comprehensive study guide and a 10-question MCQ quiz for the topic "${topicName}" at a ${level} level.

The output MUST be a valid JSON object with the following structure:
{
  "explanation": "Detailed markdown explanation including code examples, analogies, and common mistakes",
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Ensure exactly 10 questions are generated in the quiz array. Return ONLY the JSON object.
`
          }
        ],
        temperature: 0.5,
        max_tokens: 3500,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        console.warn(`AI Service: Empty content returned from model ${model}`);
        continue;
      }

      console.log(`AI Service: Received response from ${model}, attempting to parse JSON...`);

      const result = extractJson(content);
      
      if (result && result.explanation && Array.isArray(result.quiz)) {
        console.log(`AI Service: Successfully generated and parsed content with ${result.quiz.length} questions using ${model}`);
        return result;
      } else {
        console.warn(`AI Service: Model ${model} returned invalid JSON structure or was unparseable`);
        continue;
      }

    } catch (error) {
      console.warn(`AI Service: Error with model ${model}:`, error.message);
      lastError = error;
      
      // If it's an authentication error, don't bother trying other models
      if (error.status === 401) break;
    }
  }

  // If we get here, all models failed
  console.error("AI Generation Error: All models failed", {
    lastError: lastError?.message,
    topicName,
    level
  });

  if (lastError?.status === 401) {
    throw new Error("AI Service authentication failed. Please check API configuration.");
  }
  
  throw new Error(`Failed to generate content and quiz after multiple attempts: ${lastError?.message || "Unknown error"}`);
};
