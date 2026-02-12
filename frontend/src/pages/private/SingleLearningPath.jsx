import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyLearningPaths } from "../../services/learningPathApi";
import { useNavigate } from "react-router-dom";

const SingleLearningPath = () => {
  const { id } = useParams();
  const [path, setPath] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    const res = await getMyLearningPaths();
    const selected = res.data.find((p) => p._id === id);
    setPath(selected);
  };

  if (!path) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <button
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-md transition duration-200 shadow-sm"
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/dashboard")
        }
      >
        ← Back
      </button>{" "}
      <div className="bg-white rounded-2xl shadow-md p-8 border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold capitalize">
            {path.subject} Learning Path
          </h1>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
            {path.level}
          </span>
        </div>

        <p className="text-gray-500 mt-2">Duration: {path.duration}</p>
      </div>
      {path.roadmap?.[0]?.weeks?.map((week) => (
        <div
          key={week.week_number}
          className="bg-white rounded-2xl shadow-sm border p-6"
        >
          <h3 className="font-semibold mb-3">
            Week {week.week_number}: {week.title}
          </h3>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {week.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SingleLearningPath;
