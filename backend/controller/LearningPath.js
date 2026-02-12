import Groq from "groq-sdk";
import LearningPath from "../models/LearningPath.model.js";
import LearningPathCache from "../models/LeariningPathCache.model.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function extractJsonBlock(text) {
  if (!text) return null;

  const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (jsonMatch) return jsonMatch[0].trim();

  const fencedMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) return fencedMatch[1].trim();

  return null;
}

export const LearningPathGeneration = async (req, res) => {
  try {
    const { subject, level, duration } = req.body;

    const userId = req.user._id;
    const role = req.user.role;

    console.log("REQ.USER:", req.user);

    if (!subject || !level || !duration) {
      return res.status(400).json({
        error: "subject, level, and duration are required",
      });
    }

    /*  Prevent duplicate */
    const existingPath = await LearningPath.findOne({
      user: userId,
      subject,
      level,
      duration,
    });

    if (existingPath) {
      return res.status(400).json({
        error:
          "A learning path for this subject, level, and duration already exists.",
      });
    }

    /*  Declare roadmap OUTSIDE */
    let roadmap;

    /*  Check cache first */
    const cachedPath = await LearningPathCache.findOne({
      subject,
      level,
      duration,
    });

    if (cachedPath) {
      roadmap = cachedPath.roadmap; //  assign from cache
    } else {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer.",
          },
          {
            role: "user",
            content: `Generate a structured weekly roadmap for "${subject}" at level "${level}" and duration "${duration}". Return ONLY a JSON array with the format:
[
  {
    "topic_name": "subject",
    "weeks": [
      {
        "week_number": 1,
        "title": "Week title",
        "topics": ["topic1", "topic2", ...]
      },
      ...
    ]
  }
]`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.6,
      });

      const aiText = response.choices[0]?.message?.content || "";

      const jsonString = extractJsonBlock(aiText);

      if (!jsonString) {
        return res
          .status(500)
          .json({ error: "AI did not return valid JSON" });
      }

      try {
        roadmap = JSON.parse(jsonString); // ✅ store parsed JSON
      } catch (parseError) {
        return res.status(500).json({
          error: "Failed to parse JSON from AI response",
          details: parseError.message,
        });
      }

      /*  Save parsed roadmap to cache */
      await LearningPathCache.create({
        subject,
        level,
        duration,
        roadmap,
      });
    }

    /*  Save user-specific learning path */
    const savedPath = await LearningPath.create({
      user: userId,
      role,
      subject,
      level,
      duration,
      roadmap,
    });

    return res.status(201).json({
      message: "Learning path created",
      data: savedPath,
    });

  } catch (error) {
    console.error("LearningPathGeneration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
