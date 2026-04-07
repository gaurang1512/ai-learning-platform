import TopicContent from "../models/TopicContent.model.js";
import { generateTopicContent } from "../services/ai.service.js";

export const getTopicContent = async (req, res) => {
  try {
    const { topicName, learningPathId, level } = req.body;

    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id || req.user.id;

    if (!topicName || !learningPathId) {
      return res.status(400).json({ message: "topicName and learningPathId are required" });
    }

    // 1️⃣ Check if already exists
    const existing = await TopicContent.findOne({
      userId,
      topicName,
      learningPathId,
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // 2️⃣ Generate from AI
    const aiResult = await generateTopicContent(topicName, level);

    // 3️⃣ Save in DB
    const newContent = await TopicContent.create({
      userId,
      topicName,
      learningPathId,
      content: aiResult.explanation,
      quiz: aiResult.quiz,
    });

    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
