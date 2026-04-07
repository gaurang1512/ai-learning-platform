import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/apiInterceptor";
import {
  ArrowLeft,
  Trophy,
  CheckCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";

const QuizPage = () => {
  const { topicName, learningPathId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level || "Beginner";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const storageKey = `topic_${learningPathId}_${topicName}`;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const cachedData = localStorage.getItem(storageKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.quiz && parsed.quiz.length > 0) {
            setData(parsed);
            setLoading(false);
            return;
          }
        }
        const res = await api.post("/api/v1/generate", {
          topicName,
          learningPathId,
          level,
        });
        setData(res.data);
      } catch (err) {
        setError(
          "Failed to initialize quiz. Please return to the topic content and try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [topicName, learningPathId, level, storageKey]);

  const handleAnswerSelect = (optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const submitQuiz = () => {
    let calculatedScore = 0;
    data.quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) calculatedScore++;
    });
    setScore(calculatedScore);
    setQuizSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const scorePercent = Math.round((score / (data?.quiz?.length || 1)) * 100);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 py-6">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-700 font-bold text-base">
            Preparing your quiz
          </p>
          <p className="text-gray-400 text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.quiz) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-7 bg-red-50 rounded-2xl border-2 border-red-100 text-center flex flex-col gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle size={22} className="text-red-500" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-gray-800 font-bold text-base">Quiz Unavailable</p>
          <p className="text-red-500 text-sm font-medium">
            {error || "The quiz content could not be loaded."}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 shadow-sm w-fit mx-auto flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          Back to Topic
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Hero Banner */}
        <div className="w-full">
          <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-blue-300/40">
            <div className="absolute -top-6 -right-6 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-4 w-28 h-28 bg-indigo-400/20 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">
                  Quiz
                </p>
                <h1 className="text-xl md:text-2xl font-extrabold leading-tight">
                  {decodeURIComponent(topicName)}
                </h1>
                <span className="mt-1 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                  {level}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2.5 rounded-xl shrink-0">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold text-white">
                  {data.quiz.length} Qs
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-xl w-fit transition-all duration-200 shadow-sm group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            />
            Exit Quiz
          </button>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm overflow-hidden">
        {!quizSubmitted ? (
          <div className="p-7 md:p-10 flex flex-col gap-7">
            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Question {currentQuestion + 1} of {data.quiz.length}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {Math.round(((currentQuestion + 1) / data.quiz.length) * 100)}
                  %
                </span>
              </div>
              <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden border border-blue-100">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentQuestion + 1) / data.quiz.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="flex flex-col gap-5 min-h-280px">
              <h2 className="text-lg md:text-xl font-extrabold text-gray-900 leading-tight">
                {data.quiz[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {data.quiz[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestion] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`group w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                            : "border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center shrink-0 font-extrabold text-sm transition-all
                        ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-200 bg-white text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span
                        className={`text-sm font-semibold leading-relaxed transition-colors
                        ${isSelected ? "text-blue-900" : "text-gray-600 group-hover:text-gray-900"}`}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-5 border-t border-blue-100">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
                className="text-sm font-bold text-gray-400 hover:text-gray-700 disabled:opacity-0 transition-colors px-2"
              >
                ← Previous
              </button>

              {currentQuestion === data.quiz.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  disabled={
                    Object.keys(selectedAnswers).length < data.quiz.length
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                >
                  <Trophy size={15} />
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(data.quiz.length - 1, prev + 1),
                    )
                  }
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Score Banner */}
            <div
              className={`p-8 text-center flex flex-col items-center gap-4 bg-linear-to-br 
              ${
                scorePercent >= 70
                  ? "bg-gradient from-green-500 to-emerald-600"
                  : scorePercent >= 40
                    ? "bg-gradient from-yellow-400 to-orange-500"
                    : "bg-gradient from-red-500 to-rose-600"
              }`}
            >
              <div className="w-20 h-20 bg-white/20 border-4 border-white/30 rounded-3xl flex items-center justify-center">
                <Trophy size={40} className="text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-extrabold text-white">
                  Quiz Complete!
                </h2>
                <p className="text-white/80 text-sm font-medium">
                  You successfully completed the assessment
                </p>
              </div>
              <div className="bg-white/20 border border-white/30 rounded-2xl px-8 py-4 flex flex-col items-center gap-1">
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
                  Your Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">
                    {score}
                  </span>
                  <span className="text-2xl font-bold text-white/60">
                    / {data.quiz.length}
                  </span>
                </div>
                <span className="text-white font-bold text-sm mt-1">
                  {scorePercent >= 70
                    ? "🎉 Great job!"
                    : scorePercent >= 40
                      ? "👍 Keep going!"
                      : "📚 Review needed"}
                </span>
              </div>
            </div>

            {/* Review Answers */}
            <div className="p-7 md:p-10 flex flex-col gap-5">
              <h3 className="font-extrabold text-lg text-gray-900">
                Review Answers
              </h3>

              <div className="flex flex-col gap-4">
                {data.quiz.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border-2 overflow-hidden transition-all
                        ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}
                    >
                      {/* Question Header */}
                      <div
                        className={`flex items-center gap-3 px-5 py-3 border-b-2
                        ${isCorrect ? "border-green-200 bg-green-100/50" : "border-red-200 bg-red-100/50"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                          ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {isCorrect ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <AlertCircle size={16} className="text-white" />
                          )}
                        </div>
                        <p className="font-bold text-gray-800 text-sm leading-snug">
                          {idx + 1}. {q.question}
                        </p>
                      </div>

                      {/* Answer Details */}
                      <div className="px-5 py-4 flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-90px">
                            Your Answer:
                          </span>
                          <span
                            className={`text-sm font-bold ${isCorrect ? "text-green-700" : "text-red-600"}`}
                          >
                            {q.options[selectedAnswers[idx]]}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-90px">
                              Correct:
                            </span>
                            <span className="text-sm font-bold text-green-700">
                              {q.options[q.correctAnswer]}
                            </span>
                          </div>
                        )}
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 italic leading-relaxed">
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={resetQuiz}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 text-sm font-bold rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-200"
                >
                  <RotateCcw size={15} />
                  Try Again
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all duration-200"
                >
                  <BookOpen size={15} />
                  Back to Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
