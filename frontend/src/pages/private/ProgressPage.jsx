import React, { useEffect, useState } from "react";
import api from "../../services/apiInterceptor";
import { toast } from "react-toastify";
import { Loader2, CheckCircle, Clock, BookOpen, BarChart2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const ProgressPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setError(null);
        const { data } = await api.get("/api/v1/my-paths");
        const normalized = Array.isArray(data) ? data : data?.paths || [];
        setPaths(normalized);
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to fetch progress data";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            api
              .get("/api/v1/my-paths")
              .then(({ data }) => {
                const normalized = Array.isArray(data) ? data : data?.paths || [];
                setPaths(normalized);
              })
              .catch((err) => {
                const msg = err.response?.data?.message || "Failed to fetch progress data";
                setError(msg);
                toast.error(msg);
              })
              .finally(() => setLoading(false));
          }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Calculating your progress...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalPaths = paths.length;
  const completedPaths = paths.filter(p => p.status === 'completed').length;
  
  let totalTopics = 0;
  let completedTopics = 0;
  const topicsList = [];

  paths.forEach(path => {
    path.roadmap?.forEach(phase => {
      phase.weeks?.forEach(week => {
        week.topics?.forEach(topic => {
          totalTopics++;
          if (week.completed) {
            completedTopics++;
            topicsList.push({
              name: topic,
              path: path.subject,
              pathId: path._id,
              date: week.updatedAt || path.updatedAt
            });
          }
        });
      });
    });
  });

  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const topicsInProgress = [];
  const topicsWithCompletion = [];

  paths.forEach(path => {
    path.roadmap?.forEach(phase => {
      phase.weeks?.forEach(week => {
        week.topics?.forEach(topic => {
          const topicData = {
            name: topic,
            path: path.subject,
            pathId: path._id,
            completed: week.completed,
            percent: week.completed ? 100 : 0
          };
          topicsWithCompletion.push(topicData);
          if (!week.completed && path.status !== 'completed') {
            topicsInProgress.push(topicData);
          }
        });
      });
    });
  });

  return (
    <div className="flex flex-col w-full align-center justify-center mx-auto p-6 transition-colors duration-200">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Progress</h1>
          <p className="text-muted-foreground mt-2">Track your journey and celebrate your achievements.</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
            <BookOpen size={20} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Paths</p>
          <p className="text-2xl font-bold text-foreground">{totalPaths}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Completed Paths</p>
          <p className="text-2xl font-bold text-foreground">{completedPaths}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
            <Clock size={20} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-foreground">{totalPaths - completedPaths}</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        

        {/* Sidebar Info */}
        <div className="space-y-6">
          
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
