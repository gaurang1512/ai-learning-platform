import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
  week_number: Number,
  title: String,
  topics: [String],
  completed: {
    type: Boolean,
    default: false,
  },
});

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    roadmap: [
      {
        topic_name: String,
        weeks: [weekSchema],
      },
    ],
  },
  { timestamps: true },
);

/* 🔥 Prevent duplicate learning paths per user */
learningPathSchema.index(
  { user: 1, subject: 1, level: 1, duration: 1 },
  { unique: true },
);

export default mongoose.model("LearningPath", learningPathSchema);
