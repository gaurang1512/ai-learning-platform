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
    <div className=" bg-[#eef2f7] flex flex-col items-center justify-center px-6 py-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
          ✨ Learning Path Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Create personalized learning paths powered by AI
        </p>
      </div>

      {/* Main Card */}
      <div className=" bg-white rounded-3xl p-10 pad-10 shadow-md border border-gray-200 gap-5">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 pad-3">
            Generate Your Learning Path
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your preferences and we'll create a personalized learning path
            for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic */}
          <div className="pad-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              placeholder="e.g., React, Python, Machine Learning"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Level */}
          <div className="pad-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div className="pad-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g., 4 weeks, 2 months, 30 days"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Learning Path"}
          </button>
        </form>
      </div>

      <div>
        {/* Generated Result */}
        {generatedPath && (
          <div className="pad-6 w-full max-w-4xl rounded-3xl mt-16 space-y-8 shadow-md border border-gray-200">
            {/* Header */}
            <div className="pad-3 bg-white p-8 shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                {generatedPath.subject} Roadmap
              </h3>
              <p className="text-gray-600">
                A {generatedPath.level} level roadmap designed to master{" "}
                {generatedPath.subject} in {generatedPath.duration}.
              </p>
            </div>

            {/* Modules */}
            <div className="pad-6 bg-white p-8 shadow-md border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Learning Modules
              </h4>

              <div className="space-y-6 pad-3">
                {generatedPath.roadmap?.[0]?.weeks?.map((week, index) => (
                  <div
                    key={week.week_number}
                    className="pad-3 bg-gray-50 rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="pad-3 flex justify-between items-center mb-4">
                      <h5 className="font-semibold text-gray-900">
                        Week {week.week_number}: {week.title}
                      </h5>
                      <span className="text-sm text-gray-500">
                        Module {index + 1}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {week.topics.map((topic, i) => (
                        <div
                          key={i}
                          className="pad-3 bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700"
                        >
                          • {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPathGenerator;
