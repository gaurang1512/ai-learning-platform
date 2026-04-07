import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/apiInterceptor";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2, Trophy, Copy, Check } from "lucide-react";

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = Array.isArray(children)
      ? children.join("")
      : String(children ?? "");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-5 rounded-xl overflow-hidden shadow-lg border border-gray-700">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 px-2.5 py-1 rounded-lg transition-all duration-200"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="bg-gray-900 overflow-x-auto p-5">
        <code className="text-green-400 font-mono text-xs leading-relaxed block whitespace-pre">
          {children}
        </code>
      </div>
    </div>
  );
};

const TopicDetail = () => {
  const { topicName, learningPathId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level || "Beginner";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const storageKey = `topic_${learningPathId}_${topicName}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cachedData = localStorage.getItem(storageKey);
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
        const res = await api.post("/api/v1/generate", {
          topicName,
          learningPathId,
          level,
        });
        const topicData = res.data;
        setData(topicData);
        try {
          localStorage.setItem(storageKey, JSON.stringify(topicData));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load topic content. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topicName, learningPathId, level, storageKey]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-700 font-bold text-base">
            Generating your learning material
          </p>
          <p className="text-gray-400 text-sm">
            This may take a few seconds...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-7 bg-red-50 rounded-2xl border-2 border-red-100 text-center flex flex-col gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
          <span className="text-red-500 text-xl font-bold">!</span>
        </div>
        <p className="text-red-600 font-semibold text-sm">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors duration-200 shadow-sm shadow-red-200 w-fit mx-auto"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-xl w-fit transition-all duration-200 shadow-sm group"
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        Back to Path
      </button>

      {/* Hero Banner */}
      <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-7 text-white overflow-hidden shadow-xl shadow-blue-300/40">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col gap-2">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">
            Topic
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
            {decodeURIComponent(topicName)}
          </h1>
          <span className="mt-1 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
            {level}
          </span>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm overflow-hidden">
        {/* Content Body */}
        <div className="p-7 md:p-10">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-extrabold text-gray-900 mt-8 mb-3 pb-2 border-b-2 border-blue-100 first:mt-0"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-bold text-gray-800 mt-6 mb-2"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-gray-600 leading-relaxed mb-4 text-sm"
                  {...props}
                />
              ),
              code: ({ node, inline, children, className, ...props }) => {
                // Detect if it's a block: has a language class OR content has newlines
                const isBlock =
                  className?.startsWith("language-") ||
                  String(children).includes("\n");

                if (!isBlock) {
                  return (
                    <code
                      className="bg-gray-900 text-green-400 border border-gray-700 px-1.5 py-0.5 rounded-lg font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return <CodeBlock>{children}</CodeBlock>;
              },
              ul: ({ node, ...props }) => (
                <ul className="flex flex-col gap-1.5 mb-4 pl-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="flex flex-col gap-1.5 mb-4 pl-1 list-decimal list-inside"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li
                  className="flex items-start gap-2 text-sm text-gray-600"
                  {...props}
                />
              ),
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>

        {/* Quiz CTA */}
        <div className="px-7 md:px-10 py-6 bg-linear-to-br from-blue-50 to-indigo-50 border-t-2 border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 text-center sm:text-left">
            <p className="text-gray-900 font-extrabold text-base">
              Ready to test your knowledge?
            </p>
            <p className="text-gray-400 text-sm">
              Take a short quiz on this topic.
            </p>
          </div>
          <button
            onClick={() => {
              setIsNavigating(true);
              setTimeout(() => {
                navigate(
                  `/app/quiz/${learningPathId}/${encodeURIComponent(topicName)}`,
                  { state: { level } },
                );
              }, 300);
            }}
            disabled={isNavigating}
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed group shrink-0"
          >
            {isNavigating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            )}
            {isNavigating ? "Initializing Quiz..." : "Start Topic Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
