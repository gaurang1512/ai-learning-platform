import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../main";

const RegisterTeacher = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/register/teacher`, {
        name,
        email,
        password,
      });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
      );
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <section className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-3/5 flex flex-col gap-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Empower Your Teaching with{" "}
            <span className="text-amber-400">Advanced Educator Tools</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Create interactive courses, manage your student community, and track
            learning progress with our comprehensive teacher dashboard.
          </p>
        </div>

        <form
          className="lg:w-2/5 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10 flex flex-col gap-5 shadow-2xl transition-all duration-300"
          onSubmit={submitHandler}
        >
          <div className="flex flex-col gap-1 mb-2">
            <h2 className="text-white text-3xl font-black tracking-tight">
              Teacher Sign Up
            </h2>
            <p className="text-slate-400 font-medium">
              Create your educator account today.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
              Full Name
            </label>
            <input
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prof. Jane Smith"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.smith@academy.edu"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-slate-900 py-3 px-6 rounded-xl text-sm font-semibold shadow-lg shadow-amber-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            disabled={btnLoading}
          >
            {btnLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-slate-800 text-center">
            <Link
              to="/register"
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              Back to selection
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              Already have an account?{" "}
              <span className="text-amber-400 font-semibold hover:text-amber-300 underline underline-offset-4">
                Sign In
              </span>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterTeacher;
