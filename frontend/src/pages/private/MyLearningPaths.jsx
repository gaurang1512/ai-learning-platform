import { useEffect, useState } from "react";
import { getMyLearningPaths } from "../../services/learningPathApi";
import { useNavigate } from "react-router-dom";
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
    <div className="w-full px-10 py-10">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        My Learning Paths
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path._id}
            onClick={() => navigate(`/app/my-learning-path/${path._id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold capitalize">
                {path.subject}
              </h2>
              <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full">
                {path.level}
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Duration: {path.duration}
            </p>

            <div className="text-sm text-gray-600">
              {path.roadmap?.[0]?.weeks?.length} Weeks
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLearningPaths;
