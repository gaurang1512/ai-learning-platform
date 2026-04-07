import { useEffect, useState } from "react";
import { getMyLearningPaths } from "../../services/learningPathApi";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, ChevronRight, Library } from "lucide-react";

const MyLearningPaths = () => {
  const [paths, setPaths] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    const res = await getMyLearningPaths();
    setPaths(res.data);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 px-4 w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          My Learning Paths
        </h1>
        <p className="text-gray-500 text-base font-medium">
          Pick up where you left off or explore a new path.
        </p>
      </div>

      {/* Grid */}
      {paths.length > 0 ? (
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paths.map((path) => (
            <div
              key={path._id}
              onClick={() => navigate(`/app/my-learning-path/${path._id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-1 hover:border-blue-400 transition-all duration-200 group flex flex-col gap-4"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-12 bg-blue-600 rounded-full mb-1" />

              {/* Title + Level */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-extrabold capitalize text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {path.subject}
                </h2>
                <span className="shrink-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-blue-200">
                  {path.level}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-2 rounded-xl w-fit border border-blue-100">
                <Clock size={14} />
                {path.duration}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-blue-100 mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-400">
                  <BookOpen size={14} className="text-blue-400" />
                  {path.roadmap?.[0]?.weeks?.length || 0} Weeks Roadmap
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-sm shadow-blue-200 group-hover:translate-x-0.5 transition-all duration-200">
                  Continue
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Library size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-700 text-lg font-bold">
              No learning paths yet
            </p>
            <p className="text-gray-400 text-sm">
              Create your first AI-powered learning path to get started.
            </p>
          </div>
          <button
            onClick={() => navigate("/app/learning-path")}
            className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl font-bold shadow-md shadow-blue-200 transition-colors duration-200"
          >
            Generate Path
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLearningPaths;
