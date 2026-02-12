import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model("StudentProfile", studentSchema);

