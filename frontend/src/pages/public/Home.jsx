import { Link, useNavigate } from "react-router-dom";
import { AppData } from "../../context/AppContext";

function Home() {
  const { isAuth } = AppData();
  const navigate = useNavigate();

  return (
    <div className=" bg-gradient from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
          🤖 AI-Powered Learning
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Welcome to <span className="text-blue-600">IntelliPath AI</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
          The ultimate platform for secure authentication and personalized
          learning paths.
        </p>

        {/* Description */}
        <p className="text-base text-gray-400 leading-relaxed max-w-2xl">
          IntelliPath AI transforms the way you learn. Enter any subject, choose
          your level, and get a structured, personalized roadmap powered by
          Artificial Intelligence. No confusion. No scattered resources. Just a
          clear path to mastery.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "🗺️ Structured Roadmaps",
            "⚡ Instant Generation",
            "🎯 Any Skill Level",
          ].map((item) => (
            <span
              key={item}
              className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          {isAuth ? (
            <Link
              to="/app/learning-path"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-200 transition-colors duration-200"
            >
              Create a Learning Path
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-200 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold px-8 py-3 rounded-xl border border-gray-200 shadow-sm transition-colors duration-200"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
