import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema(
  {
    subject: String,
    level: String,
    duration: String,
    roadmap: Array,
  },
  { timestamps: true },
);

cacheSchema.index({ subject: 1, level: 1, duration: 1 }, { unique: true });

export default mongoose.model("LearningPathCache", cacheSchema);
