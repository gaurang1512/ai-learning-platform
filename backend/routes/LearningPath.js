import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  LearningPathGeneration
} from "../controller/LearningPath.js";
import {
  markWeekCompleted
} from "../controller/LearningPathProgress.js";
import {
  getMyLearningPaths
} from "../controller/LearningPathLists.js";
import { getTopicContent } from "../controller/topicContent.js";

const router = express.Router();

router.post("/learning-path", isAuth, LearningPathGeneration);
router.get("/my-paths", isAuth, getMyLearningPaths);
router.post("/learning-path/complete-week", isAuth, markWeekCompleted);
router.post("/generate", isAuth, getTopicContent);

export default router;
