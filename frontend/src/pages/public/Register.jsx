import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../main";
import axios from "axios";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  //use to navigate to verify page after login
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(`${server}/api/v1/register`, {
        //sending data in body to pass to backend
        name,
        email,
        password,
      });
      toast.success(data.message);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred",
      );
      setBtnLoading(false);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="relative w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="hidden lg:flex flex-col justify-between w-5/12 bg-gradient from-slate-900 via-slate-800 to-slate-900 p-10 border-r border-slate-700/50">
          <h1 className="text-3xl font-bold text-white leading-snug">
            Join Our Community of{" "}
            <span className="text-amber-400">Lifelong Learners</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your account today and unlock a world of personalized
            learning experiences tailored to your goals.
          </p>
        </div>
        <form onSubmit={submitHandler} className="flex-1 bg-slate-900 p-8 sm:p-10 space-y-5">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Sign Up</h2>

          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-200"
            />
          </div>
          <button
            disabled={btnLoading}
            className="w-full flex items-center justify-center bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-lg shadow-amber-400/20 active:scale-[0.98]"
          >
            {btnLoading ? "Creating account..." : "Register"}
          </button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-slate-500 hover:text-amber-400 transition-colors duration-150">
              Already have an account?{" "}
              <span className="text-amber-400 font-semibold">Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
