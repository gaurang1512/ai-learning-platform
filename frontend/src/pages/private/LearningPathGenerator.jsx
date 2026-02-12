import { useState } from "react";
import { generateLearningPath } from "../../services/learningPathApi";

const LearningPathGenerator = () => {
  const [form, setForm] = useState({
    subject: "",
    level: "Beginner",
    duration: "4 Weeks",
  });

  const [generatedPath, setGeneratedPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await generateLearningPath(form);
      setGeneratedPath(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error generating path");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">

    <div className=" bg-[#cfd6e6] py-16 px-4 flex flex-col items-center">

      {/* Page Header */}
      <h1 className="text-4xl font-bold text-indigo-600 mb-2">
        ✨ Learning Path Generator
      </h1>
      <p className="text-gray-600 mb-10">
        Create personalized learning paths powered by AI
      </p>

      {/* FORM CARD */}
      <div className="w-full max-w-2xl bg-gray-100 border border-gray-200 rounded-2xl p-8 shadow-sm">

        <h2 className="text-lg font-semibold mb-1">
          Generate Your Learning Path
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your preferences and we'll create a personalized learning path for you
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Subject */}
          <div>
            <label className="block font-medium mb-2">Topic</label>
            <input
              type="text"
              placeholder="e.g., React, Python, Machine Learning"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block font-medium mb-2">Level</label>
            <select
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-medium mb-2">Duration</label>
            <input
              type="text"
              placeholder="e.g., 4 weeks, 2 months"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            {loading ? "Generating..." : "Generate Learning Path"}
          </button>

        </form>
      </div>

      {/* RESULT SECTION */}
      {generatedPath && (
        <div className="w-full max-w-3xl mt-12 space-y-6">

          {/* Header Card */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {generatedPath.subject} Learning Path
                </h3>
                <p className="text-gray-600">
                  A comprehensive {generatedPath.level} level learning path designed to help you master {generatedPath.subject}.
                </p>
              </div>

              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm capitalize">
                {generatedPath.level}
              </span>
            </div>
          </div>

          {/* Modules Card */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-1">
              Learning Modules
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              Follow these modules in order to complete your learning path
            </p>

            {generatedPath.roadmap?.[0]?.weeks?.map((week, index) => (
              <div
                key={week.week_number}
                className="border-t border-gray-200 py-4 first:border-none"
              >
                <div className="flex items-center gap-3">
                  <span className="border px-3 py-1 rounded-full text-xs">
                    Module {index + 1}
                  </span>

                  <h5 className="font-medium">
                    {week.title}
                  </h5>

                  <span className="ml-auto text-sm text-gray-500">
                    Week {week.week_number}
                  </span>
                </div>

                <ul className="mt-3 ml-6 list-disc text-sm space-y-1">
                  {week.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Save Button */}
            <button className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
              Save Learning Path
            </button>

          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default LearningPathGenerator;
