import mongoose from "mongoose";

const topicContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicName: {
      type: String,
      required: true,
    },
    learningPathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    quiz: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TopicContent", topicContentSchema);
