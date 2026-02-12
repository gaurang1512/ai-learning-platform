import { markWeekCompleted } from "../services/learningPathApi.js";

const WeekCard = ({ week, pathId, refresh }) => {
  const handleComplete = async () => {
    await markWeekCompleted({
      pathId,
      weekNumber: week.week_number,
    });
    refresh();
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <h4>
        Week {week.week_number}: {week.title}
      </h4>

      <ul>
        {week.topics.map((topic, i) => (
          <li key={i}>{topic}</li>
        ))}
      </ul>

      {!week.completed && (
        <button onClick={handleComplete}>Mark as Completed</button>
      )}

      {week.completed && <p>✅ Completed</p>}
    </div>
  );
};

export default WeekCard;
