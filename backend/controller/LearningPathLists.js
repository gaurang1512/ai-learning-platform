import LearningPath from "../models/LearningPath.model.js";

export const getMyLearningPaths = async (req, res) => {
  try {
    const userId = req.user._id;

    const paths = await LearningPath.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(paths);

  } catch (error) {
    console.error("Error fetching learning paths:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
