import LearningPath from "../models/LearningPath.model.js";

export const markWeekCompleted = async (req, res) => {
  const { pathId, weekNumber } = req.body;
  const userId = req.user.id;

  const path = await LearningPath.findOne({
    _id: pathId,
    user: userId
  });

  if (!path) {
    return res.status(404).json({ error: "Learning path not found" });
  }

  path.roadmap[0].weeks.forEach((week) => {
    if (week.week_number === weekNumber) {
      week.completed = true;
    }
  });

  /* Auto mark course completed */
  const allCompleted = path.roadmap[0].weeks.every(
    (week) => week.completed
  );

  if (allCompleted) {
    path.status = "completed";
  }

  await path.save();

  res.json({ message: "Week marked as completed", path });
};

