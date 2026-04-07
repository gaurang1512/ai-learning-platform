import { Link } from "react-router-dom";

const RegisterLanding = () => {
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Choose Your Account Type
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Select the path that best describes your role in the learning
            ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teacher Card */}
          <div className="flex flex-col gap-5 bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-2xl p-7 shadow-xl transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400/20 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-white">
                Register as a Teacher
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create courses, manage students, and access teacher-only tools
                to empower your teaching.
              </p>
            </div>
            <Link
              to="/register/teacher"
              title="Teacher accounts can publish content and manage classrooms"
              className="mt-auto w-full text-center bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-lg shadow-amber-400/20 active:scale-[0.98]"
            >
              Continue as Teacher
            </Link>
          </div>

          {/* Student Card */}
          <div className="flex flex-col gap-5 bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-2xl p-7 shadow-xl transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-400/20 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
              </svg>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-white">
                Register as a Student
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join classes, track progress, and access student resources to
                accelerate your learning.
              </p>
            </div>
            <Link
              to="/register/student"
              title="Student accounts enroll in classes and view assignments"
              className="mt-auto w-full text-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-400/40 text-slate-100 font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 active:scale-[0.98]"
            >
              Continue as Student
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/login"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
          >
            Already have an account?{" "}
            <span className="text-amber-400 font-semibold hover:text-amber-300">
              Log In
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterLanding;
