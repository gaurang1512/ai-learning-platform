import { markWeekCompleted } from "../services/learningPathApi.js";
import { CheckCircle, BookOpen, ChevronRight } from "lucide-react";

const WeekCard = ({ week, pathId, refresh }) => {
  const handleComplete = async () => {
    await markWeekCompleted({
      pathId,
      weekNumber: week.week_number,
    });
    refresh();
  };

  return (
    <div className={`rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all duration-200
      ${week.completed
        ? "bg-green-50/60 border-green-200"
        : "bg-white border-blue-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100 hover:-translate-y-0.5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm
            ${week.completed
              ? "bg-green-500 text-white shadow-green-200"
              : "bg-blue-600 text-white shadow-blue-200"
            }`}
          >
            {week.week_number}
          </div>
          <h4 className={`font-extrabold text-base leading-tight
            ${week.completed ? "text-green-800" : "text-gray-900"}`}
          >
            {week.title}
          </h4>
        </div>

        {week.completed && (
          <div className="flex items-center gap-1.5 bg-green-100 border border-green-200 text-green-700 text-xs font-bold px-3 py-1 rounded-full shrink-0">
            <CheckCircle size={12} />
            Completed
          </div>
        )}
      </div>

      {/* Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {week.topics.map((topic, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors
              ${week.completed
                ? "bg-green-100/50 border-green-200 text-green-700"
                : "bg-blue-50/60 border-blue-100 text-gray-600"
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0
              ${week.completed ? "bg-green-500" : "bg-blue-400"}`}
            />
            {topic}
          </div>
        ))}
      </div>

      {/* Action */}
      {!week.completed && (
        <div className="pt-3 border-t border-blue-100">
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all duration-200 group"
          >
            <CheckCircle size={15} />
            Mark as Completed
            <ChevronRight size={14} className="ml-auto group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WeekCard;