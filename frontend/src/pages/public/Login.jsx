import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../main";
import api from "../../services/apiInterceptor";
import { AppData } from "../../context/AppContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const navigate = useNavigate();
  const { refetchUser } = AppData();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/v1/login`, {
        email,
        password,
      });
      toast.success(data.message);
      localStorage.setItem("email", email);
      await refetchUser();
      navigate("/app");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
      );
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500 opacity-5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient from-slate-900 via-slate-800 to-slate-900 p-10 border-r border-slate-700/50">
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30">
              <svg
                className="w-5 h-5 text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <span className="text-slate-100 font-semibold text-lg tracking-tight">
              StudyLLM
            </span>
          </div>

          {/* Main copy */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-white leading-snug">
                Your AI-powered
                <br />
                <span className="text-amber-400">study companion</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ask questions, explore concepts, and accelerate your learning
                with an LLM tutor available 24/7.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-2.5">
              {[
                { icon: "💬", text: "Chat with course material" },
                { icon: "🧠", text: "Concept breakdowns & flashcards" },
                { icon: "📊", text: "Track learning progress" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3 border border-slate-700/50"
                >
                  <span className="text-base">{icon}</span>
                  <span className="text-slate-300 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <p className="text-slate-600 text-xs">
            "The best students ask the best questions."
          </p>
        </div>

        {/* Right — Login form */}
        <div className="flex-1 bg-slate-900 p-8 sm:p-10 flex flex-col justify-center">
          {/* Header Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LLM Online
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={submitHandler} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-widest"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-widest"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors duration-150 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={btnLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 active:scale-[0.98]"
            >
              {btnLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-1">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-150"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors duration-150"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
