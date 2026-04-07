import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyLearningPaths } from "../../services/learningPathApi";
import { ArrowLeft, Clock, BookOpen, ChevronRight, Layers } from "lucide-react";

const weekColors = [
  {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    hover: "hover:border-blue-400 hover:shadow-blue-100",
    badge: "bg-blue-600",
    dot: "bg-blue-400 group-hover:bg-blue-600",
    topic:
      "from-white to-blue-50/80 border-blue-100 hover:border-blue-300 hover:shadow-blue-100",
    chevron: "group-hover:text-blue-500",
  },
  {
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    hover: "hover:border-violet-400 hover:shadow-violet-100",
    badge: "bg-violet-600",
    dot: "bg-violet-400 group-hover:bg-violet-600",
    topic:
      "from-white to-violet-50/80 border-violet-100 hover:border-violet-300 hover:shadow-violet-100",
    chevron: "group-hover:text-violet-500",
  },
  {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    hover: "hover:border-emerald-400 hover:shadow-emerald-100",
    badge: "bg-emerald-600",
    dot: "bg-emerald-400 group-hover:bg-emerald-600",
    topic:
      "from-white to-emerald-50/80 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100",
    chevron: "group-hover:text-emerald-500",
  },
  {
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    hover: "hover:border-orange-400 hover:shadow-orange-100",
    badge: "bg-orange-500",
    dot: "bg-orange-400 group-hover:bg-orange-600",
    topic:
      "from-white to-orange-50/80 border-orange-100 hover:border-orange-300 hover:shadow-orange-100",
    chevron: "group-hover:text-orange-500",
  },
  {
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    hover: "hover:border-rose-400 hover:shadow-rose-100",
    badge: "bg-rose-500",
    dot: "bg-rose-400 group-hover:bg-rose-600",
    topic:
      "from-white to-rose-50/80 border-rose-100 hover:border-rose-300 hover:shadow-rose-100",
    chevron: "group-hover:text-rose-500",
  },
  {
    bg: "from-cyan-50 to-sky-50",
    border: "border-cyan-200",
    hover: "hover:border-cyan-400 hover:shadow-cyan-100",
    badge: "bg-cyan-600",
    dot: "bg-cyan-400 group-hover:bg-cyan-600",
    topic:
      "from-white to-cyan-50/80 border-cyan-100 hover:border-cyan-300 hover:shadow-cyan-100",
    chevron: "group-hover:text-cyan-500",
  },
];

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

  if (!path)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
      {/* Back Button */}
      <button
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/app/dashboard")
        }
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-xl w-fit transition-all duration-200 shadow-sm"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Hero Card */}
      <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-7 text-white overflow-hidden shadow-xl shadow-blue-300/40">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
        <div className="absolute top-4 right-24 w-16 h-16 bg-white/5 rounded-full blur-lg" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">
                Learning Path
              </p>
              <h1 className="text-2xl font-extrabold capitalize leading-tight">
                {path.subject}
              </h1>
            </div>
            <span className="shrink-0 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
              {path.level}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              <Clock size={13} />
              {path.duration}
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              <BookOpen size={13} />
              {path.roadmap?.[0]?.weeks?.length || 0} Weeks
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              <Layers size={13} />
              {path.roadmap?.[0]?.weeks?.reduce(
                (acc, w) => acc + w.topics.length,
                0,
              ) || 0}{" "}
              Topics
            </div>
          </div>
        </div>
      </div>

      {/* Weeks */}
      <div className="flex flex-col gap-4">
        {path.roadmap?.[0]?.weeks?.map((week, index) => {
          const color = weekColors[index % weekColors.length];
          return (
            <div
              key={week.week_number}
              className={`bg-linear-to-br ${color.bg} rounded-2xl border-2 ${color.border} ${color.hover} shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              {/* Week Header */}
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 ${color.badge} text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0`}
                >
                  {week.week_number}
                </span>
                <h3 className="font-extrabold text-base text-gray-900">
                  {week.title}
                </h3>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {week.topics.map((topic, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      navigate(
                        `/app/generate/${id}/${encodeURIComponent(topic)}`,
                        { state: { level: path.level } },
                      )
                    }
                    className={`group flex items-center justify-between gap-3 px-4 py-3 bg-linear-to-br ${color.topic} rounded-xl border cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${color.dot} shrink-0 transition-colors`}
                      />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                        {topic}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-gray-300 ${color.chevron} group-hover:translate-x-0.5 transition-all duration-150 shrink-0`}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleLearningPath;
